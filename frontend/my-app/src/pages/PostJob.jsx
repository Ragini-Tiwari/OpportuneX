import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jobService } from "../services/api.service";
import toast from "react-hot-toast";

const PostJob = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Parse skills from comma-separated string
            if (data.skills) {
                data.skills = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
            }

            await jobService.createJob(data);
            toast.success("Job posted successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                {...register("title", { required: "Job title is required" })}
                                className="input-field"
                                placeholder="e.g., Senior Software Engineer"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                {...register("company", { required: "Company name is required" })}
                                className="input-field"
                                placeholder="e.g., Google"
                            />
                            {errors.company && (
                                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location *
                            </label>
                            <input
                                type="text"
                                {...register("location", { required: "Location is required" })}
                                className="input-field"
                                placeholder="e.g., San Francisco, CA"
                            />
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Type *
                            </label>
                            <select {...register("jobType")} className="input-field">
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Work Mode *
                            </label>
                            <select {...register("workMode")} className="input-field">
                                <option value="Onsite">Onsite</option>
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select {...register("category")} className="input-field">
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
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                {...register("description", { required: "Description is required" })}
                                rows={6}
                                className="input-field"
                                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Requirements *
                            </label>
                            <textarea
                                {...register("requirements", { required: "Requirements are required" })}
                                rows={6}
                                className="input-field"
                                placeholder="List the qualifications, skills, and experience needed..."
                            />
                            {errors.requirements && (
                                <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skills (comma-separated)
                            </label>
                            <input
                                type="text"
                                {...register("skills")}
                                className="input-field"
                                placeholder="e.g., React, Node.js, MongoDB"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Salary
                            </label>
                            <input
                                type="number"
                                {...register("salary.min")}
                                className="input-field"
                                placeholder="50000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Salary
                            </label>
                            <input
                                type="number"
                                {...register("salary.max")}
                                className="input-field"
                                placeholder="100000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Experience (years)
                            </label>
                            <input
                                type="number"
                                {...register("experience.min")}
                                className="input-field"
                                placeholder="2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Experience (years)
                            </label>
                            <input
                                type="number"
                                {...register("experience.max")}
                                className="input-field"
                                placeholder="5"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary flex-1 disabled:opacity-50"
                        >
                            {isLoading ? "Posting..." : "Post Job"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
