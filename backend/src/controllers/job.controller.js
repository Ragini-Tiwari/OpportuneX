import Job from "../models/Job.js";
import Company from "../models/Company.js";
import {
    buildJobFilters,
    buildPagination,
    buildSort
} from "../utils/queryBuilder.js";
import { NotFoundError } from "../utils/errorHandler.js";

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
    try {
        // Build filters using utility
        const filters = buildJobFilters(req.query);

        // Build pagination and sorting
        const { page, limit, skip } = buildPagination(req.query);
        const sort = buildSort(req.query);

        // Execute query
        const jobs = await Job.find(filters)
            .populate("company", "name logo location")
            .populate("postedBy", "name email")
            .limit(limit)
            .skip(skip)
            .sort(sort);

        const total = await Job.countDocuments(filters);

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
        console.error("Get all jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("company", "name logo location description industry size website")
            .populate("postedBy", "name email");

        if (!job) {
            throw new NotFoundError("Job");
        }

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Get job error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
export const createJob = async (req, res) => {
    try {
        // Create job with postedBy field
        // Note: status will default to pending_approval as per model
        const job = await Job.create({
            ...req.body,
            postedBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully and pending approval",
            data: job,
        });
    } catch (error) {
        console.error("Create job error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin - own jobs)
export const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            throw new NotFoundError("Job");
        }

        // Check ownership (only job poster or admin can update)
        if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this job",
            });
        }

        // If status is being updated to active, ensure it's approved
        if (req.body.status === 'active' && !job.isApproved && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: "Cannot activate job before admin approval",
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Update job error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin - own jobs)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            throw new NotFoundError("Job");
        }

        // Check ownership
        if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this job",
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Delete job error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Recruiter/Admin)
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id })
            .populate("company", "name logo")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error) {
        console.error("Get my jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get today's jobs
// @route   GET /api/jobs/today
// @access  Public
export const getTodaysJobs = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const jobs = await Job.find({
            status: "active",
            isApproved: true,
            createdAt: { $gte: startOfDay },
        })
            .populate("company", "name logo location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error) {
        console.error("Get today's jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
