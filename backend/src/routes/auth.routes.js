import express from "express";
import { register, login, getMe, logout, refresh } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes
router.use(protect);
router.get("/me", getMe);
router.put("/profile", updateProfile);
router.post("/logout", logout);

export default router;
