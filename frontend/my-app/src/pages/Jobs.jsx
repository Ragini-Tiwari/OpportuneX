import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jobService } from "../services/api.service";
import toast from "react-hot-toast";
import {
    Search,
    MapPin,
    Briefcase,
    DollarSign,
    Clock,
    Monitor,
} from "lucide-react";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
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

    const fetchJobs = async (customFilters = {}) => {
        setLoading(true);
        try {
            const params = { ...filters, ...customFilters };
            // Remove empty filters
            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const response = await jobService.getAllJobs(params);
            setJobs(response.data);
        } catch (error) {
            toast.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Section */}
            <div className="bg-white shadow-sm py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">Find Your Next Opportunity</h1>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid md:grid-cols-4 gap-4">
                            {/* Search Input */}
                            <div className="relative md:col-span-2">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>

                            {/* Location */}
                            <div className="relative">
                                <MapPin
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>

                            {/* Search Button */}
                            <button type="submit" className="btn-primary">
                                Search Jobs
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange("category", e.target.value)}
                                className="input-field"
                            >
                                <option value="">All Categories</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="Product">Product</option>
                                <option value="Operations">Operations</option>
                                <option value="HR">HR</option>
                                <option value="Finance">Finance</option>
                                <option value="Other">Other</option>
                            </select>

                            <select
                                value={filters.jobType}
                                onChange={(e) => handleFilterChange("jobType", e.target.value)}
                                className="input-field"
                            >
                                <option value="">All Job Types</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>

                            <select
                                value={filters.workMode}
                                onChange={(e) => handleFilterChange("workMode", e.target.value)}
                                className="input-field"
                            >
                                <option value="">All Work Modes</option>
                                <option value="Remote">Remote</option>
                                <option value="Onsite">Onsite</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>

            {/* Jobs List */}
            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading jobs...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">No jobs found. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <Link
                                key={job._id}
                                to={`/jobs/${job._id}`}
                                className="card block hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {job.title}
                                        </h3>
                                        <p className="text-primary-600 font-medium mb-3">{job.company}</p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={16} />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase size={16} />
                                                <span>{job.jobType}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Monitor size={16} />
                                                <span>{job.workMode}</span>
                                            </div>
                                            {job.salary?.max > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign size={16} />
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
                                                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right ml-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock size={14} />
                                            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
