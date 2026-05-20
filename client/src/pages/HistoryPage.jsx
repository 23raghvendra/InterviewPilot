import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deleteInterview } from '../api/interview.api';
import Card, { CardBody } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { formatDuration, formatRelativeTime } from '../utils/formatters';
import { History as HistoryIcon, Trash2, ChevronLeft, ChevronRight, Box } from 'lucide-react';
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
            setLoading(false);
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
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg border border-gray-300 bg-gray-900/5 flex items-center justify-center">
                    <HistoryIcon size={20} className="text-gray-900" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Interview History</h1>
                    <p className="text-text-muted text-sm">{pagination.total} total sessions</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><Spinner size="lg" className="text-gray-900" /></div>
            ) : interviews.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-dashed border-gray-300 bg-surface/30">
                    <Box size={40} className="text-gray-900/20 mx-auto mb-4" />
                    <p className="text-text-secondary mb-6 font-medium">No interview history yet.</p>
                    <Link to="/interview/setup">
                        <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                            Start your first interview
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {interviews.map((interview) => (
                        <div key={interview.sessionId} className="p-4 rounded-xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm hover:bg-gray-900/5 hover:border-gray-300 transition-all flex items-center justify-between gap-4 group">
                            <div className="flex items-center gap-5 flex-1">
                                <div className="w-14 h-14 rounded-full border border-gray-300 bg-surface flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                                        {interview.overallScore || 0}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 capitalize text-base tracking-tight mb-1">
                                        {interview.config?.interviewType?.replace('_', ' ')} Interview
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-text-muted">{formatRelativeTime(interview.createdAt)}</span>
                                        {interview.duration && (
                                            <span className="text-xs text-text-muted">• {formatDuration(interview.duration)}</span>
                                        )}
                                        {interview.config?.domain && (
                                            <span className="text-xs text-text-muted">• {interview.config.domain}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-xs border border-gray-300 text-text-secondary capitalize">
                                    {interview.config?.difficulty}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs border uppercase tracking-wider ${interview.status === 'completed' ? 'border-gray-400 bg-gray-900/10 text-gray-900' : 'border-gray-300 text-text-muted'}`}>
                                    {interview.status}
                                </span>
                                {interview.status === 'completed' && interview.reportId && (
                                    <Link
                                        to={`/report/${interview.reportId}`}
                                        className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        View Report
                                    </Link>
                                )}
                                <button
                                    onClick={() => handleDelete(interview.sessionId)}
                                    className="p-2 rounded-lg hover:bg-gray-900/10 text-text-muted hover:text-gray-900 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-3 pt-8 pb-4">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => loadHistory(pagination.page - 1)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-900/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <span className="text-sm font-medium text-text-secondary px-2">
                                {pagination.page} / {pagination.pages}
                            </span>
                            <button
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => loadHistory(pagination.page + 1)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-900/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
