// controllers/AuthController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");

// Helper function for error handling
const handleError = (res, error, defaultMessage = "Server Error") => {
  console.error(error.message);
  return res.status(500).json({ message: defaultMessage });
};

// Get authorized user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    handleError(res, error, "Failed to retrieve user");
  }
};

// Authenticate user & get token
const authenticateUser = async (req, res) => {
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
  } catch (error) {
    handleError(res, error, "Failed to authenticate user");
  }
};

module.exports = {
  getUser,
  authenticateUser,
};
