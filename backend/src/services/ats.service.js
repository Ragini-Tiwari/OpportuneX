// Application Tracking System (ATS) service
import Application from '../models/Application.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { sendApplicationStatusUpdate, sendInterviewScheduled, sendOfferLetter } from './notification.service.js';

export const updateStatus = async (applicationId, newStatus, userId, notes = '', additionalData = {}) => {
    try {
        const application = await Application.findById(applicationId)
            .populate('applicant', 'name email')
            .populate('job', 'title company');

        if (!application) {
            throw new Error('Application not found');
        }

        // Update status
        const oldStatus = application.status;
        application.status = newStatus;
        application.notes = notes || application.notes;

        // Add to status history
        application.statusHistory.push({
            status: newStatus,
            changedBy: userId,
            changedAt: new Date(),
            notes,
        });

        // Handle status-specific updates
        if (newStatus === 'interview' && additionalData.interviewDate) {
            application.interviewDate = additionalData.interviewDate;
            await sendInterviewScheduled(application, additionalData.interviewDate);
        }

        if (newStatus === 'offer' && additionalData.offerDetails) {
            application.offerDetails = additionalData.offerDetails;
            await sendOfferLetter(application, additionalData.offerDetails);
        }

        if (newStatus === 'rejected' && additionalData.rejectionReason) {
            application.rejectionReason = additionalData.rejectionReason;
        }

        await application.save();

        // Send notification
        await sendApplicationStatusUpdate(application, application.applicant);

        return application;
    } catch (error) {
        throw error;
    }
};

export const getApplicationStats = async (jobId) => {
    try {
        const stats = await Application.aggregate([
            { $match: { job: jobId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        const statsObject = {
            total: 0,
            applied: 0,
            shortlisted: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
        };

        stats.forEach((stat) => {
            statsObject[stat._id] = stat.count;
            statsObject.total += stat.count;
        });

        return statsObject;
    } catch (error) {
        throw error;
    }
};

export const getApplicantProfile = async (applicationId) => {
    try {
        const application = await Application.findById(applicationId)
            .populate({
                path: 'applicant',
                select: '-password -refreshToken',
                populate: {
                    path: 'savedJobs',
                    select: 'title company',
                },
            })
            .populate('job', 'title company description requirements');

        if (!application) {
            throw new Error('Application not found');
        }

        // Get applicant's profile if exists
        const Profile = (await import('../models/Profile.js')).default;
        const profile = await Profile.findOne({ user: application.applicant._id });

        // Get applicant's other applications
        const otherApplications = await Application.find({
            applicant: application.applicant._id,
            _id: { $ne: applicationId },
        })
            .populate('job', 'title company')
            .select('job status appliedAt')
            .limit(5);

        return {
            application,
            profile,
            otherApplications,
        };
    } catch (error) {
        throw error;
    }
};

export const scheduleInterview = async (applicationId, interviewDate, notes = '') => {
    try {
        return await updateStatus(applicationId, 'interview', null, notes, { interviewDate });
    } catch (error) {
        throw error;
    }
};

export const sendOffer = async (applicationId, offerDetails, userId) => {
    try {
        return await updateStatus(applicationId, 'offer', userId, 'Offer sent', { offerDetails });
    } catch (error) {
        throw error;
    }
};

export const rejectApplication = async (applicationId, reason, userId) => {
    try {
        return await updateStatus(applicationId, 'rejected', userId, reason, { rejectionReason: reason });
    } catch (error) {
        throw error;
    }
};

export const bulkUpdateStatus = async (applicationIds, newStatus, userId, notes = '') => {
    try {
        const results = [];

        for (const appId of applicationIds) {
            try {
                const updated = await updateStatus(appId, newStatus, userId, notes);
                results.push({ id: appId, success: true, application: updated });
            } catch (error) {
                results.push({ id: appId, success: false, error: error.message });
            }
        }

        return results;
    } catch (error) {
        throw error;
    }
};

export const getApplicationTimeline = async (applicationId) => {
    try {
        const application = await Application.findById(applicationId)
            .populate('statusHistory.changedBy', 'name email')
            .select('statusHistory appliedAt');

        if (!application) {
            throw new Error('Application not found');
        }

        // Add initial "applied" event
        const timeline = [
            {
                status: 'applied',
                changedAt: application.appliedAt,
                notes: 'Application submitted',
            },
            ...application.statusHistory,
        ];

        return timeline;
    } catch (error) {
        throw error;
    }
};
