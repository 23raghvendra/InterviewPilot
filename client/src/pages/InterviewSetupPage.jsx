import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview } from '../api/interview.api';
import { useInterviewStore } from '../store/interviewStore';
import { INTERVIEW_TYPES, DIFFICULTY_LEVELS, DOMAINS, COMPANIES } from '../utils/constants';
import { Settings2, PlayCircle, Volume2, Clock, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InterviewSetupPage() {
    const navigate = useNavigate();
    const { setInterview, setSessionId } = useInterviewStore();
    const [isStarting, setIsStarting] = useState(false);

    const [config, setConfig] = useState({
        interviewType: 'technical',
        difficulty: 'medium',
        domain: 'Full Stack',
        company: '',
        role: '',
        totalQuestions: 10,
        timePerQuestion: 120,
        enableVoice: false
    });

    const handleStart = async () => {
        if (!config.interviewType) {
            toast.error('Please select an interview type');
            return;
        }

        setIsStarting(true);
        try {
            const { data } = await startInterview(config);
            setInterview(data.data.interview);
            setSessionId(data.data.sessionId);
            toast.success('Interview started!');
            navigate(`/interview/${data.data.sessionId}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to start interview');
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg border border-gray-300 bg-gray-900/5 flex items-center justify-center">
                        <Settings2 size={20} className="text-gray-900" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Configure Your Interview</h1>
                </div>
                <p className="text-text-muted ml-[52px]">Customize your mock interview parameters.</p>
            </div>

            {/* Interview Type */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                <h3 className="font-semibold mb-4 text-gray-900">Interview Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INTERVIEW_TYPES.map(({ value, label, icon, description }) => (
                        <button
                            key={value}
                            onClick={() => setConfig({ ...config, interviewType: value })}
                            className={`
                            p-4 rounded-xl border text-left transition-all duration-200
                            ${config.interviewType === value
                                    ? 'border-white bg-gray-900/10 text-gray-900'
                                    : 'border-gray-200 hover:border-gray-400 bg-surface/50 text-text-secondary hover:text-gray-900'
                                }
                            `}
                        >
                            <span className={`text-2xl block mb-2 ${config.interviewType === value ? 'text-gray-900' : 'text-text-muted'}`}>{icon}</span>
                            <p className="font-medium text-sm">{label}</p>
                            <p className="text-xs mt-1 opacity-70">{description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                <h3 className="font-semibold mb-4 text-gray-900">Difficulty Level</h3>
                <div className="flex gap-3">
                    {DIFFICULTY_LEVELS.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setConfig({ ...config, difficulty: value })}
                            className={`
                            flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-200
                            ${config.difficulty === value
                                    ? 'border-white bg-blue-600 text-white'
                                    : 'border-gray-200 hover:border-gray-400 bg-surface/50 text-text-secondary hover:text-gray-900'
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Domain & Company */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 text-gray-900">Domain</h3>
                    <div className="flex flex-wrap gap-2">
                        {DOMAINS.map(domain => (
                            <button
                                key={domain}
                                onClick={() => setConfig({ ...config, domain })}
                                className={`
                                px-3.5 py-1.5 rounded-lg text-sm border transition-all duration-200
                                ${config.domain === domain
                                        ? 'border-white bg-gray-900/10 text-gray-900'
                                        : 'border-gray-200 text-text-muted hover:text-gray-900 hover:border-gray-400 bg-surface/50'
                                    }
                                `}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                    <h3 className="font-semibold mb-4 text-gray-900">Target Company <span className="text-text-muted font-normal">(optional)</span></h3>
                    <div className="flex flex-wrap gap-2">
                        {COMPANIES.map(company => (
                            <button
                                key={company}
                                onClick={() => setConfig({ ...config, company: config.company === company ? '' : company })}
                                className={`
                                px-3.5 py-1.5 rounded-lg text-sm border transition-all duration-200
                                ${config.company === company
                                        ? 'border-white bg-gray-900/10 text-gray-900'
                                        : 'border-gray-200 text-text-muted hover:text-gray-900 hover:border-gray-400 bg-surface/50'
                                    }
                                `}
                            >
                                {company}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Role & Settings */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                <h3 className="font-semibold mb-4 text-gray-900">Additional Settings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">Target Role</label>
                        <input
                            type="text"
                            value={config.role}
                            onChange={(e) => setConfig({ ...config, role: e.target.value })}
                            placeholder="e.g., Software Engineer"
                            className="w-full px-4 py-2.5 bg-surface border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-white focus:ring-1 focus:ring-white placeholder:text-text-muted transition-all"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                            <Hash size={14} /> Number of Questions
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={3}
                                max={20}
                                value={config.totalQuestions}
                                onChange={(e) => setConfig({ ...config, totalQuestions: parseInt(e.target.value) })}
                                className="flex-1 accent-white"
                            />
                            <span className="text-lg font-bold w-8 text-center text-gray-900">{config.totalQuestions}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                            <Clock size={14} /> Time per Question (seconds)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={30}
                                max={300}
                                step={30}
                                value={config.timePerQuestion}
                                onChange={(e) => setConfig({ ...config, timePerQuestion: parseInt(e.target.value) })}
                                className="flex-1 accent-white"
                            />
                            <span className="text-lg font-bold w-12 text-center text-gray-900">{config.timePerQuestion}s</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setConfig({ ...config, enableVoice: !config.enableVoice })}
                            className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg border w-full transition-all duration-200 mt-[1.6rem]
                            ${config.enableVoice
                                    ? 'border-white bg-gray-900/10'
                                    : 'border-gray-300 hover:border-white/30 bg-surface'
                                }
                            `}
                        >
                            <Volume2 size={18} className={config.enableVoice ? 'text-gray-900' : 'text-text-muted'} />
                            <div className="text-left">
                                <p className={`text-sm font-medium ${config.enableVoice ? 'text-gray-900' : 'text-text-secondary'}`}>Voice Mode</p>
                                <p className="text-xs text-text-muted">Answer with your voice</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary & Start */}
            <div className="p-6 rounded-2xl border border-gray-400 bg-surface shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-24 z-20">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-900/10 text-gray-900 uppercase tracking-wider">{config.interviewType.replace('_', ' ')}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-400 text-text-secondary uppercase tracking-wider">{config.difficulty}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-400 text-text-secondary">{config.totalQuestions} Qs</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-400 text-text-secondary">{config.timePerQuestion}s/Q</span>
                    {config.domain && <span className="px-3 py-1 rounded-full text-xs font-semibold border border-gray-400 text-text-secondary">{config.domain}</span>}
                </div>
                <button
                    disabled={isStarting}
                    onClick={handleStart}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center disabled:opacity-70"
                >
                    {isStarting ? (
                        <span className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <><PlayCircle size={18} className="mr-2" /> Start Interview</>
                    )}
                </button>
            </div>
        </div>
    );
}
