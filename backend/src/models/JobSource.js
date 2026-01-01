import mongoose from 'mongoose';

const jobSourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            enum: ['greenhouse', 'lever'],
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        isEnabled: {
            type: Boolean,
            default: false,
        },
        apiConfig: {
            // Store encrypted credentials and endpoints
            apiKey: String,
            apiUrl: String,
            boardToken: String, // For Greenhouse
            site: String, // For Lever
        },
        lastRunAt: Date,
        lastRunStatus: {
            type: String,
            enum: ['success', 'failed', 'partial'],
        },
        lastRunError: String,
        jobsFetched: {
            type: Number,
            default: 0,
        },
        lastJobCount: {
            type: Number,
            default: 0,
        },
        enabledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        enabledAt: Date,
    },
    {
        timestamps: true,
    }
);

// Index for enabled sources
jobSourceSchema.index({ isEnabled: 1 });

const JobSource = mongoose.model('JobSource', jobSourceSchema);

export default JobSource;
