import mongoose from 'mongoose';

const prepResourceSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['dsa_roadmap', 'interview_question', 'company_experience'],
            required: true,
        },
        title: {
            type: String,
            required: true,
            minlength: [5, 'Title must be at least 5 characters'],
            maxlength: [300, 'Title cannot exceed 300 characters'],
            trim: true,
        },
        content: {
            type: String,
            required: true,
            minlength: [50, 'Content must be at least 50 characters'],
        },
        category: {
            type: String,
            required: true,
            trim: true,
            // Examples: Arrays, Strings, DP, Trees, Graphs, System Design, Behavioral, etc.
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
        },
        company: {
            type: String,
            trim: true,
            // For company-specific interview experiences
        },
        tags: [String],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient querying
prepResourceSchema.index({ type: 1, isPublished: 1 });
prepResourceSchema.index({ category: 1 });
prepResourceSchema.index({ company: 1 });
prepResourceSchema.index({ difficulty: 1 });
prepResourceSchema.index({ tags: 1 });

const PrepResource = mongoose.model('PrepResource', prepResourceSchema);

export default PrepResource;
