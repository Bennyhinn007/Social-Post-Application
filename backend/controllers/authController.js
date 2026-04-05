const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  normalizeString,
  validateEmail,
  validateUsername,
  validatePasswordStrength,
} = require("../utils/validation");

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

/**
 * Register a new user account.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    const normalizedEmail = normalizeString(email).toLowerCase();
    const normalizedUsername = normalizeString(username);
    const normalizedPassword = typeof password === "string" ? password : "";

    if (!validateUsername(normalizedUsername)) {
      return res
        .status(400)
        .json({
          message:
            "Username must be 2-30 chars and contain only letters, numbers, or _.",
        });
    }

    if (!validateEmail(normalizedEmail)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address." });
    }

    if (!validatePasswordStrength(normalizedPassword)) {
      return res
        .status(400)
        .json({
          message:
            "Password must be 8-128 chars and include letters and numbers.",
        });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username is already in use." });
    }

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

    const user = await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register user." });
  }
};

/**
 * Authenticate an existing user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<import("express").Response>}
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const normalizedEmail = normalizeString(email).toLowerCase();
    const normalizedPassword = typeof password === "string" ? password : "";

    if (!validateEmail(normalizedEmail)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid email address." });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(
      normalizedPassword,
      user.password,
    );

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login." });
  }
};

module.exports = {
  signup,
  login,
};
