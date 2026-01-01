import * as applicationService from "../services/application.service.js";

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
export const applyToJob = async (req, res, next) => {
    try {
        const { jobId, resume, coverLetter } = req.body;

        const application = await applicationService.applyToJob(jobId, req.user.id, {
            resume,
            coverLetter,
        });

        res.status(201).json({
            success: true,
            message: "Applied successfully",
            data: application,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
export const getMyApplications = async (req, res, next) => {
    try {
        const applications = await applicationService.getApplicantApplications(req.user.id);

        res.status(200).json({
            success: true,
            data: applications,
            count: applications.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get job applications (for recruiters)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter/Admin)
export const getJobApplications = async (req, res, next) => {
    try {
        const applications = await applicationService.getJobApplications(req.params.jobId, req.user.id);

        res.status(200).json({
            success: true,
            data: applications,
            count: applications.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
export const updateStatus = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        const application = await applicationService.updateApplicationStatus(
            req.params.id,
            status,
            notes,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            data: application,
        });
    } catch (error) {
        next(error);
    }
};
