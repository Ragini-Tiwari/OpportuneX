import { useState, useEffect } from "react";
import { adminService } from "../services/api.service";
import toast from "react-hot-toast";
import {
    Users,
    Briefcase,
    ClipboardList,
    TrendingUp,
    ShieldCheck,
    ShieldAlert,
    UserMinus,
    CheckCircle,
    XCircle,
    Activity
} from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "overview") {
                const response = await adminService.getStats();
                setStats(response.data.stats);
                setJobs(response.data.recentJobs);
                setUsers(response.data.recentUsers);
            } else if (activeTab === "users") {
                const response = await adminService.getUsers();
                setUsers(response.data);
            } else if (activeTab === "jobs") {
                const response = await adminService.getJobs();
                setJobs(response.data);
            } else if (activeTab === "logs") {
                const response = await adminService.getLogs();
                setLogs(response.data);
            }
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveJob = async (id, status) => {
        try {
            await adminService.approveJob(id, status);
            toast.success(`Job ${status === 'active' ? 'approved' : 'rejected'}`);
            fetchData();
        } catch (error) {
            toast.error("Failed to update job status");
        }
    };

    const handleToggleBlock = async (id) => {
        try {
            const response = await adminService.toggleUserBlock(id);
            toast.success(response.message);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to block user");
        }
    };

    const StatsCard = ({ title, value, icon: Icon, color }) => (
        <div className="card-glass p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative z-10 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Platform oversight and management</p>
                    </div>
                    <div className="flex bg-black-900/50 backdrop-blur-md p-1 rounded-xl border border-white/10">
                        {["overview", "users", "jobs", "logs"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                        ? "bg-primary-500 text-black shadow-lg shadow-primary-500/20"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {activeTab === "overview" && stats && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatsCard title="Total Users" value={stats.totalUsers} icon={Users} color="blue" />
                                    <StatsCard title="Total Jobs" value={stats.totalJobs} icon={Briefcase} color="green" />
                                    <StatsCard title="Applications" value={stats.totalApplications} icon={ClipboardList} color="purple" />
                                    <StatsCard title="Pending Review" value={stats.pendingJobs} icon={Activity} color="orange" />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="card-glass p-0 overflow-hidden">
                                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                            <h3 className="text-xl font-bold text-white">Recent Users</h3>
                                            <button onClick={() => setActiveTab("users")} className="text-primary-500 text-sm hover:underline">View All</button>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {users.map(u => (
                                                <div key={u._id} className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-medium">{u.name}</p>
                                                        <p className="text-gray-500 text-xs">{u.email}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-500' :
                                                            u.role === 'recruiter' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="card-glass p-0 overflow-hidden">
                                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                            <h3 className="text-xl font-bold text-white">Recent Jobs</h3>
                                            <button onClick={() => setActiveTab("jobs")} className="text-primary-500 text-sm hover:underline">View All</button>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {jobs.map(j => (
                                                <div key={j._id} className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-white font-medium">{j.title}</p>
                                                        <p className="text-gray-500 text-xs">{j.companyName}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${j.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                                                        }`}>
                                                        {j.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="card-glass overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Joined</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                        {users.map(u => (
                                            <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-white font-medium">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </td>
                                                <td className="px-6 py-4 uppercase font-bold text-[10px]">{u.role}</td>
                                                <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    {u.isBlocked ? (
                                                        <span className="text-red-500 flex items-center gap-1"><ShieldAlert size={14} /> Blocked</span>
                                                    ) : (
                                                        <span className="text-green-500 flex items-center gap-1"><ShieldCheck size={14} /> Active</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleToggleBlock(u._id)}
                                                        className={`p-2 rounded-lg transition-colors ${u.isBlocked ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'}`}
                                                    >
                                                        {u.isBlocked ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "jobs" && (
                            <div className="grid gap-6">
                                {jobs.map(j => (
                                    <div key={j._id} className="card-glass p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-white">{j.title}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${j.isApproved ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                                                    }`}>
                                                    {j.status}
                                                </span>
                                            </div>
                                            <p className="text-primary-500 text-sm mb-2">{j.companyName}</p>
                                            <div className="flex gap-4 text-xs text-gray-500">
                                                <span>{j.location}</span>
                                                <span>{j.jobType}</span>
                                                <span>Posted {new Date(j.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {j.status === 'pending_approval' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveJob(j._id, 'active')}
                                                        className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all flex items-center gap-2 text-sm px-4"
                                                    >
                                                        <CheckCircle size={18} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveJob(j._id, 'rejected')}
                                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2 text-sm px-4"
                                                    >
                                                        <XCircle size={18} /> Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "logs" && (
                            <div className="card-glass overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Admin</th>
                                            <th className="px-6 py-4">Action</th>
                                            <th className="px-6 py-4">Target</th>
                                            <th className="px-6 py-4">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                        {logs.map(log => (
                                            <tr key={log._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-white font-medium">{log.admin?.name}</p>
                                                    <p className="text-xs text-gray-500">{log.admin?.email}</p>
                                                </td>
                                                <td className="px-6 py-4 capitalize">{log.action.replace('_', ' ')}</td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white text-xs">{log.targetType}</p>
                                                    <p className="text-[10px] text-gray-500">{log.targetId}</p>
                                                </td>
                                                <td className="px-6 py-4 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
