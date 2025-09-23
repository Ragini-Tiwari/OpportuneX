const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    provider: { type: String, enum: ["local", "google", "github"], default: "local" },
    providerId: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["user", "admin", "guest"], default: "user" },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerifyToken: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
