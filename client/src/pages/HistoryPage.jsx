import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deleteInterview } from '../api/interview.api';
import { HistorySkeleton } from '../components/ui/Skeleton';
import { formatDuration, formatRelativeTime } from '../utils/formatters';
import { History as HistoryIcon, Trash2, ChevronLeft, ChevronRight, Box, Terminal, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryPage() {
    const [interviews, setInterviews] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory(1);
    }, []);

    const loadHistory = async (page) => {
        setLoading(true);
        try {
            const { data } = await getHistory(page, 10);
            setInterviews(data.data.interviews || []);
            setPagination(data.data.pagination || { page: 1, pages: 1, total: 0 });
        } catch {
            toast.error('Failed to load history');
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 300);
        }
    };

    const handleDelete = async (sessionId) => {
        if (!confirm('Delete this interview session?')) return;
        try {
            await deleteInterview(sessionId);
            setInterviews(prev => prev.filter(i => i.sessionId !== sessionId));
            toast.success('Interview deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="w-12 h-12 rounded-xl border border-brand-500/20 bg-brand-500/5 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                    <HistoryIcon size={22} className="text-brand-400" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Interview History</h1>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> {pagination.total} total sessions</p>
                </div>
            </div>

            {loading ? (
                <HistorySkeleton />
            ) : interviews.length === 0 ? (
                <div className="text-center py-20 rounded-3xl border border-dashed border-white/10 bg-white/1 space-y-6">
                    <Box size={44} className="text-text-muted/30 mx-auto" />
                    <div className="space-y-1">
                        <p className="text-sm text-text-secondary font-bold uppercase tracking-wider">No interview history yet.</p>
                        <p className="text-xs text-text-muted">Start your first AI-powered evaluation flight to build up your ledger.</p>
                    </div>
                    <Link to="/interview/setup" className="inline-block">
                        <button className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:from-brand-500 hover:to-indigo-500 transition-colors">
                            Start first session
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {interviews.map((interview) => (
                        <div key={interview.sessionId} className="p-5 rounded-2xl border border-white/5 bg-panel backdrop-blur-md hover:bg-white/4 hover:border-white/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden">
                            <div className="flex items-center gap-5 flex-1">
                                <div className="w-14 h-14 rounded-full border border-white/10 bg-white/3 flex items-center justify-center text-white group-hover:scale-105 group-hover:border-brand-500/20 transition-all duration-300">
                                    <span className="text-lg font-extrabold text-brand-400">
                                        {interview.overallScore || 0}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="font-bold text-white capitalize text-base tracking-tight group-hover:text-brand-300 transition-colors">
                                        {interview.config?.interviewType?.replace('_', ' ')} Interview
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-text-secondary">
                                        <span>{formatRelativeTime(interview.createdAt)}</span>
                                        {interview.duration && (
                                            <>
                                                <span>•</span>
                                                <span>{formatDuration(interview.duration)}</span>
                                            </>
                                        )}
                                        {interview.config?.domain && (
                                            <>
                                                <span>•</span>
                                                <span className="text-brand-400">{interview.config.domain}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-xl text-[10px] font-bold border border-white/10 bg-white/2 text-text-secondary uppercase tracking-wider">
                                        {interview.config?.difficulty}
                                    </span>
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-bold border uppercase tracking-wider ${interview.status === 'completed' ? 'border-brand-500/20 bg-brand-500/10 text-brand-400' : 'border-white/5 text-text-muted bg-white/1'}`}>
                                        {interview.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {interview.status === 'completed' && interview.reportId && (
                                        <Link
                                            to={`/report/${interview.reportId}`}
                                            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-brand-500/10"
                                        >
                                            View Report
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleDelete(interview.sessionId)}
                                        className="p-2.5 rounded-xl hover:bg-rose-500/10 text-text-muted hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/10 cursor-pointer"
                                        title="Delete Session"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-3 pt-8 pb-4">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => loadHistory(pagination.page - 1)}
                                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-white/4 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-all flex items-center gap-1 cursor-pointer"
                            >
                                <ChevronLeft size={14} /> Previous
                            </button>
                            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary px-3 py-2 bg-white/2 border border-white/5 rounded-xl">
                                {pagination.page} / {pagination.pages}
                            </span>
                            <button
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => loadHistory(pagination.page + 1)}
                                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-white/4 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-all flex items-center gap-1 cursor-pointer"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
