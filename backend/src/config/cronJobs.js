import cron from 'node-cron';
import { syncExternalJobs, deactivateOldJobs } from '../services/jobAggregator.service.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Alert from '../models/Alert.js';
import { sendJobAlert } from '../services/notification.service.js';

/**
 * Initialize all cron jobs
 */
export const initCronJobs = () => {
    console.log('⏰ Initializing cron jobs...');

    // 1. Daily External Job Sync - runs at 2:00 AM every day
    cron.schedule('0 2 * * *', async () => {
        console.log('⏰ Running daily external job sync...');
        try {
            await syncExternalJobs();
            console.log('✅ Daily external job sync completed');
        } catch (error) {
            console.error('❌ Cron Job Error: syncExternalJobs', error.message);
        }
    });

    // 2. Daily Job Alerts - runs at 9:00 AM every day
    cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Running daily job alerts...');
        try {
            await processJobAlerts('daily');
            console.log('✅ Daily job alerts completed');
        } catch (error) {
            console.error('❌ Cron Job Error: processJobAlerts', error.message);
        }
    });

    // 3. Weekly Old Job Deactivation - runs every Sunday at midnight
    cron.schedule('0 0 * * 0', async () => {
        console.log('⏰ Running weekly job deactivation...');
        try {
            const count = await deactivateOldJobs(30);
            console.log(`✅ Deactivated ${count} old external jobs`);
        } catch (error) {
            console.error('❌ Cron Job Error: deactivateOldJobs', error.message);
        }
    });
};

/**
 * Process job alerts for a specific frequency
 */
export const processJobAlerts = async (frequency) => {
    try {
        const activeAlerts = await Alert.find({ isActive: true, frequency })
            .populate('user', 'name email');

        if (activeAlerts.length === 0) return;

        console.log(`Processing ${activeAlerts.length} ${frequency} alerts...`);

        for (const alert of activeAlerts) {
            try {
                // Build search criteria for jobs
                const criteria = {
                    status: 'active',
                    isApproved: true,
                    createdAt: { $gte: alert.lastSentAt || new Date(Date.now() - 24 * 60 * 60 * 1000) }
                };

                if (alert.criteria.skills?.length > 0) {
                    criteria.skills = { $in: alert.criteria.skills };
                }

                if (alert.criteria.locations?.length > 0) {
                    criteria.location = { $in: alert.criteria.locations.map(loc => new RegExp(loc, 'i')) };
                }

                // Find matching jobs
                const matchingJobs = await Job.find(criteria)
                    .limit(10)
                    .populate('company', 'name');

                if (matchingJobs.length > 0) {
                    await sendJobAlert(alert.user, matchingJobs);

                    // Update alert tracking
                    alert.lastSentAt = new Date();
                    alert.emailsSent += 1;
                    await alert.save();
                }
            } catch (alertError) {
                console.error(`Error processing alert for user ${alert.user._id}:`, alertError.message);
            }
        }
    } catch (error) {
        throw error;
    }
};
