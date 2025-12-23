import { Link } from "react-router-dom";
import { Briefcase, TrendingUp, Users, Shield } from "lucide-react";

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Find Your Dream Job with OpportuneX
                    </h1>
                    <p className="text-xl mb-8 text-primary-100">
                        Connect with top employers and discover opportunities that match your skills
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/jobs"
                            className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                        >
                            Browse Jobs
                        </Link>
                        <Link
                            to="/register"
                            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors border-2 border-white"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Why Choose OpportuneX?
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="text-primary-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Quality Jobs</h3>
                            <p className="text-gray-600">
                                Access to thousands of verified job opportunities
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="text-primary-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Career Growth</h3>
                            <p className="text-gray-600">
                                Find roles that match your career aspirations
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="text-primary-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Top Employers</h3>
                            <p className="text-gray-600">
                                Connect with leading companies in your industry
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="text-primary-600" size={32} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Secure Platform</h3>
                            <p className="text-gray-600">
                                Your data is protected with enterprise-grade security
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-600 mb-8">
                        Join thousands of job seekers finding their perfect match
                    </p>
                    <Link
                        to="/register"
                        className="inline-block btn-primary text-lg px-8 py-3"
                    >
                        Create Free Account
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
