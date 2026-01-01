import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { APPLICATION_STATUS } from "../constants/index.js";
import { NotFoundError, ConflictError } from "../utils/errorHandler.js";

export const applyToJob = async (jobId, applicantId, applicationData) => {
    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isApproved || job.status !== "active") {
        throw new NotFoundError("Active Job");
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
        job: jobId,
        applicant: applicantId,
    });

    if (existingApplication) {
        throw new ConflictError("You have already applied for this job");
    }

    // Create application
    const application = await Application.create({
        job: jobId,
        applicant: applicantId,
        ...applicationData,
        status: APPLICATION_STATUS.APPLIED,
        statusHistory: [{
            status: APPLICATION_STATUS.APPLIED,
            changedBy: applicantId,
            notes: "Initial application submitted",
        }],
    });

    // Update job application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    return application;
};

export const getApplicantApplications = async (applicantId) => {
    return await Application.find({ applicant: applicantId })
        .populate({
            path: "job",
            populate: { path: "company", select: "name logo" },
        })
        .sort({ createdAt: -1 });
};

export const getJobApplications = async (jobId, recruiterId) => {
    const job = await Job.findById(jobId);
    if (!job) throw new NotFoundError("Job");

    // Check ownership
    if (job.postedBy.toString() !== recruiterId) {
        throw new Error("Not authorized to view applicants for this job");
    }

    return await Application.find({ job: jobId })
        .populate("applicant", "name email phone skills experience")
        .sort({ createdAt: -1 });
};

export const updateApplicationStatus = async (applicationId, status, notes, userId) => {
    const application = await Application.findById(applicationId).populate("job");
    if (!application) throw new NotFoundError("Application");

    // Only recruiter who posted the job or admin can change status
    if (application.job.postedBy.toString() !== userId) {
        // We could also check for admin role here if needed
        throw new Error("Not authorized to update this application");
    }

    application.status = status;
    application.statusHistory.push({
        status,
        changedBy: userId,
        notes,
    });

    await application.save();
    return application;
};
