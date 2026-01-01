import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../constants/index.js";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resume: {
            type: String,
            required: [true, "Resume is required"],
        },
        coverLetter: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(APPLICATION_STATUS),
            default: APPLICATION_STATUS.APPLIED,
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: Object.values(APPLICATION_STATUS),
                },
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
                notes: String,
            },
        ],
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        notes: String, // Internal recruiter notes
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Status tracking index
applicationSchema.index({ status: 1 });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
