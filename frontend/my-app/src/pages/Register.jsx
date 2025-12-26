import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authService } from "../services/api.service";
import useAuthStore from "../store/authStore";
import { Mail, Lock, User, Building, MapPin, ArrowRight } from "lucide-react";

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login: loginStore } = useAuthStore();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            role: "candidate",
        },
    });

    const selectedRole = watch("role");

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);
            loginStore(response.data.user, response.data.token);
            toast.success("Registration successful!");
            navigate(data.role === "recruiter" ? "/dashboard" : "/jobs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative z-10">
            <div className="max-w-md w-full space-y-8 bg-black-900/50 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/10">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-100">
                        Create Your Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Join OpportuneX today
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all has-[:checked]:border-primary-500 has-[:checked]:bg-primary-900/20 border-gray-700 hover:border-gray-600">
                                    <input
                                        type="radio"
                                        value="candidate"
                                        {...register("role")}
                                        className="sr-only"
                                    />
                                    <span className="font-medium text-gray-200">Candidate</span>
                                </label>
                                <label className="flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all has-[:checked]:border-primary-500 has-[:checked]:bg-primary-900/20 border-gray-700 hover:border-gray-600">
                                    <input
                                        type="radio"
                                        value="recruiter"
                                        {...register("role")}
                                        className="sr-only"
                                    />
                                    <span className="font-medium text-gray-200">Recruiter</span>
                                </label>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className="input-field pl-10"
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    id="password"
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Company (for recruiters) */}
                        {selectedRole === "recruiter" && (
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                                    Company Name
                                </label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        id="company"
                                        type="text"
                                        {...register("company")}
                                        className="input-field pl-10"
                                        placeholder="Acme Inc."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    id="location"
                                    type="text"
                                    {...register("location")}
                                    className="input-field pl-10"
                                    placeholder="New York, USA"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-gray-400">Already have an account? </span>
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
