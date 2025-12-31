import { useState, useEffect } from "react";
import { adminService } from "../services/api.service";
import toast from "react-hot-toast";
import { Users, Briefcase, FileText, Trash2, LayoutDashboard, Search } from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, jobsRes] = await Promise.all([
                adminService.getStats(),
                adminService.getUsers(),
                adminService.getJobs()
            ]);
            setStats(statsRes.data.stats);
            setUsers(usersRes.data);
            setJobs(jobsRes.data);
        } catch (error) {
            toast.error("Failed to fetch admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await adminService.deleteUser(userId);
            toast.success("User deleted successfully");
            setUsers(users.filter(u => u._id !== userId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative z-10 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-100 mb-8 flex items-center gap-2">
                    <LayoutDashboard className="text-primary-500" size={32} />
                    Admin Control Panel
                </h1>

                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === "overview" ? "bg-primary-600 text-white" : "bg-black-900 border border-white/10 text-gray-400 hover:text-white"
                            }`}
                    >
                        <LayoutDashboard size={18} /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === "users" ? "bg-primary-600 text-white" : "bg-black-900 border border-white/10 text-gray-400 hover:text-white"
                            }`}
                    >
                        <Users size={18} /> User Management
                    </button>
                    <button
                        onClick={() => setActiveTab("jobs")}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeTab === "jobs" ? "bg-primary-600 text-white" : "bg-black-900 border border-white/10 text-gray-400 hover:text-white"
                            }`}
                    >
                        <Briefcase size={18} /> Job Management
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="card text-center p-6">
                                <Users className="mx-auto text-blue-500 mb-2" size={32} />
                                <h3 className="text-gray-400 font-medium">Total Users</h3>
                                <p className="text-4xl font-bold text-gray-100">{stats?.totalUsers}</p>
                            </div>
                            <div className="card text-center p-6">
                                <Briefcase className="mx-auto text-green-500 mb-2" size={32} />
                                <h3 className="text-gray-400 font-medium">Total Jobs</h3>
                                <p className="text-4xl font-bold text-gray-100">{stats?.totalJobs}</p>
                            </div>
                            <div className="card text-center p-6">
                                <FileText className="mx-auto text-purple-500 mb-2" size={32} />
                                <h3 className="text-gray-400 font-medium">Applications</h3>
                                <p className="text-4xl font-bold text-gray-100">{stats?.totalApplications}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="card">
                                <h2 className="text-xl font-bold text-gray-100 mb-4">Latest Registered Users</h2>
                                <div className="space-y-3">
                                    {users.slice(0, 5).map(u => (
                                        <div key={u._id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-200">{u.name}</p>
                                                <p className="text-sm text-gray-400">{u.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${u.role === "admin" ? "bg-red-500/20 text-red-500" :
                                                    u.role === "recruiter" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"
                                                }`}>
                                                {u.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card">
                                <h2 className="text-xl font-bold text-gray-100 mb-4">Latest Job Postings</h2>
                                <div className="space-y-3">
                                    {jobs.slice(0, 5).map(j => (
                                        <div key={j._id} className="p-3 bg-white/5 rounded-lg">
                                            <p className="font-medium text-gray-200">{j.title}</p>
                                            <div className="flex justify-between text-sm text-gray-400">
                                                <span>{j.company}</span>
                                                <span>{new Date(j.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Management Tab */}
                {activeTab === "users" && (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-gray-200">{u.name}</td>
                                        <td className="p-4 text-gray-400">{u.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${u.role === "admin" ? "bg-red-500/20 text-red-500" :
                                                    u.role === "recruiter" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                                title="Delete User"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Job Management Tab */}
                {activeTab === "jobs" && (
                    <div className="card overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400">
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Company</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4 text-center">Applications</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(j => (
                                    <tr key={j._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-gray-200">{j.title}</td>
                                        <td className="p-4 text-gray-400">{j.company}</td>
                                        <td className="p-4 text-gray-400">{j.location}</td>
                                        <td className="p-4 text-center text-gray-200">{j.applicationsCount || 0}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${j.status === "active" ? "bg-green-500/20 text-green-500" :
                                                    j.status === "closed" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                                                }`}>
                                                {j.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
