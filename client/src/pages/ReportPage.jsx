import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReport } from '../api/user.api';
import { FullPageSpinner } from '../components/ui/Spinner';
import { formatDate } from '../utils/formatters';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, Cell
} from 'recharts';
import {
    Target, CheckCircle, XCircle, BarChart3,
    Lightbulb, TrendingUp, PlayCircle, Award
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
            setLoading(false);
        }
    };

    if (loading) return <FullPageSpinner />;
    if (!report) return <div className="text-center py-20 text-text-muted">Report not found</div>;

    const summary = report.summary;
    const score = summary?.overallScore || 0;

    // Monochrome color palette for charts
    const barColors = ['#0f172a', '#334155', '#cbd5e1', '#94a3b8', '#94a3b8', '#cbd5e1'];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Interview Report</h1>
                    <p className="text-text-secondary text-sm">{formatDate(report.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/interview/setup">
                        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <PlayCircle size={16} /> Practice Again
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button className="px-5 py-2.5 border border-gray-400 text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-900/10 transition-colors">
                            Dashboard
                        </button>
                    </Link>
                </div>
            </div>

            {/* Score Hero */}
            <div className="p-8 rounded-3xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                <div className="flex justify-center mb-8">
                    {/* Minimalist Score Circle */}
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-900/10" />
                            <circle
                                cx="50" cy="50" r="45" fill="none" strokeWidth="4"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
                                strokeLinecap="round"
                                className="stroke-blue-600"
                                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-gray-900 tracking-tighter">
                                {score}<span className="text-xl text-text-muted font-medium">%</span>
                            </span>
                            <span className="text-sm font-bold tracking-wider text-text-secondary mt-1 uppercase">
                                {summary?.grade || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-200 pt-8">
                    <div className="p-4 rounded-2xl border border-gray-200 bg-surface text-center">
                        <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wide">Status</p>
                        <p className="text-sm font-bold text-gray-900">{summary?.readinessLevel?.replace('_', ' ') || 'Unknown'}</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-gray-200 bg-surface text-center">
                        <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wide">Answered</p>
                        <p className="text-xl font-bold text-gray-900">{summary?.answered || 0}</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-gray-200 bg-surface text-center">
                        <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wide">Skipped</p>
                        <p className="text-xl font-bold text-text-secondary">{summary?.skipped || 0}</p>
                    </div>
                    <div className="p-4 rounded-2xl border border-gray-200 bg-surface text-center">
                        <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wide">Total</p>
                        <p className="text-xl font-bold text-gray-900">{summary?.totalQuestions || 0}</p>
                    </div>
                </div>
                {report.peerComparison?.percentile && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-text-secondary">
                            You scored better than <span className="text-gray-900 font-bold">{report.peerComparison.percentile}%</span> of peers
                        </p>
                    </div>
                )}
            </div>

            {/* Recommendation */}
            {summary?.recommendation && (
                <div className="p-6 rounded-2xl border border-gray-300 bg-gray-900/5 backdrop-blur-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl border border-gray-300 bg-surface flex items-center justify-center flex-shrink-0">
                        <Award size={24} className="text-gray-900" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 tracking-tight mb-2 uppercase text-sm">Actionable Recommendation</h3>
                        <p className="text-[15px] text-text-secondary leading-relaxed">{summary.recommendation}</p>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Skill Breakdown Radar */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                        <Target size={18} className="text-gray-900" /> Skill Overview
                    </h3>
                    {report.skillBreakdown?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <RadarChart data={report.skillBreakdown} outerRadius="80%">
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Radar name="Score" dataKey="score" stroke="#0f172a" fill="#0f172a" fillOpacity={0.15} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-text-muted text-center py-12">No skill data available</p>
                    )}
                </div>

                {/* Skill Bar Chart */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                        <BarChart3 size={18} className="text-gray-900" /> Domain Proficiency
                    </h3>
                    {report.skillBreakdown?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={report.skillBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="skill" type="category" width={100} tick={{ fill: '#334155', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <ReTooltip
                                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12, color: '#ffffff' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                                    {report.skillBreakdown.map((_, i) => (
                                        <Cell key={i} fill={barColors[i % barColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-text-muted text-center py-12">No skill data available</p>
                    )}
                </div>
            </div>

            {/* Strong & Weak Areas */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-bold text-gray-900 tracking-tight mb-5 flex items-center gap-2 uppercase text-sm">
                        <CheckCircle size={16} className="text-gray-900" /> Demonstrated Strengths
                    </h3>
                    {summary?.strongAreas?.length > 0 ? (
                        <ul className="space-y-3">
                            {summary.strongAreas.map((area, i) => (
                                <li key={i} className="flex items-start gap-3 text-[15px] text-text-secondary leading-relaxed">
                                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-600 flex-shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]" />
                                    {area}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-text-muted">No data</p>
                    )}
                </div>

                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-bold text-text-secondary tracking-tight mb-5 flex items-center gap-2 uppercase text-sm">
                        <XCircle size={16} className="text-text-muted" /> Identified Weaknesses
                    </h3>
                    {summary?.weakAreas?.length > 0 ? (
                        <ul className="space-y-3">
                            {summary.weakAreas.map((area, i) => (
                                <li key={i} className="flex items-start gap-3 text-[15px] text-text-muted leading-relaxed">
                                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-gray-500 flex-shrink-0" />
                                    {area}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-text-muted">No data</p>
                    )}
                </div>
            </div>

            {/* Improvement Plan */}
            {report.improvementPlan?.length > 0 && (
                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-gray-900" /> Actionable Improvement Plan
                    </h3>
                    <div className="space-y-4">
                        {report.improvementPlan.map((item, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl border border-gray-200 bg-surface hover:border-gray-300 transition-colors">
                                <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${item.priority === 'high' ? 'border-white bg-blue-600 text-white' : 'border-gray-400 text-gray-900'}`}>
                                    {item.priority} Priority
                                </span>
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-gray-900 mb-2">{item.topic}</p>
                                    <p className="text-sm text-text-secondary leading-relaxed">{item.tip}</p>
                                    {item.resources?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {item.resources.map((r, j) => (
                                                <span key={j} className="text-xs px-2.5 py-1 rounded bg-gray-900/5 border border-gray-200 text-text-muted">{r}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Insights */}
            {report.aiGeneratedInsights && (
                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-bold text-gray-900 tracking-tight mb-4 flex items-center gap-2 text-sm uppercase">
                        <Lightbulb size={16} className="text-gray-900" /> Qualitative Insights
                    </h3>
                    <p className="text-[15px] text-text-secondary leading-relaxed pl-6 border-l-2 border-gray-400">{report.aiGeneratedInsights}</p>
                </div>
            )}

            {/* Question-by-Question Review */}
            {interview?.questions?.length > 0 && (
                <div className="pt-6">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Detailed Response Analysis</h3>
                    <div className="space-y-4">
                        {interview.questions.map((q, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-900 bg-gray-900/10 px-2 py-1 rounded">Q{i + 1}</span>
                                            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider border border-gray-300 px-2 py-1 rounded">{q.topic}</span>
                                            {q.skipped && <span className="text-xs font-bold text-gray-400 uppercase tracking-wider border border-gray-200 bg-gray-900/5 px-2 py-1 rounded">Skipped</span>}
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">{q.questionText}</p>

                                        {q.userAnswer && (
                                            <div className="pt-3">
                                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Transcript</p>
                                                <p className="text-[15px] text-text-secondary leading-relaxed bg-surface p-4 rounded-xl border border-gray-200">
                                                    {q.userAnswer}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {q.aiFeedback?.score !== undefined && (
                                        <div className="md:w-32 flex-shrink-0 flex flex-col items-center justify-start pt-2">
                                            <div className="text-3xl font-bold text-gray-900 tracking-tighter">
                                                {q.aiFeedback.score}<span className="text-sm text-text-muted font-normal">/10</span>
                                            </div>
                                            <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">Score</div>
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
