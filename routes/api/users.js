// routes/api/user.routes.js
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const {
  registerUser,
  getUsersByEmail,
} = require("../../controllers/user.controller");

// Route for registering a new user
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  registerUser
);

// Route for getting users by email regex
router.get("/:input", auth, getUsersByEmail);

module.exports = router;
