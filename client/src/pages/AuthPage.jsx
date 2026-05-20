import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { registerUser, loginUser } from '../api/auth.api';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Terminal, Cpu, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password || (!isLogin && !form.name)) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const { data } = isLogin
                ? await loginUser({ email: form.email, password: form.password })
                : await registerUser(form);

            login(data.data.user, data.data.accessToken);
            toast.success(isLogin ? 'Welcome back, Pilot!' : 'Account initialized successfully');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex text-text-primary selection:bg-brand-500/30 relative overflow-hidden">
            {/* Ambient Background Mesh */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-900/10 filter blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-500/10 filter blur-[120px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            </div>

            {/* Left Panel — Interactive Decorative Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-light/40 border-r border-white/5 z-10 justify-center items-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                
                <div className="relative z-10 flex flex-col justify-center px-16 space-y-12 w-full max-w-xl mx-auto">
                    <Link to="/" className="flex items-center gap-3 w-fit group">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center overflow-hidden shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                            <Terminal size={20} className="text-white relative z-10" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Interview<span className="text-brand-400 font-medium">Pilot</span></span>
                    </Link>

                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-white">
                            Verify Your Identity &
                            <br />
                            <span className="text-gradient">Launch Your Session.</span>
                        </h2>

                        <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-md">
                            Connect your profile, adjust interview metrics, and test your response speed in an AI-driven, high-stakes conversational simulator.
                        </p>

                        {/* Interactive Voice Radar Animation */}
                        <div className="p-6 rounded-2xl glass border border-white/5 bg-gradient-to-r from-brand-500/5 to-transparent flex items-center justify-between gap-6">
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400 flex items-center gap-1.5">
                                    <Cpu size={12} className="animate-pulse" /> Cognitive Audio Parser
                                </span>
                                <p className="text-xs font-medium text-white">Awaiting voice activation...</p>
                            </div>
                            <div className="flex gap-1 h-6 items-center">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="wave-bar h-full bg-brand-400/80" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            {[
                                'Fully compliant with standard grading schema',
                                'Zero cold starts — dynamic prompt compiling',
                                'Robust security with complete encryption layer'
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.12 + 0.3 }}
                                    key={i}
                                    className="flex items-center gap-3.5 group"
                                >
                                    <div className="w-5 h-5 rounded-full border border-white/10 bg-white/2 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all">
                                        <ArrowRight size={10} className="text-brand-400" />
                                    </div>
                                    <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Interactive Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10 bg-surface">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center">
                            <Terminal size={18} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Interview<span className="text-brand-400 font-medium">Pilot</span></span>
                    </div>

                    <div className="text-center lg:text-left mb-10 space-y-2">
                        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 justify-center lg:justify-start">
                            {isLogin ? 'Welcome back' : 'Initialize Account'} <Sparkles size={18} className="text-brand-400" />
                        </h1>
                        <p className="text-text-secondary text-sm">
                            {isLogin ? 'Log in to access your interview command deck.' : 'Create a private, encrypted practice space.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User size={16} className="text-text-muted group-focus-within:text-brand-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full pl-11 pr-4 py-3 bg-surface-light/40 border border-white/5 hover:border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-all duration-300"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-text-muted group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-surface-light/40 border border-white/5 hover:border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Secret Key Phrase / Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock size={16} className="text-text-muted group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-surface-light/40 border border-white/5 hover:border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center disabled:opacity-75 disabled:scale-100 disabled:pointer-events-none shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    <span className="flex items-center gap-1.5">{isLogin ? 'Sign In Security Profile' : 'Complete Registration'} <ArrowRight size={14} /></span>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-text-secondary mt-8 text-xs font-semibold uppercase tracking-wider">
                        {isLogin ? "No authorization protocol?" : 'Key configured?'}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setForm({ name: '', email: '', password: '' }); }}
                            className="text-brand-400 hover:underline transition-all ml-1.5 font-bold"
                        >
                            {isLogin ? 'Generate New Key' : 'Initiate Secure Login'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
