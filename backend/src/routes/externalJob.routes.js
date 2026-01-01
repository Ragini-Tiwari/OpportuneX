import express from "express";
import {
    getAllExternalJobs,
    getExternalJob,
    getTodaysExternalJobs,
} from "../controllers/externalJob.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllExternalJobs);
router.get("/today", getTodaysExternalJobs);
router.get("/:id", getExternalJob);

export default router;
