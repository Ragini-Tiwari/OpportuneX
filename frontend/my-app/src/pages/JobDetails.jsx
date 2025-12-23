import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jobService, applicationService } from "../services/api.service";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import {
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    Monitor,
    Calendar,
    ArrowLeft,
    Send,
} from "lucide-react";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applying, setApplying] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const response = await jobService.getJob(id);
            setJob(response.data);
        } catch (error) {
            toast.error("Failed to fetch job details");
            navigate("/jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (data) => {
        if (!isAuthenticated) {
            toast.error("Please login to apply");
            navigate("/login");
            return;
        }

        setApplying(true);
        try {
            await applicationService.createApplication({
                job: id,
                resume: data.resume,
                coverLetter: data.coverLetter,
            });
            toast.success("Application submitted successfully!");
            setShowApplyModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit application");
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
                >
                    <ArrowLeft size={20} />
                    Back to Jobs
                </Link>

                <div className="card">
                    {/* Header */}
                    <div className="border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <p className="text-xl text-primary-600 font-medium mb-4">{job.company}</p>

                        <div className="flex flex-wrap gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                                <MapPin size={18} />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Briefcase size={18} />
                                <span>{job.jobType}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Monitor size={18} />
                                <span>{job.workMode}</span>
                            </div>
                            {job.salary?.max > 0 && (
                                <div className="flex items-center gap-1">
                                    <DollarSign size={18} />
                                    <span>
                                        {job.salary.currency} {job.salary.min.toLocaleString()} -{" "}
                                        {job.salary.max.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Clock size={18} />
                                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {job.applicationDeadline && (
                            <div className="mt-4 flex items-center gap-2 text-orange-600">
                                <Calendar size={18} />
                                <span>
                                    Application Deadline:{" "}
                                    {new Date(job.applicationDeadline).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Job Description</h2>
                        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>

                    {/* Requirements */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                        <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                    </div>

                    {/* Apply Button */}
                    {isAuthenticated && user?.role === "candidate" && (
                        <div className="pt-6 border-t">
                            <button
                                onClick={() => setShowApplyModal(true)}
                                className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Apply for this Position
                            </button>
                        </div>
                    )}

                    {!isAuthenticated && (
                        <div className="pt-6 border-t">
                            <Link to="/login" className="btn-primary w-full md:w-auto block text-center">
                                Login to Apply
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold mb-4">Apply for {job.title}</h3>

                        <form onSubmit={handleSubmit(handleApply)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Resume URL *
                                </label>
                                <input
                                    type="url"
                                    {...register("resume", {
                                        required: "Resume URL is required",
                                        pattern: {
                                            value: /^https?:\/\/.+/,
                                            message: "Please provide a valid URL",
                                        },
                                    })}
                                    className="input-field"
                                    placeholder="https://example.com/your-resume.pdf"
                                />
                                {errors.resume && (
                                    <p className="mt-1 text-sm text-red-600">{errors.resume.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover Letter (Optional)
                                </label>
                                <textarea
                                    {...register("coverLetter")}
                                    rows={4}
                                    className="input-field"
                                    placeholder="Tell us why you're a great fit..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={applying}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    {applying ? "Submitting..." : "Submit Application"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowApplyModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
