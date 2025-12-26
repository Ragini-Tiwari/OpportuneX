import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { User, LogOut, Briefcase } from "lucide-react";

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black-950/50 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-500">
                        <div className="bg-primary-500/10 p-1.5 rounded-lg border border-primary-500/20">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-gray-100">OpportuneX</span>
                    </Link>

                    <div className="flex items-center gap-6 text-sm font-medium">
                        <Link to="/jobs" className="text-gray-300 hover:text-primary-400 transition-colors">
                            Jobs
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user?.role === "recruiter" && (
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-300 hover:text-primary-400 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {user?.role === "candidate" && (
                                    <Link
                                        to="/my-applications"
                                        className="text-gray-300 hover:text-primary-400 transition-colors"
                                    >
                                        My Applications
                                    </Link>
                                )}

                                <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <User size={16} />
                                        <span>{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-600/90 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-all border border-primary-500/50 shadow-lg shadow-primary-500/20"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
