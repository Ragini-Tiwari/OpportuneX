import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobService } from "../services/api.service";
import toast from "react-hot-toast";
import {
    Plus,
    Trash2,
    Briefcase,
    Users,
    Clock,
    MapPin,
    Monitor,
    ChevronRight,
    Search,
    Filter
} from "lucide-react";

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await jobService.getMyJobs();
            setJobs(response.data);
        } catch (error) {
            toast.error("Failed to fetch jobs", { id: "fetch_my_jobs_error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await jobService.deleteJob(jobId);
            toast.success("Job deleted successfully");
            fetchMyJobs();
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen relative z-10 py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Recruiter Center</h1>
                        <p className="text-gray-400">Manage your postings and track candidates.</p>
                    </div>
                    <Link to="/post-job" className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20 px-6 py-3">
                        <Plus size={20} />
                        Post New Vacancy
                    </Link>
                </div>

                {/* Search and Filters Bar */}
                <div className="mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search your postings..."
                            className="input-field pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="card-glass text-center py-20 flex flex-col items-center">
                        <div className="p-4 bg-primary-500/10 rounded-full text-primary-500 mb-6">
                            <Briefcase size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {searchTerm ? "No matching positions found" : "No jobs posted yet"}
                        </h3>
                        <p className="text-gray-400 mb-8 max-w-md">
                            {searchTerm
                                ? "Try adjusting your search terms to find the specific job posting."
                                : "Start building your team by posting your first job vacancy on OpportuneX."
                            }
                        </p>
                        {!searchTerm && (
                            <Link to="/post-job" className="btn-primary inline-flex items-center gap-2 px-8">
                                <Plus size={20} />
                                Post Your First Job
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="card-glass group hover:border-primary-500/30 transition-all duration-300">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-bold text-white group-hover:text-primary-500 transition-colors">
                                                {job.title}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest ${job.status === "active" ? "bg-green-500/20 text-green-500" :
                                                job.status === "pending_approval" ? "bg-orange-500/20 text-orange-500" :
                                                    "bg-red-500/20 text-red-500"
                                                }`}>
                                                {job.status?.replace('_', ' ') || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={16} className="text-primary-500" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase size={16} className="text-primary-500" />
                                                <span>{job.jobType}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Monitor size={16} className="text-primary-500" />
                                                <span>{job.workMode}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} className="text-primary-500" />
                                                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                                        <Link
                                            to={`/applications/job/${job._id}`}
                                            className="flex-1 lg:flex-none btn-secondary flex items-center justify-center gap-2 group/btn"
                                        >
                                            <Users size={18} className="group-hover/btn:text-primary-500" />
                                            <span className="font-bold">{job.applicationsCount || 0}</span>
                                            <span className="text-gray-400 text-xs">Applications</span>
                                            <ChevronRight size={16} className="ml-1 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300"
                                            title="Delete Posting"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
