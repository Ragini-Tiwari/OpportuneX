import Job from "../models/Job.js";
import JobSource from "../models/JobSource.js";
import * as greenhouse from "./sources/greenhouse.js";
import * as lever from "./sources/lever.js";
import { JOB_STATUS } from "../constants/index.js";

export const syncJobs = async () => {
    const sources = await JobSource.find({ isEnabled: true });
    const results = [];

    for (const source of sources) {
        try {
            let jobs = [];
            if (source.name === "greenhouse") {
                jobs = await greenhouse.fetchGreenhouseJobs(source.apiConfig.boardToken);
            } else if (source.name === "lever") {
                jobs = await lever.fetchLeverJobs(source.apiConfig.site);
            }

            let newJobsCount = 0;
            for (const jobData of jobs) {
                // Check if job exists by externalId and source
                // We use title + externalId + source for robustness
                const existingJob = await Job.findOne({
                    source: jobData.source,
                    externalId: jobData.externalId
                });

                if (!existingJob) {
                    await Job.create({
                        ...jobData,
                        isExternal: true,
                        isApproved: true, // Auto-approve external jobs
                        status: JOB_STATUS.ACTIVE,
                    });
                    newJobsCount++;
                }
            }

            source.lastRunAt = new Date();
            source.lastRunStatus = "success";
            source.lastJobCount = jobs.length;
            source.jobsFetched += newJobsCount;
            await source.save();

            results.push({ source: source.name, total: jobs.length, added: newJobsCount });
        } catch (error) {
            source.lastRunAt = new Date();
            source.lastRunStatus = "failed";
            source.lastRunError = error.message;
            await source.save();
            results.push({ source: source.name, error: error.message });
        }
    }

    return results;
};
