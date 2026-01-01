import Job from "../models/Job.js";
import { JOB_STATUS } from "../constants/index.js";
import { NotFoundError } from "../utils/errorHandler.js";

export const getJobs = async (queryParams) => {
    const {
        search,
        location,
        jobType,
        workMode,
        category,
        skills,
        salaryMin,
        page = 1,
        limit = 20,
    } = queryParams;

    const query = {
        isApproved: true,
        status: JOB_STATUS.ACTIVE,
    };

    // Text Search
    if (search) {
        query.$text = { $search: search };
    }

    // Filters
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (workMode) query.workMode = workMode;
    if (category) query.category = category;

    if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : skills.split(",");
        query.skills = { $all: skillsArray };
    }

    if (salaryMin) {
        query["salary.max"] = { $gte: parseInt(salaryMin) };
    }

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
        Job.find(query)
            .populate("company", "name logo location")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Job.countDocuments(query),
    ]);

    return {
        jobs,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    };
};

export const getJobById = async (id) => {
    const job = await Job.findById(id)
        .populate("company", "name logo description website industry size")
        .populate("postedBy", "name email");

    if (!job) {
        throw new NotFoundError("Job");
    }

    return job;
};

export const createJob = async (jobData, userId) => {
    const job = await Job.create({
        ...jobData,
        postedBy: userId,
        status: JOB_STATUS.PENDING,
        isApproved: false,
    });
    return job;
};

export const updateJob = async (id, jobData, userId, role) => {
    const job = await Job.findById(id);
    if (!job) throw new NotFoundError("Job");

    // Authorization check
    if (job.postedBy.toString() !== userId && role !== "admin") {
        throw new Error("Not authorized to update this job");
    }

    const updatedJob = await Job.findByIdAndUpdate(id, jobData, {
        new: true,
        runValidators: true,
    });
    return updatedJob;
};

export const deleteJob = async (id, userId, role) => {
    const job = await Job.findById(id);
    if (!job) throw new NotFoundError("Job");

    if (job.postedBy.toString() !== userId && role !== "admin") {
        throw new Error("Not authorized to delete this job");
    }

    await job.deleteOne();
    return true;
};

export const getRecruiterJobs = async (userId) => {
    return await Job.find({ postedBy: userId }).populate("company", "name").sort({ createdAt: -1 });
};
