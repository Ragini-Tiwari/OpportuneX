import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { applicationService } from "../services/api.service";
import toast from "react-hot-toast";
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    ExternalLink,
    Clock,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    MessageSquare
} from "lucide-react";

const JobApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const fetchApplications = async () => {
        try {
            const response = await applicationService.getJobApplications(jobId);
            setApplications(response.data);
        } catch (error) {
            toast.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId, status) => {
        const notes = prompt("Enter notes for this status change (optional):");
        setUpdatingId(applicationId);
        try {
            await applicationService.updateApplicationStatus(applicationId, status, notes);
            toast.success(`Status updated to ${status}`);
            fetchApplications();
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-500/20 text-blue-500';
            case 'shortlisted': return 'bg-yellow-500/20 text-yellow-500';
            case 'interview': return 'bg-purple-500/20 text-purple-500';
            case 'offer': return 'bg-primary-500/20 text-primary-500';
            case 'rejected': return 'bg-red-500/20 text-red-500';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    return (
        <div className="min-h-screen relative z-10 py-8 text-gray-100">
            <div className="container mx-auto px-4">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 mb-8 transition-colors">
                    <ChevronLeft size={20} />
                    Back to Dashboard
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Applicants</h1>
                        <p className="text-gray-400">Manage candidates through your hiring pipeline.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="card-glass text-center py-20">
                        <User size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 text-lg">No one has applied for this position yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div key={app._id} className="card-glass p-0 overflow-hidden">
                                <div className="p-6 md:flex justify-between items-start gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20 uppercase text-xl font-bold">
                                                {app.applicant?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{app.applicant?.name}</h3>
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-primary-500" />
                                                <span>{app.applicant?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-primary-500" />
                                                <span>{app.applicant?.phone || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-primary-500" />
                                                <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <a
                                                href={app.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-secondary text-xs flex items-center gap-2 px-4"
                                            >
                                                <ExternalLink size={14} /> View Resume
                                            </a>
                                            {app.coverLetter && (
                                                <button className="btn-secondary text-xs flex items-center gap-2 px-4">
                                                    <MessageSquare size={14} /> Cover Letter
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 md:mt-0 flex md:flex-col gap-2">
                                        <button
                                            disabled={updatingId === app._id}
                                            onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                                            className="flex-1 btn-secondary text-xs py-2 hover:bg-yellow-500/10 hover:text-yellow-500 border-yellow-500/20"
                                        >
                                            Shortlist
                                        </button>
                                        <button
                                            disabled={updatingId === app._id}
                                            onClick={() => handleStatusUpdate(app._id, 'interview')}
                                            className="flex-1 btn-secondary text-xs py-2 hover:bg-purple-500/10 hover:text-purple-500 border-purple-500/20"
                                        >
                                            Interview
                                        </button>
                                        <button
                                            disabled={updatingId === app._id}
                                            onClick={() => handleStatusUpdate(app._id, 'offer')}
                                            className="flex-1 btn-secondary text-xs py-2 hover:bg-primary-500/10 hover:text-primary-500 border-primary-500/20"
                                        >
                                            Make Offer
                                        </button>
                                        <button
                                            disabled={updatingId === app._id}
                                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                            className="flex-1 btn-secondary text-xs py-2 hover:bg-red-500/10 hover:text-red-500 border-red-500/20"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>

                                {app.statusHistory && app.statusHistory.length > 1 && (
                                    <div className="bg-white/5 p-4 border-t border-white/5">
                                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">History</p>
                                        <div className="space-y-2">
                                            {app.statusHistory.map((history, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs">
                                                    <CheckCircle2 size={12} className="text-primary-500" />
                                                    <span className="text-gray-300 font-bold uppercase">{history.status}</span>
                                                    <span className="text-gray-500">— {new Date(history.changedAt).toLocaleDateString()}</span>
                                                    {history.notes && <span className="text-gray-400 italic">"{history.notes}"</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;
