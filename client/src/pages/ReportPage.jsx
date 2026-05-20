import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReport } from '../api/user.api';
import { ReportSkeleton } from '../components/ui/Skeleton';
import { formatDate } from '../utils/formatters';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, Cell
} from 'recharts';
import {
    Target, CheckCircle, XCircle, BarChart3,
    Lightbulb, TrendingUp, PlayCircle, Award, Terminal, Calendar, Activity, Zap
} from 'lucide-react';

export default function ReportPage() {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, [reportId]);

    const loadReport = async () => {
        try {
            const { data } = await getReport(reportId);
            setReport(data.data.report);
            setInterview(data.data.report.interviewId);
        } catch {
            // handle error
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 300);
        }
    };

    if (loading) return <ReportSkeleton />;
    if (!report) return <div className="text-center py-20 text-text-muted font-bold uppercase tracking-widest">Assessment Report Not Found</div>;

    const summary = report.summary;
    const score = summary?.overallScore || 0;

    // Premium glowing colors for charts
    const barColors = ['#8b5cf6', '#a78bfa', '#3b82f6', '#60a5fa', '#6366f1', '#c4b5fd'];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header control board */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                        Vetting Report <Terminal size={18} className="text-brand-400" />
                    </h1>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} /> Compiled {formatDate(report.createdAt)}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/interview/setup">
                        <button className="px-5 py-2.5 bg-white hover:bg-white/90 text-surface rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-white/5 cursor-pointer">
                            <PlayCircle size={14} /> Practice Again
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-text-secondary hover:text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/4 transition-all cursor-pointer">
                            Dashboard deck
                        </button>
                    </Link>
                </div>
            </div>

            {/* Score Hero - Circular Grade Dial */}
            <div className="p-8 rounded-3xl border border-white/5 bg-panel backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand-500/5 filter blur-3xl pointer-events-none" />
                
                <div className="flex justify-center mb-8">
                    {/* Glowing Score Radial */}
                    <div className="relative w-44 h-44 drop-shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                            <circle
                                cx="50" cy="50" r="44" fill="none" strokeWidth="6"
                                strokeDasharray={`${2 * Math.PI * 44}`}
                                strokeDashoffset={`${2 * Math.PI * 44 * (1 - score / 100)}`}
                                strokeLinecap="round"
                                className="stroke-brand-500"
                                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-white tracking-tighter">
                                {score}<span className="text-lg text-text-muted font-normal">%</span>
                            </span>
                            <span className="text-xs font-bold tracking-widest text-brand-400 mt-1 uppercase">
                                Grade {summary?.grade || 'C'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sub Score Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-8">
                    <div className="p-4 rounded-2xl border border-white/5 bg-white/2 text-center space-y-1">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Readiness Rank</p>
                        <p className="text-xs font-bold text-white capitalize">{summary?.readinessLevel?.replace('_', ' ') || 'Needs Work'}</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-white/5 bg-white/2 text-center space-y-1">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Answered</p>
                        <p className="text-base font-bold text-emerald-400">{summary?.answered || 0}</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-white/5 bg-white/2 text-center space-y-1">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Skipped</p>
                        <p className="text-base font-bold text-rose-400">{summary?.skipped || 0}</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-white/5 bg-white/2 text-center space-y-1">
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total Questions</p>
                        <p className="text-base font-bold text-white">{summary?.totalQuestions || 0}</p>
                    </div>
                </div>
                {report.peerComparison?.percentile && (
                    <div className="mt-6 text-center">
                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                            Performance percentile: <span className="text-brand-400 font-bold">{report.peerComparison.percentile}%</span> of peer candidates
                        </p>
                    </div>
                )}
            </div>

            {/* Recommendation card */}
            {summary?.recommendation && (
                <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-r from-brand-500/5 to-transparent backdrop-blur-md flex items-start gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                    <div className="w-12 h-12 rounded-xl border border-brand-500/10 bg-brand-500/5 flex items-center justify-center flex-shrink-0">
                        <Award size={22} className="text-brand-400" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-extrabold text-white tracking-tight uppercase text-xs tracking-wider text-brand-300">Actionable Assessment Recommendation</h3>
                        <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-semibold">{summary.recommendation}</p>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Skill Breakdown Radar */}
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md">
                    <h3 className="font-bold text-white tracking-tight mb-6 flex items-center gap-2 text-sm uppercase tracking-wider text-brand-300">
                        <Target size={16} className="text-brand-400" /> Core Skill Breakdown
                    </h3>
                    {report.skillBreakdown?.length > 0 ? (
                        <div className="flex justify-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <RadarChart data={report.skillBreakdown} outerRadius="75%">
                                    <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: '600' }} />
                                    <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-xs text-text-muted text-center py-16">No skill criteria available</p>
                    )}
                </div>

                {/* Skill Bar Chart */}
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md">
                    <h3 className="font-bold text-white tracking-tight mb-6 flex items-center gap-2 text-sm uppercase tracking-wider text-brand-300">
                        <BarChart3 size={16} className="text-brand-400" /> Domain Proficiency
                    </h3>
                    {report.skillBreakdown?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={report.skillBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="skill" type="category" width={100} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '600' }} axisLine={false} tickLine={false} />
                                <ReTooltip
                                    contentStyle={{ background: '#090f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12, color: '#ffffff' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                                    {report.skillBreakdown.map((_, i) => (
                                        <Cell key={i} fill={barColors[i % barColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-xs text-text-muted text-center py-16">No skill criteria available</p>
                    )}
                </div>
            </div>

            {/* Strengths & Areas of Concern Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/2 space-y-4">
                    <h3 className="font-bold text-emerald-400 tracking-tight flex items-center gap-2 uppercase text-xs tracking-wider">
                        <CheckCircle size={14} /> Demonstrated Strengths
                    </h3>
                    {summary?.strongAreas?.length > 0 ? (
                        <ul className="space-y-3">
                            {summary.strongAreas.map((area, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-text-secondary leading-relaxed font-semibold">
                                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                    {area}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-text-muted">No assessment data available</p>
                    )}
                </div>

                <div className="p-6 rounded-2xl border border-rose-500/10 bg-rose-500/2 space-y-4">
                    <h3 className="font-bold text-rose-400 tracking-tight flex items-center gap-2 uppercase text-xs tracking-wider">
                        <XCircle size={14} /> Identified Concerns
                    </h3>
                    {summary?.weakAreas?.length > 0 ? (
                        <ul className="space-y-3">
                            {summary.weakAreas.map((area, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-text-secondary leading-relaxed font-semibold">
                                    <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                                    {area}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-text-muted">No assessment data available</p>
                    )}
                </div>
            </div>

            {/* Actionable Improvement Plan timeline cards */}
            {report.improvementPlan?.length > 0 && (
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-6">
                    <h3 className="font-bold text-white tracking-tight flex items-center gap-2 text-sm uppercase tracking-wider text-brand-300">
                        <TrendingUp size={16} className="text-brand-400" /> Actionable Curated Flight Plan
                    </h3>
                    <div className="space-y-4">
                        {report.improvementPlan.map((item, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-colors">
                                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg border ${item.priority === 'high' ? 'border-rose-500/20 bg-rose-500/10 text-rose-400' : 'border-white/10 bg-white/5 text-text-secondary'}`}>
                                    {item.priority} Priority
                                </span>
                                <div className="flex-1 space-y-1.5">
                                    <p className="text-sm font-bold text-white leading-snug">{item.topic}</p>
                                    <p className="text-xs text-text-secondary leading-relaxed font-medium">{item.tip}</p>
                                    {item.resources?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {item.resources.map((r, j) => (
                                                <span key={j} className="text-[10px] px-2.5 py-1 rounded-lg bg-brand-500/5 border border-brand-500/10 text-brand-400 font-semibold">{r}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Qualitative Insights paragraph */}
            {report.aiGeneratedInsights && (
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-4">
                    <h3 className="font-bold text-white tracking-tight flex items-center gap-2 text-xs uppercase tracking-wider text-brand-300">
                        <Lightbulb size={16} className="text-brand-400" /> Qualitative AI Synthesis
                    </h3>
                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed pl-6 border-l-2 border-brand-500 font-medium">{report.aiGeneratedInsights}</p>
                </div>
            )}

            {/* Detailed Question Review List */}
            {interview?.questions?.length > 0 && (
                <div className="pt-6 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        Response Analysis Ledger <Activity size={18} className="text-brand-400 animate-pulse" />
                    </h3>
                    <div className="space-y-4">
                        {interview.questions.map((q, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-6">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-lg">PROMPT {i + 1}</span>
                                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider border border-white/10 bg-white/2 px-2.5 py-1 rounded-lg">{q.topic}</span>
                                            {q.skipped && <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider border border-rose-500/10 bg-rose-500/5 px-2.5 py-1 rounded-lg">Skipped</span>}
                                        </div>
                                        <p className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">{q.questionText}</p>

                                        {q.userAnswer && (
                                            <div className="space-y-2 pt-2">
                                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Transcript Submission</p>
                                                <p className="text-xs md:text-sm text-text-secondary leading-relaxed bg-white/2 p-4 rounded-xl border border-white/5 font-semibold">
                                                    {q.userAnswer}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {q.aiFeedback?.score !== undefined && (
                                        <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 bg-white/2">
                                            <div className="text-3xl font-extrabold text-white tracking-tighter">
                                                {q.aiFeedback.score}<span className="text-sm text-text-muted font-normal">/10</span>
                                            </div>
                                            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">Prompt Score</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
