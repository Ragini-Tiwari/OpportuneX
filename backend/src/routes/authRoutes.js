const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const oauthController = require("../controllers/oauthController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Local auth
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.get("/profile", authMiddleware, authController.getProfile);

// Role-based example
router.delete("/admin-only", authMiddleware, roleMiddleware("admin"), (req, res) => res.send("Admin access granted"));

// Password reset
router.post("/request-reset", authController.requestPasswordReset);
router.post("/reset/:token", authController.resetPassword);

// Email verification
router.post("/send-verification", authMiddleware, authController.sendEmailVerification);
router.get("/verify-email/:token", authController.verifyEmail);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }), oauthController.oauthCallback);

// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }), oauthController.oauthCallback);

module.exports = router;
