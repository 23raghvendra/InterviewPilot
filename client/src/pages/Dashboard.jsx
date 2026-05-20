import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { getStatsOverview } from '../api/user.api';
import { getHistory } from '../api/interview.api';
import Card, { CardBody } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { formatDuration, formatRelativeTime } from '../utils/formatters';
import {
    XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area
} from 'recharts';
import {
    Trophy, Flame, Target, Clock, PlayCircle, ArrowRight,
    TrendingUp, Box, Award
} from 'lucide-react';

const easeOutExpo = [0.16, 1, 0.3, 1];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, ease: easeOutExpo }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } }
};

// Simplified monochrome progress bar
function MonoProgressBar({ value }) {
    return (
        <div className="h-1.5 w-full bg-gray-900/10 rounded-full overflow-hidden mt-2">
            <div
                className="h-full bg-blue-600 transition-all duration-1000 ease-out"
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
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" className="text-gray-900" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Sessions', value: stats?.overview?.totalInterviews || user?.totalInterviews || 0, icon: Target },
        { label: 'Average Score', value: `${stats?.overview?.averageScore || user?.averageScore || 0}%`, icon: Trophy },
        { label: 'Current Streak', value: `${stats?.overview?.streak || user?.streak || 0} days`, icon: Flame },
        { label: 'Total Practice', value: formatDuration(stats?.overview?.totalDuration || 0), icon: Clock },
    ];

    return (
        <motion.div
            className="space-y-8 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Greeting */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1 tracking-tight text-gray-900">
                        Welcome back, {user?.name?.split(' ')[0] || 'there'}
                    </h1>
                    <p className="text-text-secondary text-base">Here is your interview analytics dashboard.</p>
                </div>
                <Link to="/interview/setup">
                    <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-white/5">
                        <PlayCircle size={18} className="mr-2" /> New Session
                    </button>
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(({ label, value, icon: Icon }) => (
                    <Card key={label} className="group border border-gray-200 bg-surface-light/40 backdrop-blur-sm hover:bg-gray-900/5 transition-colors">
                        <CardBody className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">{label}</p>
                                <p className="text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-gray-300 bg-surface flex items-center justify-center text-text-muted group-hover:text-gray-900 transition-colors">
                                <Icon size={18} />
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
                {/* Performance Trend */}
                <Card className="border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <CardBody>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-900">Performance Trend</h3>
                                <p className="text-sm text-text-secondary mt-1">Based on last 10 sessions</p>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-900">
                                <TrendingUp size={16} />
                            </div>
                        </div>
                        {stats?.recentScores?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={[...stats.recentScores].reverse()}>
                                    <defs>
                                        <linearGradient id="scoreGradMono" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis domain={[0, 100]} tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                                    <ReTooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '13px' }} itemStyle={{ color: '#ffffff', fontWeight: '500' }} />
                                    <Area type="monotone" dataKey="score" stroke="#0f172a" strokeWidth={2} fill="url(#scoreGradMono)" animationDuration={1000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[240px] flex flex-col items-center justify-center text-text-muted text-sm border border-dashed border-gray-300 rounded-xl">
                                <TrendingUp size={20} className="mb-2 opacity-40" />
                                <p>Complete interviews to see your trend</p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Skill Radar */}
                <Card className="border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <CardBody>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-900">Skill Breakdown</h3>
                                <p className="text-sm text-text-secondary mt-1">Aggregated assessment</p>
                            </div>
                            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-900">
                                <Award size={16} />
                            </div>
                        </div>
                        {stats?.skillBreakdown?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={240}>
                                <RadarChart outerRadius={90} data={stats.skillBreakdown.slice(0, 6)}>
                                    <PolarGrid stroke="rgba(0, 0, 0, 0.1)" strokeWidth={1} />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#888', fontSize: 11 }} />
                                    <Radar name="Score" dataKey="score" stroke="#0f172a" fill="#0f172a" fillOpacity={0.1} strokeWidth={1.5} animationDuration={1000} />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[240px] flex flex-col items-center justify-center text-text-muted text-sm border border-dashed border-gray-300 rounded-xl">
                                <Award size={20} className="mb-2 opacity-40" />
                                <p>Complete interviews to see skill breakdown</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </motion.div>

            {/* Type Distribution & Recent Sessions */}
            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
                {/* Type Distribution */}
                <Card className="border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <CardBody>
                        <h3 className="font-semibold text-gray-900 mb-6">Top Areas</h3>
                        {stats?.typeDistribution?.length > 0 ? (
                            <div className="space-y-5">
                                {stats.typeDistribution.map((t) => (
                                    <div key={t.type}>
                                        <div className="flex justify-between text-sm font-medium mb-1">
                                            <span className="capitalize text-gray-900">{t.type.replace('_', ' ')}</span>
                                            <span className="text-text-secondary">{t.count} sessions</span>
                                        </div>
                                        <MonoProgressBar value={t.avgScore} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary">No data yet</p>
                        )}
                    </CardBody>
                </Card>

                {/* Recent Sessions */}
                <Card className="lg:col-span-2 border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <CardBody>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-900">Recent Feedbacks</h3>
                            <Link to="/history" className="text-sm font-medium text-text-secondary hover:text-gray-900 flex items-center gap-1 transition-colors">
                                View History <ArrowRight size={14} />
                            </Link>
                        </div>
                        {recentInterviews.length > 0 ? (
                            <div className="space-y-3">
                                {recentInterviews.map((interview) => {
                                    const cardContent = (
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-surface hover:bg-gray-900/5 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full border border-gray-300 bg-surface-light flex items-center justify-center">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:scale-110 transition-transform">
                                                        {interview.overallScore || 0}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 capitalize mb-0.5">{interview.config?.interviewType?.replace('_', ' ')}</p>
                                                    <p className="text-xs text-text-secondary">{formatRelativeTime(interview.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="px-3 py-1 text-xs border border-gray-300 rounded-full text-text-secondary capitalize">
                                                    {interview.config?.difficulty}
                                                </div>
                                            </div>
                                        </div>
                                    );

                                    return interview.status === 'completed' && interview.reportId ? (
                                        <Link key={interview.sessionId} to={`/report/${interview.reportId}`} className="block decoration-none">
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
                            <div className="text-center py-10 rounded-xl border border-dashed border-gray-300 bg-surface/30">
                                <Box size={32} className="text-gray-900/20 mx-auto mb-4" />
                                <p className="text-text-secondary mb-5 text-sm font-medium">Your interview history is clean.</p>
                                <Link to="/interview/setup">
                                    <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                                        Launch First Interview
                                    </button>
                                </Link>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </motion.div>
        </motion.div>
    );
}
