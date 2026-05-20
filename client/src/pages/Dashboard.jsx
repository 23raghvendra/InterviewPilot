import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { getStatsOverview } from '../api/user.api';
import { getHistory } from '../api/interview.api';
import Card, { CardBody } from '../components/ui/Card';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { formatDuration, formatRelativeTime } from '../utils/formatters';
import { subDays, format, startOfDay } from 'date-fns';
import {
    XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area
} from 'recharts';
import {
    Trophy, Flame, Target, Clock, PlayCircle, ArrowRight,
    TrendingUp, Box, Award, ShieldAlert, Zap, Activity
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
                className="h-full bg-brand-500 transition-all duration-1000 ease-out"
                style={{ width: `${value || 0}%` }}
            />
        </div>
    );
}

function ActivityHeatmap({ scores }) {
    // Generate last 84 days (12 weeks)
    const days = Array.from({ length: 84 }).map((_, i) => {
        const d = subDays(new Date(), 83 - i);
        return startOfDay(d);
    });

    const scoresMap = new Map();
    if (scores && Array.isArray(scores)) {
        scores.forEach(s => {
            scoresMap.set(startOfDay(new Date(s.date)).getTime(), s.score);
        });
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-[3px]">
                {days.map(d => {
                    const timestamp = d.getTime();
                    const score = scoresMap.get(timestamp);
                    let colorClass = 'bg-white/5 border-white/5';
                    if (score >= 90) colorClass = 'bg-brand-500 border-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]';
                    else if (score >= 70) colorClass = 'bg-brand-500/80 border-brand-500/80';
                    else if (score >= 50) colorClass = 'bg-brand-500/50 border-brand-500/50';
                    else if (score > 0) colorClass = 'bg-brand-500/30 border-brand-500/30';

                    return (
                        <div 
                            key={timestamp} 
                            className={`w-[14px] h-[14px] rounded-[3px] border ${colorClass} transition-colors hover:border-white`}
                            title={`${format(d, 'MMM d, yyyy')}: ${score ? score + ' score' : 'No activity'}`}
                        />
                    );
                })}
            </div>
            <div className="flex items-center justify-end gap-2 text-[9px] text-text-muted font-medium uppercase tracking-widest mt-2">
                <span>Less</span>
                <div className="flex gap-[3px]">
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-white/5" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-brand-500/30" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-brand-500/50" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-brand-500/80" />
                    <div className="w-[10px] h-[10px] rounded-[2px] bg-brand-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
                </div>
                <span>More</span>
            </div>
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

    const getRank = (score) => {
        if (score >= 90) return { title: 'Elite Pilot', color: 'text-brand-400' };
        if (score >= 75) return { title: 'Senior Pilot', color: 'text-emerald-400' };
        if (score >= 50) return { title: 'Junior Pilot', color: 'text-amber-400' };
        return { title: 'Cadet', color: 'text-text-secondary' };
    };

    const avgScore = stats?.overview?.averageScore || user?.averageScore || 0;
    const rank = getRank(avgScore);

    const statCards = [
        { label: 'Total Sessions', value: stats?.overview?.totalInterviews || user?.totalInterviews || 0, icon: Target, glow: 'group-hover:border-brand-500/30' },
        { label: 'Average Score', value: `${avgScore}%`, icon: Trophy, glow: 'group-hover:border-brand-500/30' },
        { label: 'Current Streak', value: `${stats?.overview?.streak || user?.streak || 0} days`, icon: Flame, glow: 'group-hover:border-brand-500/30' },
        { label: 'Total Practice', value: formatDuration(stats?.overview?.totalDuration || 0), icon: Clock, glow: 'group-hover:border-brand-500/30' },
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
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                            Welcome back, {user?.name?.split(' ')[0] || 'Pilot'} <Zap size={20} className="text-brand-400 animate-bounce" style={{ animationDuration: '3s' }} />
                        </h1>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 ${rank.color}`}>
                            {rank.title}
                        </span>
                    </div>
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

            {/* Main Visuals Row - HUD Style */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
                {/* Skill Radar - Moved to left and made larger like a real radar */}
                <Card className="border border-white/5 bg-panel backdrop-blur-md lg:col-span-1 flex flex-col">
                    <CardBody className="p-6 space-y-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white tracking-tight text-lg flex items-center gap-2">
                                    <Target size={18} className="text-brand-400" /> Matrix Scanner
                                </h3>
                            </div>
                        </div>
                        {stats?.skillBreakdown?.length > 0 ? (
                            <div className="flex-1 flex items-center justify-center relative">
                                {/* Radar pulse effect */}
                                <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-ping" style={{ animationDuration: '4s' }} />
                                <ResponsiveContainer width="100%" height={280}>
                                    <RadarChart outerRadius={90} data={stats.skillBreakdown.slice(0, 6)}>
                                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" strokeWidth={1} />
                                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: '500' }} />
                                        <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} animationDuration={1500} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-sm border border-dashed border-white/5 rounded-2xl bg-white/1 mt-4 p-8 text-center">
                                <Target size={32} className="mb-3 text-text-muted/30" />
                                <p className="font-medium text-xs text-white">Radar Offline</p>
                                <p className="text-[10px] mt-1">Complete an evaluation to calculate metrics</p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Performance Trend */}
                <Card className="border border-white/5 bg-panel backdrop-blur-md lg:col-span-2 flex flex-col">
                    <CardBody className="p-6 space-y-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white tracking-tight text-lg flex items-center gap-2">
                                    <TrendingUp size={18} className="text-brand-400" /> Flight Trajectory
                                </h3>
                            </div>
                            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-white/5 text-text-secondary border border-white/10">
                                Last 10 Sessions
                            </div>
                        </div>
                        {stats?.recentScores?.length > 0 ? (
                            <div className="flex-1 flex items-end">
                                <ResponsiveContainer width="100%" height={280}>
                                    <AreaChart data={[...stats.recentScores].reverse()}>
                                        <defs>
                                            <linearGradient id="scoreGradMono" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} tick={{ fill: '#71717a', fontSize: 10, fontWeight: '500' }} axisLine={false} tickLine={false} dy={10} />
                                        <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10, fontWeight: '500' }} axisLine={false} tickLine={false} dx={-10} />
                                        <ReTooltip contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '13px', color: '#fff' }} itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }} />
                                        <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="url(#scoreGradMono)" animationDuration={1500} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-sm border border-dashed border-white/5 rounded-2xl bg-white/1 mt-4 p-8 text-center">
                                <TrendingUp size={32} className="mb-3 text-text-muted/30" />
                                <p className="font-medium text-xs text-white">Trajectory Offline</p>
                                <p className="text-[10px] mt-1">Run fully graded interviews to chart timeline</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </motion.div>

            {/* Details and List Row */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
                {/* Activity Heatmap */}
                <Card className="border border-white/5 bg-panel backdrop-blur-md">
                    <CardBody className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white tracking-tight text-lg flex items-center gap-2">
                                    <Activity size={18} className="text-brand-400" /> Operational Consistency
                                </h3>
                                <p className="text-xs text-text-secondary mt-1">12-week activity ledger</p>
                            </div>
                        </div>
                        <div className="pt-2">
                            <ActivityHeatmap scores={stats?.recentScores} />
                        </div>
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
