import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Joi from "joi";

// Validation schema
const applicationSchema = Joi.object({
    job: Joi.string().required(),
    resume: Joi.string().required().uri(),
    coverLetter: Joi.string().optional(),
});

// @desc    Create application
// @route   POST /api/applications
// @access  Private (Candidate)
export const createApplication = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = applicationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { job, resume, coverLetter } = value;

        // Check if job exists
        const jobExists = await Job.findById(job);
        if (!jobExists) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job,
            applicant: req.user.id,
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job",
            });
        }

        // Create application
        const application = await Application.create({
            job,
            applicant: req.user.id,
            resume,
            coverLetter,
        });

        // Increment applications count
        await Job.findByIdAndUpdate(job, {
            $inc: { applicationsCount: 1 },
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application,
        });
    } catch (error) {
        console.error("Create application error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get all applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter/Admin)
export const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Check if job exists and user owns it
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view applications for this job",
            });
        }

        const applications = await Application.find({ job: jobId })
            .populate("applicant", "name email phone skills experience")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: applications,
            count: applications.length,
        });
    } catch (error) {
        console.error("Get job applications error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
export const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate("job", "title company location jobType salary status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: applications,
            count: applications.length,
        });
    } catch (error) {
        console.error("Get my applications error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        // Validate status
        const validStatuses = [
            "pending",
            "reviewing",
            "shortlisted",
            "rejected",
            "accepted",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const application = await Application.findById(req.params.id).populate(
            "job"
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check if user owns the job
        if (
            application.job.postedBy.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application",
            });
        }

        application.status = status;
        if (notes) {
            application.notes = notes;
        }
        await application.save();

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application,
        });
    } catch (error) {
        console.error("Update application status error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Candidate - own application)
export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        // Check ownership
        if (application.applicant.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this application",
            });
        }

        await application.deleteOne();

        // Decrement applications count
        await Job.findByIdAndUpdate(application.job, {
            $inc: { applicationsCount: -1 },
        });

        res.status(200).json({
            success: true,
            message: "Application deleted successfully",
        });
    } catch (error) {
        console.error("Delete application error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
