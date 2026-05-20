import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInterview } from '../api/interview.api';
import { useInterviewStore } from '../store/interviewStore';
import { INTERVIEW_TYPES, DIFFICULTY_LEVELS, DOMAINS, COMPANIES } from '../utils/constants';
import { Settings2, PlayCircle, Volume2, Clock, Hash, Check, Compass, Cpu } from 'lucide-react';
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
            toast.success('AI Simulator Ready. Session initialized.');
            navigate(`/interview/${data.data.sessionId}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to start interview');
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header console */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                <div className="w-12 h-12 rounded-xl border border-brand-500/20 bg-brand-500/5 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                    <Settings2 size={22} className="text-brand-400 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Console Configuration</h1>
                    <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Configure your AI session criteria below</p>
                </div>
            </div>

            {/* Config Fields Grid */}
            <div className="space-y-6">
                {/* 1. Interview Type Selectors */}
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-4">
                    <h3 className="font-bold text-white tracking-tight flex items-center gap-2 text-sm uppercase tracking-wider text-brand-300">
                        <Cpu size={16} /> 1. Interview Paradigm
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {INTERVIEW_TYPES.map(({ value, label, icon, description }) => (
                            <button
                                key={value}
                                onClick={() => setConfig({ ...config, interviewType: value })}
                                className={`
                                    p-5 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden cursor-pointer
                                    ${config.interviewType === value
                                        ? 'border-brand-500 bg-brand-500/5 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                        : 'border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/4'
                                    }
                                `}
                            >
                                <span className={`text-3xl block mb-3 transition-transform duration-300 group-hover:scale-110 ${config.interviewType === value ? 'opacity-100' : 'opacity-70'}`}>
                                    {icon}
                                </span>
                                <p className={`font-bold text-sm ${config.interviewType === value ? 'text-white' : 'text-text-secondary'}`}>
                                    {label}
                                </p>
                                <p className="text-[11px] text-text-muted mt-1 leading-normal">
                                    {description}
                                </p>
                                {config.interviewType === value && (
                                    <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                                        <Check size={10} className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Difficulty Console */}
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-4">
                    <h3 className="font-bold text-white tracking-tight flex items-center gap-2 text-sm uppercase tracking-wider text-brand-300">
                        <Compass size={16} /> 2. Complexity Rating
                    </h3>
                    <div className="flex gap-4">
                        {DIFFICULTY_LEVELS.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setConfig({ ...config, difficulty: value })}
                                className={`
                                    flex-1 py-3.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer
                                    ${config.difficulty === value
                                        ? 'border-brand-500 bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                                        : 'border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/4 text-text-secondary hover:text-white'
                                    }
                                `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Domain & Target Company */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-4">
                        <h3 className="font-bold text-white tracking-tight text-sm uppercase tracking-wider text-brand-300">3. Vetting Domain</h3>
                        <div className="flex flex-wrap gap-2">
                            {DOMAINS.map(domain => (
                                <button
                                    key={domain}
                                    onClick={() => setConfig({ ...config, domain })}
                                    className={`
                                        px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer
                                        ${config.domain === domain
                                            ? 'border-brand-500 bg-brand-500/10 text-brand-400 font-bold'
                                            : 'border-white/5 text-text-secondary hover:text-white hover:border-white/20 bg-white/2'
                                        }
                                    `}
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-4">
                        <h3 className="font-bold text-white tracking-tight text-sm uppercase tracking-wider text-brand-300">4. Target Company</h3>
                        <div className="flex flex-wrap gap-2">
                            {COMPANIES.map(company => (
                                <button
                                    key={company}
                                    onClick={() => setConfig({ ...config, company: config.company === company ? '' : company })}
                                    className={`
                                        px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 cursor-pointer
                                        ${config.company === company
                                            ? 'border-brand-500 bg-brand-500/10 text-brand-400 font-bold'
                                            : 'border-white/5 text-text-secondary hover:text-white hover:border-white/20 bg-white/2'
                                        }
                                    `}
                                >
                                    {company}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Fine-Tuning Console */}
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-6">
                    <h3 className="font-bold text-white tracking-tight text-sm uppercase tracking-wider text-brand-300">5. Simulator Adjustments</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest block">Custom Role Title</label>
                            <input
                                type="text"
                                value={config.role}
                                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                                placeholder="e.g., Senior Full Stack Engineer"
                                className="w-full px-4 py-3 bg-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-text-muted transition-colors duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                <Hash size={12} className="text-brand-400" /> Quantity threshold
                            </label>
                            <div className="flex items-center gap-4 bg-surface p-2.5 rounded-xl border border-white/5">
                                <input
                                    type="range"
                                    min={3}
                                    max={20}
                                    value={config.totalQuestions}
                                    onChange={(e) => setConfig({ ...config, totalQuestions: parseInt(e.target.value) })}
                                    className="flex-1 accent-brand-500"
                                />
                                <span className="text-sm font-bold w-8 text-center text-white bg-white/5 py-1 rounded-md">{config.totalQuestions}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                <Clock size={12} className="text-brand-400" /> Response window limit
                            </label>
                            <div className="flex items-center gap-4 bg-surface p-2.5 rounded-xl border border-white/5">
                                <input
                                    type="range"
                                    min={30}
                                    max={300}
                                    step={30}
                                    value={config.timePerQuestion}
                                    onChange={(e) => setConfig({ ...config, timePerQuestion: parseInt(e.target.value) })}
                                    className="flex-1 accent-brand-500"
                                />
                                <span className="text-sm font-bold w-12 text-center text-white bg-white/5 py-1 rounded-md">{config.timePerQuestion}s</span>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setConfig({ ...config, enableVoice: !config.enableVoice })}
                                className={`
                                    flex items-center gap-4 px-4 py-3 rounded-xl border w-full transition-all duration-300 cursor-pointer
                                    ${config.enableVoice
                                        ? 'border-brand-500 bg-brand-500/5'
                                        : 'border-white/5 hover:border-white/10 bg-surface'
                                    }
                                `}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${config.enableVoice ? 'bg-brand-500/10 text-brand-400' : 'bg-white/2 text-text-muted'}`}>
                                    <Volume2 size={18} />
                                </div>
                                <div className="text-left">
                                    <p className={`text-xs font-bold uppercase tracking-wider ${config.enableVoice ? 'text-white' : 'text-text-secondary'}`}>Speech Transcription</p>
                                    <p className="text-[10px] text-text-muted mt-0.5">Deliver answers via microphone</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Launch Action Bar */}
            <div className="p-6 rounded-2xl border border-white/10 bg-panel backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 sticky bottom-6 z-20">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-brand-500/10 border border-brand-500/20 text-brand-400 uppercase tracking-widest">{config.interviewType.replace('_', ' ')}</span>
                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/5 bg-white/2 text-text-secondary uppercase tracking-widest">{config.difficulty}</span>
                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/5 bg-white/2 text-text-secondary">{config.totalQuestions} Questions</span>
                    <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/5 bg-white/2 text-text-secondary">{config.timePerQuestion}s Limit</span>
                    {config.domain && <span className="px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/5 bg-white/2 text-text-secondary">{config.domain}</span>}
                </div>
                <button
                    disabled={isStarting}
                    onClick={handleStart}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-full text-sm font-bold hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
                >
                    {isStarting ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                        <><PlayCircle size={18} className="mr-2" /> Launch AI Simulator</>
                    )}
                </button>
            </div>
        </div>
    );
}
