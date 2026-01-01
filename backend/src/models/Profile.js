import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        headline: {
            type: String,
            maxlength: [200, 'Headline cannot exceed 200 characters'],
            trim: true,
        },
        summary: {
            type: String,
            maxlength: [2000, 'Summary cannot exceed 2000 characters'],
        },
        education: [
            {
                degree: {
                    type: String,
                    required: true,
                },
                institution: {
                    type: String,
                    required: true,
                },
                field: String,
                startYear: Number,
                endYear: Number,
                current: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        workExperience: [
            {
                company: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                startDate: {
                    type: Date,
                    required: true,
                },
                endDate: Date,
                current: {
                    type: Boolean,
                    default: false,
                },
                description: {
                    type: String,
                    maxlength: 1000,
                },
            },
        ],
        certifications: [
            {
                name: {
                    type: String,
                    required: true,
                },
                issuer: {
                    type: String,
                    required: true,
                },
                date: Date,
                url: String,
            },
        ],
        projects: [
            {
                title: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                    maxlength: 1000,
                },
                technologies: [String],
                url: String,
                startDate: Date,
                endDate: Date,
            },
        ],
        socialLinks: {
            linkedin: String,
            github: String,
            portfolio: String,
            twitter: String,
        },
        availability: {
            type: String,
            enum: ['immediate', '2_weeks', '1_month', '2_months', 'not_looking'],
            default: 'immediate',
        },
        preferredRoles: [String],
    },
    {
        timestamps: true,
    }
);

// Index for user lookup
profileSchema.index({ user: 1 });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
