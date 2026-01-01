// External Job Aggregator Service
// Fetches jobs from Greenhouse and Lever APIs
import axios from 'axios';
import ExternalJob from '../models/ExternalJob.js';
import JobSource from '../models/JobSource.js';

// Fetch jobs from Greenhouse API
export const fetchGreenhouseJobs = async (boardToken) => {
    try {
        const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`;
        const response = await axios.get(url);

        return response.data.jobs || [];
    } catch (error) {
        console.error('Error fetching Greenhouse jobs:', error.message);
        throw new Error(`Greenhouse API error: ${error.message}`);
    }
};

// Fetch jobs from Lever API
export const fetchLeverJobs = async (site) => {
    try {
        const url = `https://api.lever.co/v0/postings/${site}`;
        const response = await axios.get(url);

        return response.data || [];
    } catch (error) {
        console.error('Error fetching Lever jobs:', error.message);
        throw new Error(`Lever API error: ${error.message}`);
    }
};

// Normalize Greenhouse job data to ExternalJob schema
const normalizeGreenhouseJob = (job) => {
    return {
        externalId: job.id.toString(),
        source: 'greenhouse',
        title: job.title,
        company: job.departments?.[0]?.name || 'Unknown Company',
        companyLogo: null,
        description: job.content || job.description || '',
        requirements: job.requirements || '',
        location: job.location?.name || 'Remote',
        jobType: 'Full-time', // Greenhouse doesn't always specify
        workMode: job.location?.name?.toLowerCase().includes('remote') ? 'Remote' : 'Onsite',
        skills: [], // Extract from description if needed
        applyUrl: job.absolute_url,
        postedDate: job.updated_at ? new Date(job.updated_at) : new Date(),
        isActive: true,
        lastSyncedAt: new Date(),
        rawData: job,
    };
};

// Normalize Lever job data to ExternalJob schema
const normalizeLeverJob = (job) => {
    return {
        externalId: job.id,
        source: 'lever',
        title: job.text,
        company: job.categories?.team || 'Unknown Company',
        companyLogo: null,
        description: job.description || job.descriptionPlain || '',
        requirements: job.lists?.[0]?.content || '',
        location: job.categories?.location || 'Remote',
        jobType: job.categories?.commitment || 'Full-time',
        workMode: job.categories?.location?.toLowerCase().includes('remote') ? 'Remote' : 'Onsite',
        skills: job.categories?.allLocations || [],
        applyUrl: job.applyUrl || job.hostedUrl,
        postedDate: job.createdAt ? new Date(job.createdAt) : new Date(),
        isActive: true,
        lastSyncedAt: new Date(),
        rawData: job,
    };
};

// Normalize job data based on source
export const normalizeJobData = (source, rawData) => {
    if (source === 'greenhouse') {
        return normalizeGreenhouseJob(rawData);
    } else if (source === 'lever') {
        return normalizeLeverJob(rawData);
    }
    throw new Error(`Unknown source: ${source}`);
};

// Main sync function
export const syncExternalJobs = async () => {
    try {
        console.log('🔄 Starting external job sync...');

        // Get enabled job sources
        const sources = await JobSource.find({ isEnabled: true });

        if (sources.length === 0) {
            console.log('⚠️  No enabled job sources found');
            return { success: true, message: 'No enabled sources', jobsFetched: 0 };
        }

        let totalJobsFetched = 0;
        const results = [];

        for (const source of sources) {
            try {
                console.log(`📥 Fetching jobs from ${source.displayName}...`);

                let rawJobs = [];

                if (source.name === 'greenhouse') {
                    if (!source.apiConfig?.boardToken) {
                        throw new Error('Greenhouse board token not configured');
                    }
                    rawJobs = await fetchGreenhouseJobs(source.apiConfig.boardToken);
                } else if (source.name === 'lever') {
                    if (!source.apiConfig?.site) {
                        throw new Error('Lever site not configured');
                    }
                    rawJobs = await fetchLeverJobs(source.apiConfig.site);
                }

                console.log(`✅ Fetched ${rawJobs.length} jobs from ${source.displayName}`);

                // Normalize and save jobs
                let savedCount = 0;
                let updatedCount = 0;

                for (const rawJob of rawJobs) {
                    try {
                        const normalizedJob = normalizeJobData(source.name, rawJob);

                        // Upsert job (update if exists, create if not)
                        const result = await ExternalJob.findOneAndUpdate(
                            { externalId: normalizedJob.externalId, source: normalizedJob.source },
                            normalizedJob,
                            { upsert: true, new: true, setDefaultsOnInsert: true }
                        );

                        if (result) {
                            if (result.createdAt.getTime() === result.updatedAt.getTime()) {
                                savedCount++;
                            } else {
                                updatedCount++;
                            }
                        }
                    } catch (jobError) {
                        console.error(`Error saving job ${rawJob.id}:`, jobError.message);
                    }
                }

                console.log(`💾 Saved ${savedCount} new jobs, updated ${updatedCount} jobs from ${source.displayName}`);

                // Update source status
                source.lastRunAt = new Date();
                source.lastRunStatus = 'success';
                source.lastJobCount = rawJobs.length;
                source.jobsFetched += savedCount;
                source.lastRunError = null;
                await source.save();

                totalJobsFetched += rawJobs.length;
                results.push({
                    source: source.name,
                    success: true,
                    jobsFetched: rawJobs.length,
                    saved: savedCount,
                    updated: updatedCount,
                });

            } catch (sourceError) {
                console.error(`❌ Error syncing ${source.displayName}:`, sourceError.message);

                // Update source with error
                source.lastRunAt = new Date();
                source.lastRunStatus = 'failed';
                source.lastRunError = sourceError.message;
                await source.save();

                results.push({
                    source: source.name,
                    success: false,
                    error: sourceError.message,
                });
            }
        }

        console.log(`✅ External job sync complete. Total jobs fetched: ${totalJobsFetched}`);

        return {
            success: true,
            totalJobsFetched,
            results,
        };

    } catch (error) {
        console.error('❌ Error in syncExternalJobs:', error);
        throw error;
    }
};

// Deactivate old external jobs (older than 30 days)
export const deactivateOldJobs = async (daysOld = 30) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await ExternalJob.updateMany(
            { lastSyncedAt: { $lt: cutoffDate }, isActive: true },
            { isActive: false }
        );

        console.log(`🗑️  Deactivated ${result.modifiedCount} old external jobs`);
        return result.modifiedCount;
    } catch (error) {
        console.error('Error deactivating old jobs:', error);
        throw error;
    }
};
