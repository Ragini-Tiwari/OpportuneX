import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
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
            enum: ["Full-time", "Part-time", "Contract", "Internship"],
            default: "Full-time",
        },
        workMode: {
            type: String,
            enum: ["Remote", "Onsite", "Hybrid"],
            default: "Onsite",
        },
        salary: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 0,
            },
            currency: {
                type: String,
                default: "USD",
            },
        },
        skills: [String],
        experience: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 0,
            },
        },
        category: {
            type: String,
            enum: [
                "Engineering",
                "Design",
                "Marketing",
                "Sales",
                "Product",
                "Operations",
                "HR",
                "Finance",
                "Other",
            ],
            default: "Other",
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "closed", "draft"],
            default: "active",
        },
        applicationDeadline: {
            type: Date,
        },
        applicationsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search optimization
jobSchema.index({ title: "text", description: "text", company: "text", skills: "text" });

const Job = mongoose.model("Job", jobSchema);

export default Job;
