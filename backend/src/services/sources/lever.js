import axios from "axios";

export const fetchLeverJobs = async (site) => {
    try {
        const url = `https://api.lever.co/v0/postings/${site}?mode=json`;
        const response = await axios.get(url);

        if (!Array.isArray(response.data)) return [];

        return response.data.map(job => ({
            externalId: job.id,
            title: job.text,
            companyName: site.charAt(0).toUpperCase() + site.slice(1),
            description: job.descriptionPlain || job.description,
            requirements: job.lists?.find(l => l.text.toLowerCase().includes("requirement"))?.content || "See job description.",
            location: job.categories?.location || "Remote",
            jobType: job.categories?.commitment || "Full-time",
            workMode: job.categories?.location?.toLowerCase().includes("remote") ? "Remote" : "Onsite",
            externalUrl: job.hostedUrl,
            source: "lever",
            skills: [],
        }));
    } catch (error) {
        console.error(`Lever sync error for ${site}:`, error.message);
        throw error;
    }
};
