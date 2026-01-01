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
    // Check if company is provided as a string (name)
    if (jobData.company && typeof jobData.company === 'string') {
        const companyName = jobData.company;
        const Company = (await import("../models/Company.js")).default; // Dynamic import to avoid circular dependency if any

        let company = await Company.findOne({ name: new RegExp('^' + companyName + '$', 'i') });

        if (!company) {
            // Create new company if it doesn't exist
            // Using placeholder data to satisfy required fields
            company = await Company.create({
                name: companyName,
                description: `Company profile for ${companyName}. This description will be updated by the company owner.`.padEnd(50, ' '),
                industry: "Technology", // Default industry
                location: jobData.location || "Remote",
                createdBy: userId
            });
        }

        jobData.company = company._id;
        jobData.companyName = companyName;
    }

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
