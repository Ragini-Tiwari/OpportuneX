import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Github } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="container mx-auto px-4 py-12">
                {/* Main Row: Logo - Nav - Socials */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16 px-4">
                    {/* Logo - Styled like Dribbble */}
                    <Link to="/" className="text-3xl font-black text-black tracking-tighter hover:opacity-80 transition-opacity">
                        OpportuneX
                    </Link>

                    {/* Navigation - Horizontal List */}
                    <nav className="flex flex-wrap justify-center items-center gap-x-1 md:gap-x-2">
                        <Link to="/jobs" className="footer-link">For Developers</Link>
                        <Link to="/post-job" className="footer-link">Hire Talent</Link>
                        <Link to="/inspiration" className="footer-link">Inspiration</Link>
                        <Link to="/blog" className="footer-link">Blog</Link>
                        <Link to="/about" className="footer-link">About</Link>
                        <Link to="/careers" className="footer-link">Careers</Link>
                        <Link to="/support" className="footer-link">Support</Link>
                    </nav>

                    {/* Socials - Simple Icons */}
                    <div className="flex items-center gap-6">
                        <Twitter className="footer-social-icon" size={20} />
                        <Facebook className="footer-social-icon" size={20} />
                        <Instagram className="footer-social-icon" size={20} />
                        <Github className="footer-social-icon" size={20} />
                    </div>
                </div>

                {/* Bottom Row: Copyright - Secondary Links */}
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-100 pt-8 gap-4 px-4">
                    <div className="flex items-center gap-6 text-gray-500 text-sm">
                        <span className="text-gray-400">© {new Date().getFullYear()} OpportuneX</span>
                        <Link to="/terms" className="footer-secondary-link font-medium">Terms</Link>
                        <Link to="/privacy" className="footer-secondary-link font-medium">Privacy</Link>
                        <Link to="/cookies" className="footer-secondary-link font-medium">Cookies</Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link to="/jobs" className="footer-secondary-link font-medium">Jobs</Link>
                        <Link to="/designers" className="footer-secondary-link font-medium">Developers</Link>
                        <Link to="/freelancers" className="footer-secondary-link font-medium">Freelancers</Link>
                        <Link to="/tags" className="footer-secondary-link font-medium">Tags</Link>
                        <Link to="/places" className="footer-secondary-link font-medium">Places</Link>
                        <Link to="/resources" className="footer-secondary-link font-medium">Resources</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
