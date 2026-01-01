import express from "express";
import {
    createApplication,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    deleteApplication,
    bulkUpdateStatus,
    getApplicationTimeline,
} from "../controllers/application.controller.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes
router.use(protect);

router.post("/", authorize("candidate"), createApplication);
router.get("/my", authorize("candidate"), getMyApplications);
router.get("/job/:jobId", authorize("recruiter", "admin"), getJobApplications);
router.patch("/:id/status", authorize("recruiter", "admin"), updateApplicationStatus);
router.patch("/bulk-status", authorize("recruiter", "admin"), bulkUpdateStatus);
router.get("/:id/timeline", getApplicationTimeline);
router.delete("/:id", authorize("candidate"), deleteApplication);

export default router;
