const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. Insufficient role." });
    }
    next();
  };
};

module.exports = roleMiddleware;
