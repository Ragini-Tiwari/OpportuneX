import mongoose from "mongoose";
import { JOB_STATUS, WORK_MODES, JOB_TYPES } from "../constants/index.js";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: function () { return !this.isExternal; },
        },
        companyName: {
            type: String,
            trim: true,
            required: [true, "Company name is required"],
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
        },
        requirements: {
            type: String,
            required: [true, "Job requirements are required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        jobType: {
            type: String,
            enum: Object.values(JOB_TYPES),
            default: JOB_TYPES.FULL_TIME,
        },
        workMode: {
            type: String,
            enum: Object.values(WORK_MODES),
            default: WORK_MODES.ONSITE,
        },
        salary: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
            currency: { type: String, default: "USD" },
        },
        skills: [String],
        experience: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
        },
        category: {
            type: String,
            default: "Other",
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: function () { return !this.isExternal; },
        },
        status: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.PENDING,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isExternal: {
            type: Boolean,
            default: false,
        },
        externalUrl: {
            type: String,
            validate: {
                validator: function (v) {
                    return !this.isExternal || (v && v.length > 0);
                },
                message: "External URL is required for external jobs",
            },
        },
        source: {
            type: String,
            enum: ["internal", "greenhouse", "lever"],
            default: "internal",
        },
        applicationDeadline: Date,
        applicationsCount: { type: Number, default: 0 },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        approvedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Search Indexes
jobSchema.index({ title: "text", description: "text", companyName: "text", skills: "text" });

// Filter Indexes
jobSchema.index({ isApproved: 1, status: 1 });
jobSchema.index({ isExternal: 1, source: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
