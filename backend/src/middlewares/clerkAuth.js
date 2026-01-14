import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Middleware to protect routes with Clerk Authentication
// This middleware expects a Bearer token in the Authorization header
export const clerkAuth = ClerkExpressRequireAuth({
    // Optional: Add custom error handling
    onError: (err, req, res, next) => {
        console.error('Clerk Auth Error:', err);
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
            error: err.message
        });
    }
});

// Helper to get user ID from request (Clerk adds it to req.auth)
export const getUserId = (req) => {
    return req.auth?.userId;
};
