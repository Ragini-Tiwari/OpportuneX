const generateToken = require("../utils/generateToken");

exports.oauthCallback = (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "OAuth failed" });

  const token = generateToken(user._id);
  res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 3600000, path: "/" });
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
};
