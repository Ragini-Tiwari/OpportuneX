import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Github, ArrowRight, Briefcase } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#09090b] border-t border-white/10 pt-20 pb-10 relative overflow-hidden">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px),
                            linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
                    backgroundSize: "4rem 4rem",
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#10b981]">
                            <div className="bg-[#10b981]/10 p-1.5 rounded-lg border border-[#10b981]/20">
                                <Briefcase size={24} />
                            </div>
                            <span className="text-gray-100">OpportuneX</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Empowering developers to build the future together. The ultimate platform for collaboration, innovation, and growth powered by AI.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h3 className="text-gray-100 font-bold mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/collab-hub" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm">
                                    Collab Hub
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm">
                                    Tech Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/roadmap" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm flex items-center gap-2">
                                    Roadmap
                                    <span className="text-[10px] font-bold bg-[#10b981]/10 text-[#34d399] px-2 py-0.5 rounded-full border border-[#10b981]/20">
                                        New
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h3 className="text-gray-100 font-bold mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/documentation" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link to="/community-rules" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm">
                                    Community Rules
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-[#10b981] transition-colors text-sm">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h3 className="text-gray-100 font-bold mb-6">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest AI trends and platform updates.
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-[#09090b]/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#10b981]/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1.5 p-1.5 bg-white text-[#09090b] rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} OpportuneX. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>Made with</span>
                        <span className="text-red-500">❤</span>
                        <span>by Ragini</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
