import mongoose from "mongoose";

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
            enum: ["pending", "reviewing", "shortlisted", "rejected", "accepted"],
            default: "pending",
        },
        notes: {
            type: String, // Recruiter's notes
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
