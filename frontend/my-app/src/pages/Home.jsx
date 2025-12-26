import { Link } from "react-router-dom";
import { Briefcase, TrendingUp, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";
import BackgroundGrid from "../components/BackgroundGrid";

const Home = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100">
            <BackgroundGrid />

            {/* Content Wrapper */}
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="py-24 lg:py-32">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                                Find Your Dream Job with OpportuneX
                            </h1>
                            <p className="text-xl md:text-2xl mb-10 text-gray-400 max-w-2xl mx-auto">
                                Connect with top employers and discover opportunities that match your skills on our secure, next-gen platform.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link
                                    to="/jobs"
                                    className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/20"
                                >
                                    Browse Jobs
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-black-900 text-primary-400 px-8 py-3 rounded-lg font-semibold hover:bg-black-800 transition-all border border-primary-900"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold text-center mb-16 text-primary-50"
                        >
                            Why Choose OpportuneX?
                        </motion.h2>

                        <motion.div
                            className="grid md:grid-cols-4 gap-8"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {[
                                { icon: Briefcase, title: "Quality Jobs", desc: "Access to thousands of verified job opportunities" },
                                { icon: TrendingUp, title: "Career Growth", desc: "Find roles that match your career aspirations" },
                                { icon: Users, title: "Top Employers", desc: "Connect with leading companies in your industry" },
                                { icon: Shield, title: "Secure Platform", desc: "Your data is protected with enterprise-grade security" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    className="bg-black-900/50 backdrop-blur-sm border border-black-800 p-8 rounded-xl hover:border-primary-500/50 transition-colors group"
                                >
                                    <div className="bg-black-950 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-900/20 transition-colors">
                                        <feature.icon className="text-primary-500" size={32} />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-3 text-center text-primary-100">{feature.title}</h3>
                                    <p className="text-gray-400 text-center">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-black-900 border border-primary-900/30 rounded-2xl p-12 max-w-4xl mx-auto backdrop-blur-md relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none" />
                            <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to Get Started?</h2>
                            <p className="text-gray-400 mb-8 relative z-10">
                                Join thousands of job seekers finding their perfect match
                            </p>
                            <Link
                                to="/register"
                                className="inline-block bg-primary-600 hover:bg-primary-500 text-white text-lg px-8 py-3 rounded-lg font-semibold transition-all relative z-10"
                            >
                                Create Free Account
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
