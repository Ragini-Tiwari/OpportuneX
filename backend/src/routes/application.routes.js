import express from "express";
import {
    createApplication,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    deleteApplication,
} from "../controllers/application.controller.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Candidate routes
router.post("/", protect, authorize("candidate"), createApplication);
router.get("/my", protect, authorize("candidate"), getMyApplications);
router.delete("/:id", protect, authorize("candidate"), deleteApplication);

// Recruiter/Admin routes
router.get(
    "/job/:jobId",
    protect,
    authorize("recruiter", "admin"),
    getJobApplications
);
router.put(
    "/:id/status",
    protect,
    authorize("recruiter", "admin"),
    updateApplicationStatus
);

export default router;
