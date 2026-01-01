import * as adminService from "../services/admin.service.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await adminService.getStats();
        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await adminService.getUsers();
        res.status(200).json({
            success: true,
            data: users,
            count: users.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle user block status
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin)
export const toggleUserBlock = async (req, res, next) => {
    try {
        const user = await adminService.toggleBlockUser(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
    try {
        await adminService.removeUser(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all jobs (Admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobsAdmin = async (req, res, next) => {
    try {
        const jobs = await adminService.getJobs();
        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve/Reject job
// @route   PATCH /api/admin/jobs/:id/approve
// @access  Private (Admin)
export const approveJob = async (req, res, next) => {
    try {
        const { status } = req.body;
        const job = await adminService.approveJobStatus(req.params.id, status, req.user.id);
        res.status(200).json({
            success: true,
            message: `Job updated to ${status} successfully`,
            data: job,
        });
    } catch (error) {
        next(error);
    }
};

export const triggerSync = async (req, res, next) => {
    try {
        const results = await adminService.triggerManualSync();
        res.status(200).json({
            success: true,
            message: "Manual sync triggered successfully",
            data: results,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin logs
// @route   GET /api/admin/logs
// @access  Private (Admin)
export const getAdminLogs = async (req, res, next) => {
    try {
        const logs = await adminService.getLogs();
        res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        next(error);
    }
};
