import express from "express";
import {
    applyToJob,
    getJobApplications,
    getMyApplications,
    updateStatus,
} from "../controllers/application.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../constants/index.js";

const router = express.Router();

// Protected routes
router.use(protect);

router.post("/", authorize(ROLES.CANDIDATE), applyToJob);
router.get("/my", authorize(ROLES.CANDIDATE), getMyApplications);
router.get("/job/:jobId", authorize(ROLES.RECRUITER, ROLES.ADMIN), getJobApplications);
router.put("/:id/status", authorize(ROLES.RECRUITER, ROLES.ADMIN), updateStatus);

export default router;
