import mongoose from "mongoose";

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
            required: [true, "Company is required"],
        },
        companyName: {
            type: String,
            trim: true,
            // Fallback for display if Company ref is not populated
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
            enum: ["active", "closed", "draft", "pending_approval"],
            default: "pending_approval",
        },
        applicationDeadline: {
            type: Date,
        },
        applicationsCount: {
            type: Number,
            default: 0,
        },
        isExternal: {
            type: Boolean,
            default: false,
        },
        externalUrl: {
            type: String,
            // URL for external job applications
        },
        source: {
            type: String,
            enum: ["internal", "greenhouse", "lever"],
            default: "internal",
        },
        benefits: [String],
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        approvedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Index for search optimization
jobSchema.index({ title: "text", description: "text", companyName: "text", skills: "text" });

// Additional indexes for filtering
jobSchema.index({ isExternal: 1, source: 1 });
jobSchema.index({ isApproved: 1, status: 1 });
jobSchema.index({ company: 1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;

