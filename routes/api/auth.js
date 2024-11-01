const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
const passport = require("passport");

const User = require("../../models/User");

// Get authorized user
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Authenticate user & get token
router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      // Check for email and password match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }

      // Return jsonwebtoken
      jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Route để xác thực người dùng với Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route callback sau khi đăng nhập bằng Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Chuyển hướng nếu thất bại
  }),
  (req, res) => {
    // Nếu thành công, chuyển hướng đến dashboard hoặc trang chủ
    res.redirect("/dashboard");
  }
);

// Route để đăng xuất
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Route để lấy thông tin người dùng đã xác thực
router.get("/current_user", auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
