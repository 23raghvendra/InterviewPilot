import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Brain, BarChart3, Mic, Shield, Clock, ArrowRight, CheckCircle, Sparkles, Code2, Users, Bot } from 'lucide-react';

const features = [
    { icon: Brain, title: 'Adaptive AI Questions', desc: 'Our AI dynamically adjusts the difficulty and scope of questions based on your real-time performance and the specific role.' },
    { icon: Mic, title: 'Realistic Voice Interactions', desc: 'Experience lifelike, low-latency natural language conversations simulating real human interviewers perfectly.' },
    { icon: BarChart3, title: 'Actionable Analytics', desc: 'Receive a comprehensive breakdown of your strengths, weaknesses, communication clarity, and technical correctness.' },
    { icon: Sparkles, title: 'Instant Constructive Feedback', desc: 'Get immediately actionable tip sets on your answers, body language, and tone directly after each mock session.' },
    { icon: Clock, title: 'Time-Stressed Environment', desc: 'Simulate high-pressure scenarios with enforced time limits to build unparalleled confidence.' },
    { icon: Shield, title: 'Private & Secure', desc: 'Your interview recordings and feedback reports remain safely encrypted and visible only to you.' }
];

const interviewTypes = [
    { name: 'Software Engineering', icon: Code2, desc: 'DSA, System Design, Live Coding' },
    { name: 'Behavioral & Leadership', icon: Users, desc: 'STAR Method, Conflict Resolution, Culture Fit' },
    { name: 'Product Management', icon: Box, desc: 'Product Sense, Execution, Metrics' },
    { name: 'AI & Data Science', icon: Bot, desc: 'Machine Learning, Stats, SQL, Architecture' },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-surface overflow-hidden text-text-primary selection:bg-white/20">
            {/* Minimalist Background Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-light border-b border-gray-200 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
                    <Link to="/" className="flex items-center gap-3 relative group">
                        <div className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                            <Box size={18} className="text-surface relative z-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Interview<span className="text-text-secondary font-medium">Pilot</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/auth" className="text-sm font-medium text-text-secondary hover:text-gray-900 transition-colors px-4 py-2">
                            Log in
                        </Link>
                        <Link to="/auth">
                            <button className="px-5 py-2 text-sm font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">Get Started Free</button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-44 pb-24 px-6 z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-5xl mx-auto text-center"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-gray-900/5 text-text-primary text-sm font-medium mb-8">
                        <Box size={16} className="text-gray-900" />
                        <span>Next-Generation Technical Preparation</span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-semibold leading-[1.1] mb-8 tracking-tighter text-gray-900">
                        Master Your Next
                        <br />
                        <span className="text-text-secondary">Tech Interview.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
                        Practice with structured, rigorous mock interviews. Get actionable feedback, track analytics, and confidently land your dream role.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link to="/auth">
                            <button className="px-10 py-5 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all flex items-center">
                                Start Free Session <ArrowRight size={20} className="ml-2" />
                            </button>
                        </Link>
                        <Link to="/auth">
                            <div className="px-10 py-5 rounded-full border border-gray-400 hover:bg-gray-900/5 backdrop-blur-md transition-all text-gray-900 font-semibold flex items-center justify-center cursor-pointer">
                                View Demo Sandbox
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-text-secondary font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-gray-900" /> No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-gray-900" /> Built for Students & Professionals
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-gray-900" /> State-of-the-art LLMs
                        </div>
                    </motion.div>
                </motion.div>

                {/* Floating UI Elements Mockup (Minimalist) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-24 max-w-5xl mx-auto relative hidden md:block"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
                    <div className="rounded-[2rem] p-2 border border-gray-300 bg-gray-900/5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                        <div className="bg-surface rounded-2xl h-[400px] border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                            <div className="w-20 h-20 rounded-full border border-gray-400 bg-gray-900/5 flex items-center justify-center mb-6">
                                <Mic size={32} className="text-gray-900" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-gray-900">Simulated Technical Interview</h3>
                            <p className="text-text-muted">Listening to your response...</p>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className={`w-1.5 rounded-full bg-white/40 ${i % 2 === 0 ? 'h-6' : 'h-10'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Interview Domains */}
            <section className="py-24 px-6 relative z-10 bg-surface-light border-y border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight text-gray-900">Master Every Domain</h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Specialized modules designed to conduct rigorous technical and behavioral assessments across disciplines.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {interviewTypes.map((type, idx) => {
                            const Icon = type.icon;
                            return (
                                <motion.div
                                    key={type.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group p-8 rounded-2xl border border-gray-300 hover:border-white/30 bg-surface relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gray-900/5 flex items-center justify-center mb-6 border border-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <Icon size={24} className="text-text-primary group-hover:text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{type.name}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{type.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight text-gray-900">Intelligence at its Core</h2>
                        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                            Engineered to simulate the most rigorous interview environments to perfection.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map(({ icon: Icon, title, desc }, idx) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="rounded-2xl p-8 hover:bg-gray-900/5 transition-all duration-300 border border-gray-300"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-900/5 flex items-center justify-center mb-5">
                                    <Icon size={20} className="text-gray-900" />
                                </div>
                                <h3 className="text-lg font-medium mb-3 text-gray-900">{title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="border border-gray-300 bg-gray-900/5 rounded-3xl p-12 md:p-20 relative overflow-hidden backdrop-blur-sm"
                    >
                        <div className="absolute inset-0 bg-surface-light/50" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-gray-900">Your Next Role Awaits.</h2>
                            <p className="text-text-secondary text-lg mb-10 max-w-2xl mx-auto">
                                Join professionals who used InterviewPilot to refine their skills and land offers at top engineering firms.
                            </p>
                            <Link to="/auth">
                                <button className="px-12 py-5 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                                    Create Free Account
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-surface py-12 px-6 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                            <Box size={16} className="text-surface" />
                        </div>
                        <span className="font-semibold text-lg text-gray-900">InterviewPilot</span>
                    </div>
                    <div className="text-text-muted text-sm">
                        © 2026 InterviewPilot. All rights reserved.
                    </div>
                    <div className="flex items-center gap-8 text-sm font-medium text-text-secondary">
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
