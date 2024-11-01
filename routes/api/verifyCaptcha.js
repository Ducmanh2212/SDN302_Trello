const express = require("express");
const router = express.Router();
require("dotenv").config();

router.post("/verifyCaptcha", async (req, res) => {
  const { captcha } = req.body;
  const secret = process.env.CAPTCHA_SECRET;

  if (!captcha) {
    return res.status(400).json({ errors: [{ msg: "Captcha is required" }] });
  }

  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      const text = await response.text(); // Get the text response
      return res.status(500).json({
        error: "Error communicating with reCAPTCHA API",
        details: text,
      });
    }

    const data = await response.json();

    if (data.success) {
      return res.json({ success: true });
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: "Captcha verification failed" }] });
    }
  } catch (error) {
    console.error("Error in verifyCaptcha:", error);
    res.status(500).json({ error: "Server error during CAPTCHA verification" });
  }
});

module.exports = router;
