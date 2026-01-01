import User from "../models/User.js";
import { NotFoundError } from "../utils/errorHandler.js";

// @desc    Toggle save job
// @route   POST /api/jobs/:id/save
// @access  Private (Candidate)
export const toggleSavedJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobId = req.params.id;

        const isSaved = user.savedJobs.includes(jobId);

        if (isSaved) {
            user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Job removed from saved jobs",
                isSaved: false,
            });
        } else {
            user.savedJobs.push(jobId);
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Job added to saved jobs",
                isSaved: true,
            });
        }
    } catch (error) {
        console.error("Toggle saved job error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Get user's saved jobs
// @route   GET /api/jobs/saved/all
// @access  Private (Candidate)
export const getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "savedJobs",
            populate: [
                {
                    path: "company",
                    select: "name logo location"
                },
                {
                    path: "postedBy",
                    select: "name email",
                }
            ],
        });

        res.status(200).json({
            success: true,
            data: user.savedJobs,
            count: user.savedJobs.length,
        });
    } catch (error) {
        console.error("Get saved jobs error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

