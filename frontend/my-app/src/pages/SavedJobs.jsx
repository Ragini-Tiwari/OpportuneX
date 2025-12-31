import { useState, useEffect } from "react";
import { jobService } from "../services/api.service";
import JobCard from "../components/JobCard";
import toast from "react-hot-toast";
import { Bookmark, Briefcase } from "lucide-react";

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        setLoading(true);
        try {
            const response = await jobService.getSavedJobs();
            setSavedJobs(response.data);
        } catch (error) {
            toast.error("Failed to fetch saved jobs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative z-10 py-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <Bookmark className="text-primary-500" size={32} />
                    <h1 className="text-3xl font-bold text-gray-100">Saved Jobs</h1>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-400">Loading saved jobs...</p>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className="card text-center py-16">
                        <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-300 mb-2">No saved jobs yet</h2>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            Explore available positions and save the ones that catch your eye to view them later.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {savedJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                isSavedInitial={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
