// user.controller.js

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../../models/User");

// Register user
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // See if user exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    // Register new user
    const user = new User({
      name,
      email,
      avatar: gravatar.url(email, { s: "200", r: "pg", d: "mm" }),
      password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
    });

    await user.save();

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
};

// Get users with email regex
const getUsersByEmail = async (req, res) => {
  try {
    const regex = new RegExp(req.params.input, "i");
    const users = await User.find({
      email: regex,
    }).select("-password");

    res.json(users.filter((user) => user.id !== req.user.id));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  registerUser,
  getUsersByEmail,
};
