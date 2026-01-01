import express from "express";
import {
    createCompany,
    updateCompany,
    getCompany,
    getMyCompanies,
    addRecruiter,
} from "../controllers/company.controller.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/:id", getCompany);

// Protected routes
router.use(protect);

router.get("/my/all", authorize("recruiter"), getMyCompanies);
router.post("/", authorize("recruiter", "admin"), createCompany);
router.put("/:id", authorize("recruiter", "admin"), updateCompany);
router.post("/:id/recruiters", authorize("recruiter", "admin"), addRecruiter);

export default router;
