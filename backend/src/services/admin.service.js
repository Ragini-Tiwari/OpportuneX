import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import AdminLog from "../models/AdminLog.js";
import { NotFoundError } from "../utils/errorHandler.js";
import { JOB_STATUS } from "../constants/index.js";

export const getStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
        totalJobs,
        pendingJobs,
        totalUsers,
        totalApplications,
        newUsersToday,
        newApplicationsToday
    ] = await Promise.all([
        Job.countDocuments(),
        Job.countDocuments({ status: JOB_STATUS.PENDING }),
        User.countDocuments(),
        Application.countDocuments(),
        User.countDocuments({ createdAt: { $gte: today } }),
        Application.countDocuments({ createdAt: { $gte: today } })
    ]);

    const recentJobs = await Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("postedBy", "name email")
        .populate("company", "name logo");

    const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-password -refreshToken");

    return {
        stats: {
            totalJobs,
            pendingJobs,
            totalUsers,
            totalApplications,
            newUsersToday,
            newApplicationsToday
        },
        recentJobs,
        recentUsers,
    };
};

export const getUsers = async () => {
    return await User.find()
        .sort({ createdAt: -1 })
        .select("-password -refreshToken");
};

export const toggleBlockUser = async (targetUserId, adminId) => {
    const user = await User.findById(targetUserId);
    if (!user) throw new NotFoundError("User");

    if (user._id.toString() === adminId.toString()) {
        throw new Error("You cannot block yourself");
    }

    user.isBlocked = !user.isBlocked;
    if (user.isBlocked) {
        user.blockedBy = adminId;
        user.blockedAt = new Date();
    } else {
        user.blockedBy = undefined;
        user.blockedAt = undefined;
    }

    await user.save();

    await AdminLog.create({
        admin: adminId,
        action: user.isBlocked ? 'user_blocked' : 'user_unblocked',
        targetType: 'User',
        targetId: user._id,
        details: { email: user.email, name: user.name },
    });

    return user;
};

export const removeUser = async (targetUserId, adminId) => {
    const user = await User.findById(targetUserId);
    if (!user) throw new NotFoundError("User");

    if (user._id.toString() === adminId.toString()) {
        throw new Error("You cannot delete yourself");
    }

    await user.deleteOne();

    await AdminLog.create({
        admin: adminId,
        action: 'user_deleted', // Assuming we add this to enum if missing
        targetType: 'User',
        targetId: targetUserId,
        details: { name: user.name, email: user.email },
    });

    return true;
};

export const getJobs = async () => {
    return await Job.find()
        .sort({ createdAt: -1 })
        .populate("postedBy", "name email")
        .populate("company", "name logo");
};

export const approveJobStatus = async (jobId, status, adminId) => {
    const job = await Job.findById(jobId);
    if (!job) throw new NotFoundError("Job");

    if (status === JOB_STATUS.ACTIVE) {
        job.isApproved = true;
        job.approvedBy = adminId;
        job.approvedAt = new Date();
        job.status = JOB_STATUS.ACTIVE;
    } else if (status === 'rejected' || status === JOB_STATUS.CLOSED) {
        job.isApproved = false;
        job.status = JOB_STATUS.CLOSED;
    } else {
        throw new Error("Invalid status update");
    }

    await job.save();

    await AdminLog.create({
        admin: adminId,
        action: status === JOB_STATUS.ACTIVE ? 'job_approved' : 'job_rejected',
        targetType: 'Job',
        targetId: job._id,
        details: { title: job.title },
    });

    return job;
};

export const getLogs = async () => {
    return await AdminLog.find()
        .sort({ createdAt: -1 })
        .populate("admin", "name email")
        .limit(100);
};
