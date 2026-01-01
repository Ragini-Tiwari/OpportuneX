import ExternalJob from "../models/ExternalJob.js";
import {
    buildExternalJobFilters,
    buildPagination,
    buildSort
} from "../utils/queryBuilder.js";
import { NotFoundError } from "../utils/errorHandler.js";

// @desc    Get all external jobs
// @route   GET /api/external-jobs
// @access  Public
export const getAllExternalJobs = async (req, res) => {
    try {
        // Build filters using utility
        const filters = buildExternalJobFilters(req.query);

        // Build pagination and sorting
        const { page, limit, skip } = buildPagination(req.query);
        const sort = buildSort(req.query);

        // Execute query
        const jobs = await ExternalJob.find(filters)
            .limit(limit)
            .skip(skip)
            .sort(sort);

        const total = await ExternalJob.countDocuments(filters);

        res.status(200).json({
            success: true,
            data: jobs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get all external jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get single external job
// @route   GET /api/external-jobs/:id
// @access  Public
export const getExternalJob = async (req, res) => {
    try {
        const job = await ExternalJob.findById(req.params.id);

        if (!job) {
            throw new NotFoundError("External Job");
        }

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Get external job error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get today's external jobs
// @route   GET /api/external-jobs/today
// @access  Public
export const getTodaysExternalJobs = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const jobs = await ExternalJob.find({
            isActive: true,
            postedDate: { $gte: startOfDay },
        }).sort({ postedDate: -1 });

        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error) {
        console.error("Get today's external jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
