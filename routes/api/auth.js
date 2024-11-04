// routes/auth.js

const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const AuthController = require("../../controllers/auth.controller");

// Get authorized user
router.get("/", auth, AuthController.getUser);

// Authenticate user & get token
router.post(
  "/",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  AuthController.authenticateUser
);

module.exports = router;
