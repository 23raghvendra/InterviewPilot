import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { registerUser, loginUser } from '../api/auth.api';
import { Box, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
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
            toast.success(isLogin ? 'Welcome back' : 'Account created');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex text-text-primary selection:bg-white/20">
            {/* Left Panel — Branding (Minimalist) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface border-r border-gray-200">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                <div className="relative z-10 flex flex-col justify-center px-20 space-y-12 w-full max-w-2xl mx-auto">
                    <Link to="/" className="flex items-center gap-3 w-fit group">
                        <div className="relative w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                            <Box size={20} className="text-surface relative z-10" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Interview<span className="text-text-secondary font-medium">Pilot</span></span>
                    </Link>

                    <div>
                        <h2 className="text-5xl font-semibold leading-[1.15] mb-6 tracking-tight text-gray-900">
                            Elevate your career with
                            <br />
                            <span className="text-text-secondary">Intelligent Prep.</span>
                        </h2>

                        <p className="text-text-secondary text-lg leading-relaxed mb-10 max-w-lg">
                            Experience the most realistic AI-driven mock interviews. Get immediate, actionable feedback to dominate your next round.
                        </p>

                        <div className="space-y-6">
                            {[
                                'Targeted technical & behavioral questions',
                                'Real-time human-like voice interactions',
                                'Deep analytical teardowns of your performance'
                            ].map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 + 0.2 }}
                                    key={i}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-all">
                                        <ArrowRight size={12} className="text-gray-900 group-hover:text-surface transition-colors" />
                                    </div>
                                    <span className="text-text-primary text-sm font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10 bg-surface">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="lg:hidden flex items-center gap-3 mb-12 justify-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                            <Box size={20} className="text-surface" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Interview<span className="text-text-secondary font-medium">Pilot</span></span>
                    </div>

                    <div className="text-center lg:text-left mb-10">
                        <h1 className="text-3xl font-semibold mb-2 tracking-tight">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h1>
                        <p className="text-text-secondary">
                            {isLogin ? 'Log in to access your interview dashboard.' : 'Sign up to master your next interview.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="text-sm font-medium text-text-primary mb-2 block">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User size={18} className="text-text-muted group-focus-within:text-gray-900 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full pl-11 pr-4 py-3 bg-surface border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="text-sm font-medium text-text-primary mb-2 block">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-text-muted group-focus-within:text-gray-900 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-surface border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-text-primary mb-2 block">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-text-muted group-focus-within:text-gray-900 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-surface border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-gray-900 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-text-secondary mt-8 text-sm">
                        {isLogin ? "Don't have an account?" : 'Already using InterviewPilot?'}{' '}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setForm({ name: '', email: '', password: '' }); }}
                            className="text-gray-900 hover:underline transition-all font-medium ml-1"
                        >
                            {isLogin ? 'Sign up free' : 'Sign in'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
