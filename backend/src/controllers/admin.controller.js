import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
    try {
        const [totalJobs, totalUsers, totalApplications] = await Promise.all([
            Job.countDocuments(),
            User.countDocuments(),
            Application.countDocuments(),
        ]);

        const recentJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("postedBy", "name email");

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalJobs,
                    totalUsers,
                    totalApplications,
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

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Don't allow deleting self
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete yourself",
            });
        }

        await user.deleteOne();
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
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
            .populate("postedBy", "name email company");
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
