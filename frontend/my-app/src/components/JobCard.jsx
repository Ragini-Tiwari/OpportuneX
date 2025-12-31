import { Link } from "react-router-dom";
import { MapPin, Briefcase, Monitor, DollarSign, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { jobService } from "../services/api.service";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const JobCard = ({ job, isSavedInitial = false }) => {
    const { isAuthenticated, user } = useAuthStore();
    const [isSaved, setIsSaved] = useState(isSavedInitial);
    const [saving, setSaving] = useState(false);

    const handleToggleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to save jobs");
            return;
        }

        if (user?.role !== "candidate") {
            toast.error("Only candidates can save jobs");
            return;
        }

        setSaving(true);
        try {
            const response = await jobService.toggleSaveJob(job._id);
            setIsSaved(response.isSaved);
            toast.success(response.message);
        } catch (error) {
            toast.error("Failed to save job");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Link
            to={`/jobs/${job._id}`}
            className="card block hover:border-primary-500/50 transition-all group"
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-100 group-hover:text-primary-400 transition-colors">
                            {job.title}
                        </h3>
                        {isAuthenticated && user?.role === "candidate" && (
                            <button
                                onClick={handleToggleSave}
                                disabled={saving}
                                className={`p-2 rounded-full transition-colors ${isSaved
                                    ? "text-primary-500 bg-primary-500/10"
                                    : "text-gray-500 hover:text-primary-500 hover:bg-white/5"
                                    }`}
                                title={isSaved ? "Unsave Job" : "Save Job"}
                            >
                                {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                            </button>
                        )}
                    </div>

                    <p className="text-primary-500 font-medium mb-3">{job.company}</p>

                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5 min-w-[120px]">
                            <MapPin size={16} className="text-gray-500" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-[100px]">
                            <Briefcase size={16} className="text-gray-500" />
                            <span>{job.jobType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-[100px]">
                            <Monitor size={16} className="text-gray-500" />
                            <span>{job.workMode}</span>
                        </div>
                        {job.salary?.max > 0 && (
                            <div className="flex items-center gap-1.5 text-gray-300">
                                <DollarSign size={16} className="text-primary-500/80" />
                                <span>
                                    {job.salary.currency} {job.salary.min.toLocaleString()} -{" "}
                                    {job.salary.max.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills.slice(0, 5).map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-primary-900/30 text-primary-300 border border-primary-500/20 rounded-full text-xs font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="text-right ml-4 hidden md:block">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default JobCard;
