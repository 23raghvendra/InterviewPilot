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
        glow: 'hover:border-brand-500/50'
    },
    { 
        icon: Mic, 
        title: 'Immersive Voice Synthesis', 
        desc: 'Interact naturally with our ultra-low latency conversational engine. Simulates the natural flow, interruptions, and pacing of real face-to-face interviews.',
        glow: 'hover:border-brand-500/50'
    },
    { 
        icon: BarChart3, 
        title: 'Granular Analytics Stack', 
        desc: 'Receive exhaustive analytical score sheets mapping your strengths, vocabulary quality, architectural logic, and semantic alignment.',
        glow: 'hover:border-brand-500/50'
    },
    { 
        icon: Sparkles, 
        title: 'Deep Feedback Loops', 
        desc: 'Instant, actionable bullet points showing the exact key concepts you covered, crucial edge cases you missed, and a model ideal answer.',
        glow: 'hover:border-brand-500/50'
    },
    { 
        icon: Clock, 
        title: 'Time-Boxed Stress Simulation', 
        desc: 'Recreate high-pressure environment limits with adaptive timers. Build mental resilience, clear pacing habits, and robust crisis communication.',
        glow: 'hover:border-brand-500/50'
    },
    { 
        icon: Shield, 
        title: 'Secure & Cryptographic', 
        desc: 'All evaluations, custom configurations, and analytical reports are locked in your private space, fully encrypted and visible only to you.',
        glow: 'hover:border-brand-500/50'
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
                <div className="absolute top-[-20%] left-[10%] w-[80%] h-[60%] rounded-full bg-brand-600/10 filter blur-[150px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
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
            <section className="relative pt-32 lg:pt-48 pb-20 px-6 z-10 min-h-screen flex items-center">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Copy Column */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-left"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-text-secondary text-xs font-semibold mb-8 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                            <span className="uppercase tracking-widest text-white">Interview Engine v2.0 Live</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-white">
                            Master the Technical
                            <br />
                            <span className="text-brand-400">Interview.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-secondary max-w-xl mb-10 leading-relaxed">
                            Train with an adaptive, low-latency AI interviewer. Run system design architectures, live coding simulations, and behavioral frameworks with instant enterprise-grade feedback.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 mb-12">
                            <Link 
                                to="/auth" 
                                className="w-full sm:w-auto px-8 py-4 bg-white text-surface rounded-xl text-sm font-bold hover:bg-white/90 transition-all flex items-center justify-center shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Launch Session <ArrowRight size={16} className="ml-2" />
                            </Link>
                            <Link 
                                to="/auth" 
                                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/15 hover:border-white/30 bg-surface text-white text-sm font-bold flex items-center justify-center hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                View Demo
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-text-muted font-medium">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-brand-500" /> Real-time Speech Analysis
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-brand-500" /> Custom Architecture Prompts
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Interactive Mockup Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative hidden lg:block w-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 to-transparent rounded-3xl blur-3xl z-0" />
                        <div className="rounded-3xl p-1 border border-white/10 bg-surface-light shadow-2xl relative overflow-hidden backdrop-blur-md z-10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                            <div className="bg-surface rounded-2xl border border-white/5 flex flex-col relative overflow-hidden h-[500px]">
                                {/* Terminal Window Header */}
                                <div className="h-10 border-b border-white/5 px-4 flex items-center justify-between bg-surface-light/50">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-rose-500 transition-colors cursor-pointer" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-amber-500 transition-colors cursor-pointer" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-emerald-500 transition-colors cursor-pointer" />
                                    </div>
                                    <div className="text-[10px] font-mono text-text-muted flex items-center gap-2 uppercase tracking-widest">
                                        <Terminal size={10} /> session-sim_041
                                    </div>
                                    <div className="w-12" />
                                </div>

                                <div className="flex-1 flex flex-col">
                                    {/* Top Interactive HUD */}
                                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-light/30">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative">
                                                <div className="absolute inset-0 rounded-full border border-brand-500/40 animate-ping" style={{ animationDuration: '3s' }} />
                                                <Mic size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-widest">AI Core Active</h4>
                                                <div className="flex gap-0.5 mt-2 h-4 items-center">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                                        <div key={i} className="w-[2px] bg-brand-400" style={{ height: `${Math.max(20, Math.random() * 100)}%`, animation: `voice-wave 1s ease-in-out infinite`, animationDelay: `${i * 0.05}s` }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Elapsed Time</div>
                                            <div className="font-mono text-sm text-white">04:12.8s</div>
                                        </div>
                                    </div>

                                    {/* Console Feed */}
                                    <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5"><Bot size={12}/> AI Prompt</span>
                                            <h3 className="text-sm font-medium leading-relaxed text-white tracking-tight border-l-2 border-brand-500 pl-3">
                                                "Let's shift focus to high availability. If the Redis Cluster experiences a network partition across availability zones, how does your sliding window rate limiter maintain strong consistency without severely degrading P99 latency?"
                                            </h3>
                                        </div>
                                        
                                        <div className="bg-surface-light/50 rounded-xl p-4 border border-white/5 mt-auto">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><Mic size={10}/> User Transcribing...</span>
                                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-mono">LIVE</span>
                                            </div>
                                            <p className="text-sm text-text-secondary leading-relaxed font-mono">
                                                "Well, strict consistency here would violate the CAP theorem for availability. Instead of strict locking, I would implement an eventual consistency model using CRDTs or simply fall back to local token buckets during the partition, accepting a temporary drift in global rate limits to preserve latency..."<span className="inline-block w-2 h-3 bg-white ml-1 animate-pulse" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
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
