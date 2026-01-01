import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            enum: [
                'user_blocked',
                'user_unblocked',
                'user_deleted',
                'job_approved',
                'job_rejected',
                'source_enabled',
                'source_disabled',
                'user_role_changed',
                'job_deleted',
                'company_verified',
            ],
            required: true,
        },
        targetType: {
            type: String,
            enum: ['User', 'Job', 'ExternalJob', 'JobSource', 'Company'],
            required: true,
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        details: {
            type: mongoose.Schema.Types.Mixed, // Flexible metadata
        },
        ipAddress: String,
    },
    {
        timestamps: true,
    }
);

// Indexes for querying logs
adminLogSchema.index({ admin: 1 });
adminLogSchema.index({ action: 1 });
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ targetType: 1, targetId: 1 });

const AdminLog = mongoose.model('AdminLog', adminLogSchema);

export default AdminLog;
