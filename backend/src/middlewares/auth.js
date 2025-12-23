import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

// Protect routes - require authentication
export const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Check for token in cookies
    if (!token && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }

    try {
        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        // Get user from token
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }
};

// Authorize roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};
