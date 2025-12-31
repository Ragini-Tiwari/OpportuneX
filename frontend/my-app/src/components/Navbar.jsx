import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { User, LogOut, Briefcase, Menu, X } from "lucide-react";

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsMenuOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black-950/50 backdrop-blur-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-xl font-bold text-primary-500">
                        <div className="bg-primary-500/10 p-1.5 rounded-lg border border-primary-500/20">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-gray-100">OpportuneX</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium">
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
                                    <>
                                        <Link
                                            to="/my-applications"
                                            className="text-gray-300 hover:text-primary-400 transition-colors"
                                        >
                                            My Applications
                                        </Link>
                                        <Link
                                            to="/saved-jobs"
                                            className="text-gray-300 hover:text-primary-400 transition-colors"
                                        >
                                            Saved Jobs
                                        </Link>
                                    </>
                                )}

                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="text-gray-300 hover:text-primary-400 transition-colors"
                                    >
                                        Admin Panel
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

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-300 p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-black-950 border-b border-white/5 animate-in slide-in-from-top duration-300">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        <Link
                            to="/jobs"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-300 hover:text-primary-400 transition-colors py-2"
                        >
                            Jobs
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {user?.role === "recruiter" && (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-300 hover:text-primary-400 transition-colors py-2"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                {user?.role === "candidate" && (
                                    <>
                                        <Link
                                            to="/my-applications"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-gray-300 hover:text-primary-400 transition-colors py-2"
                                        >
                                            My Applications
                                        </Link>
                                        <Link
                                            to="/saved-jobs"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-gray-300 hover:text-primary-400 transition-colors py-2"
                                        >
                                            Saved Jobs
                                        </Link>
                                    </>
                                )}
                                {user?.role === "admin" && (
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-300 hover:text-primary-400 transition-colors py-2"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <User size={16} />
                                        <span>{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 text-red-400"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 pt-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-gray-300 hover:text-white transition-colors py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-primary-600/90 text-white px-4 py-3 rounded-lg text-center font-medium"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
