import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import AdminLog from "../models/AdminLog.js";
import { NotFoundError } from "../utils/errorHandler.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalJobs,
            pendingJobs,
            totalUsers,
            totalApplications,
            newUsersToday
        ] = await Promise.all([
            Job.countDocuments(),
            Job.countDocuments({ status: 'pending_approval' }),
            User.countDocuments(),
            Application.countDocuments(),
            User.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } })
        ]);

        const recentJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("postedBy", "name email")
            .populate("company", "name logo");

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalJobs,
                    pendingJobs,
                    totalUsers,
                    totalApplications,
                    newUsersToday
                },
                recentJobs,
                recentUsers,
            },
        });
    } catch (error) {
        console.error("Get admin stats error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: users,
            count: users.length,
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Toggle user block status
// @route   PATCH /api/admin/users/:id/block
// @access  Private (Admin)
export const toggleUserBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new NotFoundError("User");
        }

        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot block yourself",
            });
        }

        user.isBlocked = !user.isBlocked;
        if (user.isBlocked) {
            user.blockedBy = req.user.id;
            user.blockedAt = new Date();
        } else {
            user.blockedBy = undefined;
            user.blockedAt = undefined;
        }

        await user.save();

        // Log action
        await AdminLog.create({
            admin: req.user.id,
            action: user.isBlocked ? 'user_blocked' : 'user_unblocked',
            targetType: 'User',
            targetId: user._id,
            details: { email: user.email },
        });

        res.status(200).json({
            success: true,
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            data: user,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new NotFoundError("User");
        }

        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete yourself",
            });
        }

        await user.deleteOne();

        // Log action
        await AdminLog.create({
            admin: req.user.id,
            action: 'job_deleted', // Using an existing enum value or update enum if 'user_deleted' is missing
            targetType: 'User',
            targetId: req.params.id,
            details: { name: user.name, email: user.email },
        });

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get all jobs (Admin view)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobsAdmin = async (req, res) => {
    try {
        const jobs = await Job.find()
            .sort({ createdAt: -1 })
            .populate("postedBy", "name email")
            .populate("company", "name logo");

        res.status(200).json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error) {
        console.error("Get admin jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Approve/Reject job
// @route   PATCH /api/admin/jobs/:id/approve
// @access  Private (Admin)
export const approveJob = async (req, res) => {
    try {
        const { status } = req.body; // 'active' or 'rejected'

        const job = await Job.findById(req.params.id);
        if (!job) {
            throw new NotFoundError("Job");
        }

        if (status === 'active') {
            job.isApproved = true;
            job.approvedBy = req.user.id;
            job.approvedAt = new Date();
            job.status = 'active';
        } else if (status === 'rejected') {
            job.isApproved = false;
            job.status = 'closed'; // Or another status for rejected
        } else {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        await job.save();

        // Log action
        await AdminLog.create({
            admin: req.user.id,
            action: status === 'active' ? 'job_approved' : 'job_rejected',
            targetType: 'Job',
            targetId: job._id,
            details: { title: job.title },
        });

        res.status(200).json({
            success: true,
            message: `Job ${status === 'active' ? 'approved' : 'rejected'} successfully`,
            data: job,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get admin logs
// @route   GET /api/admin/logs
// @access  Private (Admin)
export const getAdminLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find()
            .sort({ createdAt: -1 })
            .populate("admin", "name email")
            .limit(100);

        res.status(200).json({
            success: true,
            data: logs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
