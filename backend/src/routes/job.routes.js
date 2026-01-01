import express from "express";
import {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getTodaysJobs,
} from "../controllers/job.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../constants/index.js";

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get("/today", getTodaysJobs);
router.get("/:id", getJob);

// Protected routes
router.post("/", protect, authorize(ROLES.RECRUITER, ROLES.ADMIN), createJob);
router.put("/:id", protect, authorize(ROLES.RECRUITER, ROLES.ADMIN), updateJob);
router.delete("/:id", protect, authorize(ROLES.RECRUITER, ROLES.ADMIN), deleteJob);
router.get("/my/jobs", protect, authorize(ROLES.RECRUITER, ROLES.ADMIN), getMyJobs);

export default router;
