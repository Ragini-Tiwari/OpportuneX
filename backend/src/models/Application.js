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
            enum: ["applied", "shortlisted", "interview", "offer", "rejected"],
            default: "applied",
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ["applied", "shortlisted", "interview", "offer", "rejected"],
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
        interviewDate: Date,
        offerDetails: {
            salary: Number,
            joiningDate: Date,
            otherDetails: String,
        },
        rejectionReason: String,
        notes: {
            type: String, // Recruiter's notes
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to track status changes
applicationSchema.pre('save', function (next) {
    if (this.isModified('status') && !this.isNew) {
        this.statusHistory.push({
            status: this.status,
            changedAt: new Date(),
            // changedBy will be set by the controller
        });
    }
    next();
});

// Compound index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
