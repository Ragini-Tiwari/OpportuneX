const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1]);
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

module.exports = authMiddleware;
