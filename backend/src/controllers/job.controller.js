import * as jobService from "../services/job.service.js";

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res, next) => {
    try {
        const { jobs, pagination } = await jobService.getJobs(req.query);

        res.status(200).json({
            success: true,
            data: jobs,
            pagination,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
    try {
        const job = await jobService.getJobById(req.params.id);

        res.status(200).json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
export const createJob = async (req, res, next) => {
    try {
        const job = await jobService.createJob(req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: "Job created successfully and pending approval",
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin)
export const updateJob = async (req, res, next) => {
    try {
        const job = await jobService.updateJob(req.params.id, req.body, req.user.id, req.user.role);

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
export const deleteJob = async (req, res, next) => {
    try {
        await jobService.deleteJob(req.params.id, req.user.id, req.user.role);

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/my/jobs
// @access  Private (Recruiter/Admin)
export const getMyJobs = async (req, res, next) => {
    try {
        const jobs = await jobService.getRecruiterJobs(req.user.id);

        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get today's jobs
// @route   GET /api/jobs/today
// @access  Public
export const getTodaysJobs = async (req, res, next) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const jobs = await jobService.getJobs({ postedSince: startOfDay, status: 'active' });

        res.status(200).json({
            success: true,
            data: jobs.jobs,
            count: jobs.jobs.length,
        });
    } catch (error) {
        next(error);
    }
};
