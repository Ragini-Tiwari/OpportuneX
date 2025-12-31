import { Search, MapPin } from "lucide-react";

const Filters = ({ filters, onFilterChange, onSearch }) => {
    return (
        <div className="bg-black-900/50 backdrop-blur-md border-b border-white/10 shadow-lg py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-100">Find Your Next Opportunity</h1>

                <form onSubmit={onSearch} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search Input */}
                        <div className="relative md:col-span-2">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Job title, keywords..."
                                value={filters.search}
                                onChange={(e) => onFilterChange("search", e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        {/* Location */}
                        <div className="relative">
                            <MapPin
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={filters.location}
                                onChange={(e) => onFilterChange("location", e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>

                        {/* Search Button */}
                        <button type="submit" className="btn-primary">
                            Search Jobs
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <select
                            value={filters.category}
                            onChange={(e) => onFilterChange("category", e.target.value)}
                            className="input-field text-gray-300 [&>option]:bg-black-900"
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
                            onChange={(e) => onFilterChange("jobType", e.target.value)}
                            className="input-field text-gray-300 [&>option]:bg-black-900"
                        >
                            <option value="">All Job Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>

                        <select
                            value={filters.workMode}
                            onChange={(e) => onFilterChange("workMode", e.target.value)}
                            className="input-field text-gray-300 [&>option]:bg-black-900"
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
    );
};

export default Filters;
