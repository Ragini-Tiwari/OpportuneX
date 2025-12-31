import { Link } from "react-router-dom";
import { Briefcase, Github, Twitter, Linkedin, Mail, MapPin, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black-950 border-t border-white/5 pt-20 pb-10 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-500 mb-6">
                            <div className="bg-primary-500/10 p-2 rounded-lg border border-primary-500/20">
                                <Briefcase size={28} />
                            </div>
                            <span className="text-gray-100 tracking-tight">Opportune<span className="text-primary-500">X</span></span>
                        </Link>
                        <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-8">
                            Empowering the next generation of global talent. We bridge the gap between ambitious professionals and visionary companies through our intelligent, secure, and intuitive job matching ecosystem.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-gray-400 hover:text-gray-300 transition-colors">
                                <MapPin size={18} className="text-primary-500 mt-1 flex-shrink-0" />
                                <span className="text-sm">79 Science Park Dr, #04-01 Cintech IV, Singapore 118264</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 hover:text-gray-300 transition-colors">
                                <Phone size={18} className="text-primary-500 flex-shrink-0" />
                                <span className="text-sm">+1 (555) 000-1234</span>
                            </div>
                        </div>
                    </div>

                    {/* Resources Section */}
                    <div>
                        <h3 className="text-gray-100 font-bold mb-6 text-lg">For Candidates</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/jobs" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors"></span>
                                    Browse Open Roles
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-applications" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors"></span>
                                    Track Applications
                                </Link>
                            </li>
                            <li>
                                <Link to="/saved-jobs" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors"></span>
                                    Saved Opportunities
                                </Link>
                            </li>
                            <li>
                                <Link to="/resumes" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors"></span>
                                    Resume Builder <span className="text-[10px] bg-primary-500/10 text-primary-500 px-1.5 py-0.5 rounded border border-primary-500/20 ml-1 uppercase font-bold tracking-wider">Beta</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Employer Section */}
                    <div>
                        <h3 className="text-gray-100 font-bold mb-6 text-lg">For Employers</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/post-job" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors"></span>
                                    Post a Position
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors"></span>
                                    Hiring Plans
                                </Link>
                            </li>
                            <li>
                                <Link to="/recruiter-guide" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/30 group-hover:bg-primary-500 transition-colors"></span>
                                    Talent Sourcing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Connect */}
                    <div>
                        <h3 className="text-gray-100 font-bold mb-6 text-lg">Legal & Help</h3>
                        <ul className="space-y-4 mb-8">
                            <li>
                                <Link to="/help" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Help Center</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Service Terms</Link>
                            </li>
                        </ul>

                        <div className="flex gap-3">
                            <a href="#" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-primary-400 hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-primary-400 hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-primary-400 hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-300">
                                <Github size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mission / Detailed Text Section */}
                <div className="mb-16 p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] pointer-events-none group-hover:bg-primary-500/10 transition-colors duration-700"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h3 className="text-gray-100 font-bold mb-4 text-xl flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-primary-500"></span>
                                Our Commitment to Excellence
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                At OpportuneX, we believe that the right opportunity can change a life, and the right talent can change the world. Our platform is engineered to remove the noise from the recruitment process, focusing on meaningful connections, skill-based matching, and transparent communication. We are committed to building a diverse and inclusive global workforce where proximity is no longer a barrier to potential.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Join over <span className="text-primary-400 font-semibold">50,000+ professionals</span> and <span className="text-primary-400 font-semibold">2,500+ companies</span> who trust OpportuneX to power their growth. Our advanced AI-driven matching engine ensures that you spend less time searching and more time building.
                            </p>
                        </div>
                        <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-8">
                            <h4 className="text-gray-100 font-semibold mb-4 text-sm uppercase tracking-widest opacity-60">Platform Stats</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-primary-500">92%</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Fill Rate</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary-500">48h</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Avg. Response</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary-500">150+</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Countries</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-primary-500">24/7</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Global Support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter / Bottom Bar */}
                <div className="pt-10 border-t border-white/5">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="text-gray-500 text-xs">
                                &copy; {new Date().getFullYear()} OpportuneX Tech Labs. Crafted for the global elite.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
