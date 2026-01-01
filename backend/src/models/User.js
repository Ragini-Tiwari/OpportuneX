import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../constants/index.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.CANDIDATE,
        },
        phone: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: [500, "Bio cannot exceed 500 characters"],
        },
        resume: {
            type: String, // URL to resume file
        },
        skills: [String],
        experience: {
            type: Number, // Years of experience
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        savedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
        education: [
            {
                degree: String,
                institution: String,
                year: Number,
                field: String,
            },
        ],
        jobPreferences: {
            roles: [String],
            locations: [String],
            salaryRange: {
                min: Number,
                max: Number,
                currency: {
                    type: String,
                    default: "USD",
                },
            },
            jobTypes: [String],
            workModes: [String],
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        blockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        blockedAt: Date,
        refreshToken: {
            type: String,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
