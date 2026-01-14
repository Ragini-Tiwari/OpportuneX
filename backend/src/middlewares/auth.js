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
    import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

    // Protect middleware using Clerk
    export const protect = [
        ClerkExpressRequireAuth(),
        (req, res, next) => {
            // Map Clerk auth object to req.user for compatibility
            if (req.auth) {
                req.user = {
                    _id: req.auth.userId,
                    // Extract role from public metadata if configured in Clerk, else default
                    role: req.auth.sessionClaims?.publicMetadata?.role || "candidate",
                    email: req.auth.sessionClaims?.email
                };
            }
            next();
        }
    ];

    // Grant access to specific roles
    export const authorize = (...roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Not authorized to access this route",
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `User role ${req.user.role} is not authorized to access this route`,
                });
            }
            next();
        };
    };
