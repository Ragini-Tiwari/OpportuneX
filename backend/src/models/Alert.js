import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'instant'],
            default: 'daily',
        },
        criteria: {
            skills: [String],
            locations: [String],
            jobTypes: [
                {
                    type: String,
                    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
                },
            ],
            salaryMin: {
                type: Number,
                min: 0,
            },
            experienceRange: {
                min: {
                    type: Number,
                    min: 0,
                    default: 0,
                },
                max: {
                    type: Number,
                    min: 0,
                },
            },
        },
        lastSentAt: Date,
        emailsSent: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for user lookup
alertSchema.index({ user: 1 });

// Index for active alerts
alertSchema.index({ isActive: 1, frequency: 1 });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
