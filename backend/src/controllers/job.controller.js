import Job from "../models/Job.js";
import Joi from "joi";

// Validation schema
const jobSchema = Joi.object({
    title: Joi.string().required().trim(),
    company: Joi.string().required().trim(),
    description: Joi.string().required(),
    requirements: Joi.string().required(),
    location: Joi.string().required().trim(),
    jobType: Joi.string()
        .valid("Full-time", "Part-time", "Contract", "Internship")
        .default("Full-time"),
    workMode: Joi.string().valid("Remote", "Onsite", "Hybrid").default("Onsite"),
    salary: Joi.object({
        min: Joi.number().min(0).default(0),
        max: Joi.number().min(0).default(0),
        currency: Joi.string().default("USD"),
    }).optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    experience: Joi.object({
        min: Joi.number().min(0).default(0),
        max: Joi.number().min(0).default(0),
    }).optional(),
    category: Joi.string()
        .valid(
            "Engineering",
            "Design",
            "Marketing",
            "Sales",
            "Product",
            "Operations",
            "HR",
            "Finance",
            "Other"
        )
        .default("Other"),
    applicationDeadline: Joi.date().optional(),
    status: Joi.string().valid("active", "closed", "draft").default("active"),
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            category,
            jobType,
            workMode,
            location,
            status = "active",
        } = req.query;

        // Build query
        const query = { status };

        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            query.category = category;
        }

        if (jobType) {
            query.jobType = jobType;
        }

        if (workMode) {
            query.workMode = workMode;
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Execute query with pagination
        const jobs = await Job.find(query)
            .populate("postedBy", "name email company")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Job.countDocuments(query);

        res.status(200).json({
            success: true,
            data: jobs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error("Get all jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            "postedBy",
            "name email company"
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (error) {
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
        // Validate request body
        const { error, value } = jobSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        // Create job with postedBy field
        const job = await Job.create({
            ...value,
            postedBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (error) {
        console.error("Create job error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
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
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Check ownership (only job poster or admin can update)
        if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this job",
            });
        }

        // Validate request body
        const { error, value } = jobSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, value, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    } catch (error) {
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
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
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
        const jobs = await Job.find({ postedBy: req.user.id }).sort({
            createdAt: -1,
        });

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
