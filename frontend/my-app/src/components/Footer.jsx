import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black-950/10 backdrop-blur-sm border-t border-white/10 mt-auto relative z-50">
            <div className="container mx-auto px-4 py-12">
                {/* Main Row: Logo - Nav - Socials */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 px-4">
                    {/* Logo - Styled like Dribbble */}
                    <Link to="/" className="text-3xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity">
                        OpportuneX
                    </Link>

                    {/* Navigation - Horizontal List */}
                    <nav className="flex flex-wrap justify-center items-center gap-x-1 md:gap-x-2">
                        <Link to="/jobs" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4">For Developers</Link>
                        <Link to="/post-job" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4">Hire Talent</Link>
                        <Link to="/inspiration" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4">Inspiration</Link>
                        <Link to="/blog" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4">Blog</Link>
                        <Link to="/about" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4">About</Link>
                        <Link to="/careers" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4">Careers</Link>
                        <Link to="/support" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4">Support</Link>
                    </nav>

                    {/* Socials - Simple Icons */}
                    <div className="flex items-center gap-6">
                        <Twitter className="text-gray-400 hover:text-white transition-colors" size={20} />
                        <Facebook className="text-gray-400 hover:text-white transition-colors" size={20} />
                        <Instagram className="text-gray-400 hover:text-white transition-colors" size={20} />
                        <Github className="text-gray-400 hover:text-white transition-colors" size={20} />
                    </div>
                </div>

                {/* Bottom Row: Copyright - Secondary Links */}
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4 px-4">
                    <div className="flex items-center gap-6 text-gray-500 text-sm">
                        <span className="text-gray-400">© {new Date().getFullYear()} OpportuneX</span>
                        <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Terms</Link>
                        <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Privacy</Link>
                        <Link to="/cookies" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Cookies</Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link to="/jobs" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Jobs</Link>
                        <Link to="/designers" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Developers</Link>
                        <Link to="/freelancers" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Freelancers</Link>
                        <Link to="/tags" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Tags</Link>
                        <Link to="/places" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Places</Link>
                        <Link to="/resources" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Resources</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
