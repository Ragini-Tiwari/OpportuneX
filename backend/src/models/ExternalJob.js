import mongoose from 'mongoose';

const externalJobSchema = new mongoose.Schema(
    {
        externalId: {
            type: String,
            required: true,
        },
        source: {
            type: String,
            enum: ['greenhouse', 'lever'],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        companyLogo: String,
        description: {
            type: String,
            required: true,
        },
        requirements: String,
        location: {
            type: String,
            required: true,
            trim: true,
        },
        jobType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
            default: 'Full-time',
        },
        workMode: {
            type: String,
            enum: ['Remote', 'Onsite', 'Hybrid'],
            default: 'Onsite',
        },
        skills: [String],
        applyUrl: {
            type: String,
            required: true,
        },
        postedDate: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
        lastSyncedAt: {
            type: Date,
            default: Date.now,
        },
        rawData: {
            type: mongoose.Schema.Types.Mixed, // Store original API response
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to prevent duplicate external jobs
externalJobSchema.index({ externalId: 1, source: 1 }, { unique: true });

// Indexes for queries
externalJobSchema.index({ isActive: 1 });
externalJobSchema.index({ lastSyncedAt: 1 });
externalJobSchema.index({ source: 1, isActive: 1 });
externalJobSchema.index({ title: 'text', description: 'text', company: 'text', skills: 'text' });

const ExternalJob = mongoose.model('ExternalJob', externalJobSchema);

export default ExternalJob;
