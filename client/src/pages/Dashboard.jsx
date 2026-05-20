import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { getStatsOverview } from '../api/user.api';
import { getHistory } from '../api/interview.api';
import Card, { CardBody } from '../components/ui/Card';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { formatDuration, formatRelativeTime } from '../utils/formatters';
import {
    XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area
} from 'recharts';
import {
    Trophy, Flame, Target, Clock, PlayCircle, ArrowRight,
    TrendingUp, Box, Award, ShieldAlert, Zap
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, ease: easeOutExpo }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } }
};

function MonoProgressBar({ value }) {
    return (
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-2.5">
            <div
                className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-1000 ease-out"
                style={{ width: `${value || 0}%` }}
            />
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState(null);
    const [recentInterviews, setRecentInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [statsRes, historyRes] = await Promise.all([
                getStatsOverview().catch(() => ({ data: { data: null } })),
                getHistory(1, 5).catch(() => ({ data: { data: { interviews: [] } } }))
            ]);
            setStats(statsRes.data.data);
            setRecentInterviews(historyRes.data.data?.interviews || []);
        } catch (e) {
            console.error(e);
        } finally {
            // Keep a tiny buffer for elegant layout transition
            setTimeout(() => {
                setLoading(false);
            }, 300);
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    const statCards = [
        { label: 'Total Sessions', value: stats?.overview?.totalInterviews || user?.totalInterviews || 0, icon: Target, glow: 'group-hover:border-purple-500/30' },
        { label: 'Average Score', value: `${stats?.overview?.averageScore || user?.averageScore || 0}%`, icon: Trophy, glow: 'group-hover:border-blue-500/30' },
        { label: 'Current Streak', value: `${stats?.overview?.streak || user?.streak || 0} days`, icon: Flame, glow: 'group-hover:border-amber-500/30' },
        { label: 'Total Practice', value: formatDuration(stats?.overview?.totalDuration || 0), icon: Clock, glow: 'group-hover:border-emerald-500/30' },
    ];

    return (
        <motion.div
            className="space-y-8 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Ambient Lighting Background */}
            <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-brand-900/5 filter blur-[100px] pointer-events-none" />

            {/* Greeting Command Panel */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                        Welcome back, {user?.name?.split(' ')[0] || 'Pilot'} <Zap size={20} className="text-brand-400 animate-bounce" style={{ animationDuration: '3s' }} />
                    </h1>
                    <p className="text-text-secondary text-sm">Review your semantic proficiency scores and start a new evaluation session.</p>
                </div>
                <Link 
                    to="/interview/setup"
                    className="px-6 py-3 bg-white text-surface rounded-full text-sm font-bold hover:bg-white/90 transition-all flex items-center shadow-lg shadow-white/5 hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <PlayCircle size={18} className="mr-2" /> Launch New Flight
                </Link>
            </motion.div>

            {/* Stats Dash Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(({ label, value, icon: Icon, glow }) => (
                    <Card key={label} className={`group border border-white/5 bg-panel backdrop-blur-md transition-all duration-300 ${glow} hover:-translate-y-0.5`}>
                        <CardBody className="flex items-start justify-between p-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</p>
                                <p className="text-3xl font-extrabold tracking-tight text-white">{value}</p>
                            </div>
                            <div className="w-11 h-11 rounded-xl border border-white/5 bg-white/2 flex items-center justify-center text-text-secondary group-hover:text-brand-400 group-hover:bg-brand-500/5 group-hover:border-brand-500/15 transition-all duration-300">
                                <Icon size={20} />
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </motion.div>

            {/* Main Visuals Row */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <Card className="border border-white/5 bg-panel backdrop-blur-md">
                    <CardBody className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white tracking-tight text-lg">Performance Trend</h3>
                                <p className="text-xs text-text-secondary mt-1">Rolling evaluation score history (last 10 sessions)</p>
                            </div>
                            <div className="w-8 h-8 rounded-xl border border-white/5 bg-white/2 flex items-center justify-center text-text-secondary">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        {stats?.recentScores?.length > 0 ? (
                            <div className="pt-2">
                                <ResponsiveContainer width="100%" height={240}>
                                    <AreaChart data={[...stats.recentScores].reverse()}>
                                        <defs>
                                            <linearGradient id="scoreGradMono" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: '600' }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: '600' }} axisLine={false} tickLine={false} dx={-10} />
                                        <ReTooltip contentStyle={{ background: '#090f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '13px', color: '#fff' }} itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }} />
                                        <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#scoreGradMono)" animationDuration={1000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[240px] flex flex-col items-center justify-center text-text-muted text-sm border border-dashed border-white/5 rounded-2xl bg-white/1">
                                <TrendingUp size={24} className="mb-2 text-text-muted/30" />
                                <p className="font-medium text-xs">Run fully graded interviews to populate your timeline</p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Skill Radar */}
                <Card className="border border-white/5 bg-panel backdrop-blur-md">
                    <CardBody className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white tracking-tight text-lg">Vetting Skill Matrix</h3>
                                <p className="text-xs text-text-secondary mt-1">Aggregated semantic rating distribution</p>
                            </div>
                            <div className="w-8 h-8 rounded-xl border border-white/5 bg-white/2 flex items-center justify-center text-text-secondary">
                                <Award size={16} />
                            </div>
                        </div>
                        {stats?.skillBreakdown?.length > 0 ? (
                            <div className="flex justify-center pt-2">
                                <ResponsiveContainer width="100%" height={240}>
                                    <RadarChart outerRadius={85} data={stats.skillBreakdown.slice(0, 6)}>
                                        <PolarGrid stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1} />
                                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '600' }} />
                                        <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} animationDuration={1000} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[240px] flex flex-col items-center justify-center text-text-muted text-sm border border-dashed border-white/5 rounded-2xl bg-white/1">
                                <Award size={24} className="mb-2 text-text-muted/30" />
                                <p className="font-medium text-xs">Complete an evaluation to calculate skills metrics</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </motion.div>

            {/* Details and List Row */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
                {/* Type Distribution */}
                <Card className="border border-white/5 bg-panel backdrop-blur-md">
                    <CardBody className="p-6 space-y-6">
                        <div>
                            <h3 className="font-bold text-white tracking-tight text-lg">Top Arenas</h3>
                            <p className="text-xs text-text-secondary mt-1">Practice session distribution metrics</p>
                        </div>
                        {stats?.typeDistribution?.length > 0 ? (
                            <div className="space-y-5">
                                {stats.typeDistribution.map((t) => (
                                    <div key={t.type} className="space-y-1">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span className="capitalize text-white">{t.type.replace('_', ' ')}</span>
                                            <span className="text-text-secondary">{t.count} run{t.count > 1 ? 's' : ''}</span>
                                        </div>
                                        <MonoProgressBar value={t.avgScore} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl bg-white/1">
                                <p className="text-xs text-text-muted">No distribution data available yet</p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Recent Sessions */}
                <Card className="lg:col-span-2 border border-white/5 bg-panel backdrop-blur-md">
                    <CardBody className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white tracking-tight text-lg">Recent Session Flights</h3>
                                <p className="text-xs text-text-secondary mt-1">Your recent evaluated score reports</p>
                            </div>
                            <Link to="/history" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors uppercase tracking-wider">
                                Full History <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentInterviews.length > 0 ? (
                            <div className="space-y-3">
                                {recentInterviews.map((interview) => {
                                    const cardContent = (
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all duration-300 cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white group-hover:scale-105 group-hover:border-brand-500/20 transition-all duration-300">
                                                    <span className="text-sm font-extrabold text-brand-400">
                                                        {interview.overallScore || 0}
                                                    </span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-white capitalize text-sm">{interview.config?.interviewType?.replace('_', ' ')} Simulator</p>
                                                    <p className="text-[10px] text-text-secondary font-semibold">{formatRelativeTime(interview.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 text-[10px] font-bold border border-white/10 rounded-full text-text-secondary uppercase tracking-wider">
                                                    {interview.config?.difficulty}
                                                </div>
                                                <ArrowRight size={14} className="text-text-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                                            </div>
                                        </div>
                                    );

                                    return interview.status === 'completed' && interview.reportId ? (
                                        <Link key={interview.sessionId} to={`/report/${interview.reportId}`} className="block">
                                            {cardContent}
                                        </Link>
                                    ) : (
                                        <div key={interview.sessionId}>
                                            {cardContent}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10 rounded-2xl border border-dashed border-white/5 bg-white/1 space-y-4">
                                <ShieldAlert size={28} className="text-text-muted/30 mx-auto" />
                                <div className="space-y-1">
                                    <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Your interview ledger is empty.</p>
                                    <p className="text-[11px] text-text-muted">Launch your first session to receive your premium assessment report.</p>
                                </div>
                                <Link 
                                    to="/interview/setup" 
                                    className="inline-block pt-1 px-5 py-2.5 bg-white text-surface rounded-full text-xs font-bold hover:bg-white/90 transition-colors"
                                >
                                    Launch Simulator Now
                                </Link>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </motion.div>
        </motion.div>
    );
}
