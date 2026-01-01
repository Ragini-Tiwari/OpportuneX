import axios from "axios";

export const fetchGreenhouseJobs = async (boardToken) => {
    try {
        const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;
        const response = await axios.get(url);

        if (!response.data || !response.data.jobs) return [];

        return response.data.jobs.map(job => ({
            externalId: job.id.toString(),
            title: job.title,
            companyName: "Greenhouse Company", // This would ideally be fetched from the board info
            description: job.content,
            requirements: "See job description for details.",
            location: job.location?.name || "Remote",
            jobType: "Full-time", // Mapping needed if Greenhouse provides it
            workMode: job.location?.name?.toLowerCase().includes("remote") ? "Remote" : "Onsite",
            externalUrl: job.absolute_url,
            source: "greenhouse",
            skills: [], // Parsing description for skills could be a future enhancement
        }));
    } catch (error) {
        console.error(`Greenhouse sync error for ${boardToken}:`, error.message);
        throw error;
    }
};
