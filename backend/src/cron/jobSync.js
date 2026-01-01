import cron from "node-cron";
import * as aggregatorService from "../services/aggregator.service.js";

// Run every day at midnight
export const initCronJobs = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("Starting daily job synchronization...");
        try {
            const results = await aggregatorService.syncJobs();
            console.log("Job sync completed successfully:", results);
        } catch (error) {
            console.error("Cron Job Sync Error:", error.message);
        }
    });

    console.log("Cron jobs initialized.");
};
