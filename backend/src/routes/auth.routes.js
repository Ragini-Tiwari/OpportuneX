import express from "express";
import { register, login, getMe, logout } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
