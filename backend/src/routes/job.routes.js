import express from "express";
import {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
} from "../controllers/job.controller.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJob);

// Protected routes
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);
router.get("/my/jobs", protect, authorize("recruiter", "admin"), getMyJobs);

export default router;
