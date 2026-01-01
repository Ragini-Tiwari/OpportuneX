import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Company name is required'],
            unique: true,
            trim: true,
            maxlength: [200, 'Company name cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Company description is required'],
            minlength: [50, 'Description must be at least 50 characters'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        industry: {
            type: String,
            required: [true, 'Industry is required'],
            trim: true,
        },
        size: {
            type: String,
            enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
        },
        website: {
            type: String,
            trim: true,
        },
        logo: {
            type: String, // URL to logo
        },
        location: {
            type: String,
            required: [true, 'Headquarters location is required'],
            trim: true,
        },
        locations: [String], // All office locations
        foundedYear: {
            type: Number,
            min: 1800,
            max: new Date().getFullYear(),
        },
        socialLinks: {
            linkedin: String,
            twitter: String,
            facebook: String,
        },
        recruiters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        verifiedAt: Date,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
companySchema.index({ name: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ isVerified: 1 });

const Company = mongoose.model('Company', companySchema);

export default Company;
