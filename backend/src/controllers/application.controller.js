import Application from "../models/Application.js";
import Job from "../models/Job.js";
import * as atsService from "../services/ats.service.js";
import { NotFoundError, AuthorizationError, ValidationError } from "../utils/errorHandler.js";

// @desc    Create application
// @route   POST /api/applications
// @access  Private (Candidate)
export const createApplication = async (req, res) => {
    try {
        const { job, resume, coverLetter } = req.body;

        // Check if job exists
        const jobExists = await Job.findById(job);
        if (!jobExists) {
            throw new NotFoundError("Job");
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
            status: 'applied',
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
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
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

        const job = await Job.findById(jobId);
        if (!job) {
            throw new NotFoundError("Job");
        }

        if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
            throw new AuthorizationError();
        }

        const applications = await Application.find({ job: jobId })
            .populate("applicant", "name email phone skills experience")
            .sort({ createdAt: -1 });

        const stats = await atsService.getApplicationStats(jobId);

        res.status(200).json({
            success: true,
            data: applications,
            stats,
            count: applications.length,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error instanceof AuthorizationError) {
            return res.status(403).json({ success: false, message: error.message });
        }
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
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter/Admin)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status, notes, interviewDate, offerDetails, rejectionReason } = req.body;

        const application = await Application.findById(req.params.id).populate("job");
        if (!application) {
            throw new NotFoundError("Application");
        }

        if (application.job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
            throw new AuthorizationError();
        }

        const updatedApplication = await atsService.updateStatus(
            req.params.id,
            status,
            req.user.id,
            notes,
            { interviewDate, offerDetails, rejectionReason }
        );

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: updatedApplication,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error instanceof AuthorizationError) {
            return res.status(403).json({ success: false, message: error.message });
        }
        console.error("Update application status error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// @desc    Bulk update application status
// @route   PATCH /api/applications/bulk-status
// @access  Private (Recruiter/Admin)
export const bulkUpdateStatus = async (req, res) => {
    try {
        const { applicationIds, status, notes } = req.body;

        if (!applicationIds || !Array.isArray(applicationIds)) {
            throw new ValidationError("applicationIds must be an array");
        }

        const results = await atsService.bulkUpdateStatus(
            applicationIds,
            status,
            req.user.id,
            notes
        );

        res.status(200).json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error("Bulk update items error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// @desc    Get application timeline
// @route   GET /api/applications/:id/timeline
// @access  Private (Recruiter/Admin/Applicant)
export const getApplicationTimeline = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            throw new NotFoundError("Application");
        }

        // Check authorization
        if (
            application.applicant.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            // If recruiter, check if they own the job
            const job = await Job.findById(application.job);
            if (job.postedBy.toString() !== req.user.id) {
                throw new AuthorizationError();
            }
        }

        const timeline = await atsService.getApplicationTimeline(req.params.id);

        res.status(200).json({
            success: true,
            data: timeline,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error instanceof AuthorizationError) {
            return res.status(403).json({ success: false, message: error.message });
        }
        console.error("Get timeline error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Delete/Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Candidate - own application)
export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            throw new NotFoundError("Application");
        }

        if (application.applicant.toString() !== req.user.id) {
            throw new AuthorizationError("Not authorized to withdraw this application");
        }

        await application.deleteOne();

        // Decrement applications count
        await Job.findByIdAndUpdate(application.job, {
            $inc: { applicationsCount: -1 },
        });

        res.status(200).json({
            success: true,
            message: "Application withdrawn successfully",
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error instanceof AuthorizationError) {
            return res.status(403).json({ success: false, message: error.message });
        }
        console.error("Delete application error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

