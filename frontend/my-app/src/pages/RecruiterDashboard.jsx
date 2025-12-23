import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobService } from "../services/api.service";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, Briefcase, Users } from "lucide-react";

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await jobService.getMyJobs();
            setJobs(response.data);
        } catch (error) {
            toast.error("Failed to fetch jobs");
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Job Postings</h1>
                    <Link to="/post-job" className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Post New Job
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="card text-center py-12">
                        <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg mb-4">No jobs posted yet</p>
                        <Link to="/post-job" className="btn-primary inline-flex items-center gap-2">
                            <Plus size={20} />
                            Post Your First Job
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="card">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                                        <p className="text-gray-600 mb-4">{job.company}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                            <span>{job.location}</span>
                                            <span>{job.jobType}</span>
                                            <span>{job.workMode}</span>
                                            <span
                                                className={`font-medium ${job.status === "active"
                                                        ? "text-green-600"
                                                        : job.status === "closed"
                                                            ? "text-red-600"
                                                            : "text-gray-600"
                                                    }`}
                                            >
                                                {job.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users size={16} />
                                            <span>{job.applicationsCount || 0} applications</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <Link
                                            to={`/applications/${job._id}`}
                                            className="btn-secondary flex items-center gap-1"
                                        >
                                            <Users size={16} />
                                            View Applications
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
