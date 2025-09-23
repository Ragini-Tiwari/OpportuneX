const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

// Cookie options
const cookieOptions = () => {
  const ms = process.env.JWT_EXPIRES.includes("h") ? parseInt(process.env.JWT_EXPIRES) * 60 * 60 * 1000 : 3600000;
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: ms, path: "/" };
};

// Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions());
    res.status(201).json({ message: "Registered", user: { id: user._id, name, email } });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions());
    res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
};

// Logout
exports.logoutUser = async (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out" });
};

// Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
};

// Password Reset Request
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await sendEmail({ to: user.email, subject: "Password Reset", text: `Click link: ${resetUrl}` });

  res.status(200).json({ message: "Password reset email sent" });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: "New password required" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "Token invalid or expired" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
};

// Send email verification
exports.sendEmailVerification = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(20).toString("hex");
  user.emailVerifyToken = crypto.createHash("sha256").update(token).digest("hex");
  await user.save();

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  await sendEmail({ to: user.email, subject: "Email Verification", text: `Click link: ${verifyUrl}` });

  res.status(200).json({ message: "Verification email sent" });
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({ emailVerifyToken: hashedToken });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
};
