import express from "express";
import {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    getAllJobsAdmin,
    approveJob,
    toggleUserBlock,
    getAdminLogs,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleUserBlock);
router.delete("/users/:id", deleteUser);
router.get("/jobs", getAllJobsAdmin);
router.patch("/jobs/:id/approve", approveJob);
router.get("/logs", getAdminLogs);

export default router;
