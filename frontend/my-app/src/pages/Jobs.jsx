import { useState, useEffect } from "react";
import { jobService } from "../services/api.service";
import useAuthStore from "../store/authStore";
import JobCard from "../components/JobCard";
import Filters from "../components/Filters";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";

const Jobs = () => {
    const { isAuthenticated, user } = useAuthStore();
    const [jobs, setJobs] = useState([]);
    const [savedJobsIds, setSavedJobsIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        jobType: "",
        workMode: "",
        location: "",
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (isAuthenticated && user?.role === "candidate") {
            fetchSavedJobsIds();
        }
    }, [isAuthenticated, user]);

    const fetchJobs = async (customFilters = {}) => {
        setLoading(true);
        try {
            const params = { ...filters, ...customFilters };
            // Remove empty filters
            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const response = await jobService.getAllJobs(params);
            setJobs(response.data || []);
        } catch (error) {
            toast.error("Failed to fetch jobs", { id: "fetch_jobs_error" });
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedJobsIds = async () => {
        try {
            const response = await jobService.getSavedJobs();
            setSavedJobsIds(response.data.map(job => job._id));
        } catch (error) {
            console.error("Failed to fetch saved jobs ids", error);
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        fetchJobs();
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen relative z-10 pb-12">
            <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />

            {/* Jobs List */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-400">Loading jobs...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No jobs found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                isSavedInitial={savedJobsIds.includes(job._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
