import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number, // in bytes
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
        parsedData: {
            skills: [String],
            experience: Number,
            education: [
                {
                    degree: String,
                    institution: String,
                    year: Number,
                },
            ],
            contact: {
                email: String,
                phone: String,
            },
        },
        version: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for user + isPrimary (only one primary resume per user)
resumeSchema.index({ user: 1, isPrimary: 1 });

// Index for user + version
resumeSchema.index({ user: 1, version: 1 });

// Pre-save hook to ensure only one primary resume per user
resumeSchema.pre('save', async function (next) {
    if (this.isPrimary && this.isModified('isPrimary')) {
        // Set all other resumes for this user to non-primary
        await mongoose.model('Resume').updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isPrimary: false }
        );
    }
    next();
});

// Auto-increment version for each user
resumeSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastResume = await mongoose
            .model('Resume')
            .findOne({ user: this.user })
            .sort({ version: -1 });
        this.version = lastResume ? lastResume.version + 1 : 1;
    }
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
