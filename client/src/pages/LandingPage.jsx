import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Brain, BarChart3, Mic, Shield, Clock, ArrowRight, CheckCircle, 
    Sparkles, Code2, Users, Bot, Terminal, Cpu, Award
} from 'lucide-react';

const features = [
    { 
        icon: Brain, 
        title: 'Adaptive Cognitive AI', 
        desc: 'Our neural evaluation engine dynamically shifts the technical complexity of the follow-ups based on your exact answer quality and verbal confidence.',
        glow: 'hover:border-purple-500/30'
    },
    { 
        icon: Mic, 
        title: 'Immersive Voice Synthesis', 
        desc: 'Interact naturally with our ultra-low latency conversational engine. Simulates the natural flow, interruptions, and pacing of real face-to-face interviews.',
        glow: 'hover:border-blue-500/30'
    },
    { 
        icon: BarChart3, 
        title: 'Granular Analytics Stack', 
        desc: 'Receive exhaustive analytical score sheets mapping your strengths, vocabulary quality, architectural logic, and semantic alignment.',
        glow: 'hover:border-cyan-500/30'
    },
    { 
        icon: Sparkles, 
        title: 'Deep Feedback Loops', 
        desc: 'Instant, actionable bullet points showing the exact key concepts you covered, crucial edge cases you missed, and a model ideal answer.',
        glow: 'hover:border-indigo-500/30'
    },
    { 
        icon: Clock, 
        title: 'Time-Boxed Stress Simulation', 
        desc: 'Recreate high-pressure environment limits with adaptive timers. Build mental resilience, clear pacing habits, and robust crisis communication.',
        glow: 'hover:border-violet-500/30'
    },
    { 
        icon: Shield, 
        title: 'Secure & Cryptographic', 
        desc: 'All evaluations, custom configurations, and analytical reports are locked in your private space, fully encrypted and visible only to you.',
        glow: 'hover:border-pink-500/30'
    }
];

const interviewTypes = [
    { name: 'Core Tech & DSA', icon: Code2, desc: 'Algorithms, complexity analysis, data structures, and edge cases.' },
    { name: 'Behavioral Prep', icon: Users, desc: 'Cultural alignment, conflict resolution, STAR framework excellence.' },
    { name: 'System Design', icon: Cpu, desc: 'High scalability, database selection, load-balancing, microservices.' },
    { name: 'Product Sense', icon: Bot, desc: 'Metric tracking, product execution framework, feature prioritizing.' },
];

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12
        }
    }
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-surface overflow-hidden text-text-primary selection:bg-brand-500/30 relative">
            {/* Ambient Background Mesh */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-900/10 filter blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-500/5 filter blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            {/* Header Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-light border-b border-white/5 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3 relative group">
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center overflow-hidden shadow-lg shadow-brand-500/20">
                            <Terminal size={18} className="text-white relative z-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            Interview<span className="text-brand-400 font-medium">Pilot</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/auth" className="text-sm font-semibold text-text-secondary hover:text-white transition-colors px-4 py-2">
                            Log in
                        </Link>
                        <Link 
                            to="/auth"
                            className="px-6 py-2.5 text-sm font-bold rounded-full bg-white text-surface hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Start Training Free <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-48 pb-20 px-6 z-10">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-5xl mx-auto text-center"
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-brand-300 text-xs font-semibold mb-8 backdrop-blur-md">
                        <Cpu size={14} className="text-brand-400 animate-spin" style={{ animationDuration: '4s' }} />
                        <span className="uppercase tracking-widest">Next-Gen AI Practice Environment</span>
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-extrabold leading-[1.05] mb-8 tracking-tighter text-white">
                        Ace Your Next
                        <br />
                        <span className="text-gradient">Tech Interview.</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
                        Pilot your prep with hyper-realistic conversational AI. Get instant structural scorecards, custom system-design scenarios, and complete performance breakdown.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10 mb-16">
                        <Link 
                            to="/auth" 
                            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-full text-lg font-bold hover:from-brand-500 hover:to-indigo-500 transition-all flex items-center justify-center shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Start Pilot Session <ArrowRight size={20} className="ml-2" />
                        </Link>
                        <Link 
                            to="/auth" 
                            className="w-full sm:w-auto px-10 py-5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all text-white font-bold flex items-center justify-center hover:scale-[1.03] active:scale-[0.98]"
                        >
                            Try Interactive Sandbox
                        </Link>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-20 text-xs text-text-secondary font-semibold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-brand-400" /> No Card Needed
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-brand-400" /> Powered by Gemini 2.5
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-brand-400" /> Real-time Speech Analysis
                        </div>
                    </motion.div>
                </motion.div>

                {/* Animated Interactive Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-28 max-w-5xl mx-auto relative hidden md:block z-20"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
                    <div className="rounded-3xl p-1 border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-2xl relative overflow-hidden backdrop-blur-md">
                        <div className="bg-surface-light rounded-2xl h-[480px] border border-white/5 flex flex-col relative overflow-hidden">
                            {/* Terminal Window Header */}
                            <div className="h-12 border-b border-white/5 px-6 flex items-center justify-between bg-surface/40">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                </div>
                                <div className="text-xs font-mono text-text-muted flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                    <Terminal size={12} /> session-sim_041.bin
                                </div>
                                <div className="w-16" />
                            </div>

                            <div className="flex-1 grid grid-cols-3">
                                {/* Left Visual Column */}
                                <div className="col-span-1 border-r border-white/5 p-8 flex flex-col items-center justify-center text-center gap-6 bg-surface/20">
                                    <div className="w-24 h-24 rounded-full border border-brand-500/20 bg-brand-500/5 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.15)] relative">
                                        <div className="absolute inset-0 rounded-full border border-brand-400/40 animate-ping" style={{ animationDuration: '3s' }} />
                                        <Mic size={36} className="text-brand-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Interviewer</h4>
                                        <p className="text-xs text-text-muted">Listening with active semantic parsing...</p>
                                    </div>
                                    <div className="flex gap-1 h-8 items-center">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <div key={i} className="wave-bar" style={{ height: '50%', animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Right Data Column */}
                                <div className="col-span-2 p-8 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Question 3 of 10 • System Design</span>
                                            <h3 className="text-xl font-semibold leading-snug text-white tracking-tight">
                                                "Design a distributed rate limiter for a global platform handling 1M+ requests per second. How would you handle consistency?"
                                            </h3>
                                        </div>
                                        <div className="p-4 rounded-xl border border-white/5 bg-white/2 font-mono text-xs text-text-secondary leading-relaxed">
                                            <span className="text-brand-400 font-bold">&gt;_ Candidate Response:</span> "I would employ a sliding window log algorithm backed by Redis Cluster. For global state synchronization, we can combine local in-memory token buckets with async batch writes to avoid strict cross-datacenter locking overhead..."
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                        <div className="flex gap-4">
                                            <div className="text-center bg-white/2 border border-white/5 px-4 py-2 rounded-xl">
                                                <p className="text-[10px] text-text-muted font-bold uppercase">Syntactic Score</p>
                                                <p className="text-sm font-bold text-brand-400">9.4 / 10</p>
                                            </div>
                                            <div className="text-center bg-white/2 border border-white/5 px-4 py-2 rounded-xl">
                                                <p className="text-[10px] text-text-muted font-bold uppercase">Time Elapsed</p>
                                                <p className="text-sm font-bold text-white">1m 14s</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-text-muted flex items-center gap-1">
                                            Interactive Live Mockup <Sparkles size={12} className="text-brand-400" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Core Specialties Section */}
            <section className="py-28 px-6 relative z-10 bg-surface-light border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">Rigorous Specialties</h2>
                            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                                Tailored modules engineered to replicate high-tier enterprise vetting standards across multiple coding and design disciplines.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {interviewTypes.map((type, idx) => {
                            const Icon = type.icon;
                            return (
                                <motion.div
                                    key={type.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                                    className="group p-8 rounded-2xl border border-white/5 hover:border-white/10 bg-surface/30 hover:bg-surface/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600/10 to-accent-500/10 border border-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon size={22} className="text-brand-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-brand-300 transition-colors">{type.name}</h3>
                                    <p className="text-xs text-text-secondary leading-relaxed">{type.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Premium Features Grid */}
            <section className="py-28 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">Full Vetting Control</h2>
                            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                                Advanced mock analytics, semantic comprehension, and adaptive follow-up questions designed to prepare you perfectly.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map(({ icon: Icon, title, desc, glow }, idx) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.08, duration: 0.6 }}
                                className={`rounded-2xl p-8 bg-surface-light/40 border border-white/5 transition-all duration-300 ${glow} hover:-translate-y-0.5`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-white/5 to-transparent border border-white/10 flex items-center justify-center mb-6">
                                    <Icon size={18} className="text-brand-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 text-white">{title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Call to Action */}
            <section className="py-28 px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="border border-white/10 bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-12 md:p-20 relative overflow-hidden backdrop-blur-md"
                    >
                        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none">Elevate Your Vetting Rank.</h2>
                            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
                                Join elite software engineers and PMs using InterviewPilot to discover structural knowledge gaps, test delivery speed, and land top-tier offers.
                            </p>
                            <Link 
                                to="/auth"
                                className="inline-block px-12 py-5 bg-white text-surface rounded-full text-lg font-bold hover:bg-white/90 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                Create Free Pilot Space
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-surface py-16 px-6 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center">
                            <Terminal size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-lg text-white">InterviewPilot</span>
                    </div>
                    <div className="text-text-muted text-xs">
                        © 2026 InterviewPilot. All rights reserved.
                    </div>
                    <div className="flex items-center gap-8 text-xs font-semibold text-text-secondary">
                        <a href="#" className="hover:text-white transition-colors">Security Protocol</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Charter</a>
                        <a href="#" className="hover:text-white transition-colors">Developer Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
