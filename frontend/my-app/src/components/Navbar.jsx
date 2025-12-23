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
        <nav className="bg-primary-700 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                        <Briefcase size={28} />
                        <span>OpportuneX</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/jobs" className="hover:text-primary-200 transition-colors">
                            Jobs
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user?.role === "recruiter" && (
                                    <Link
                                        to="/dashboard"
                                        className="hover:text-primary-200 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {user?.role === "candidate" && (
                                    <Link
                                        to="/my-applications"
                                        className="hover:text-primary-200 transition-colors"
                                    >
                                        My Applications
                                    </Link>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <User size={18} />
                                        <span className="text-sm">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 hover:text-primary-200 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:text-primary-200 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors font-medium"
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
