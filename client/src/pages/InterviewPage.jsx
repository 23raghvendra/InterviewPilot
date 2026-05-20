import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterviewStore } from '../store/interviewStore';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import { getInterview, submitAnswer, skipQuestion, endInterview, getHint } from '../api/interview.api';
import { FullPageSpinner } from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { formatTime } from '../utils/formatters';
import {
    Clock, Mic, MicOff, Send, SkipForward, Lightbulb, AlertTriangle,
    CheckCircle, XCircle, ArrowRight, Volume2, ChevronRight, PlayCircle, Zap, ShieldAlert, Code2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';

function ProgressBarMono({ value, max }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100)) || 0;
    return (
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export default function InterviewPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { interview, setInterview, currentQuestionIndex, setCurrentIndex, updateQuestionFeedback, resetInterview, saveAnswer, getAnswer } = useInterviewStore();

    const [answer, setAnswer] = useState('');
    const [code, setCode] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [phase, setPhase] = useState('answering'); // answering | reviewing
    const [hint, setHint] = useState('');
    const [isGettingHint, setIsGettingHint] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const [loading, setLoading] = useState(!interview);

    const currentQuestion = interview?.questions?.[currentQuestionIndex];
    const totalQuestions = interview?.questions?.length || 0;

    const handleTimeExpiredRef = useRef(null);
    handleTimeExpiredRef.current = () => {
        if (phase === 'answering' && answer.trim()) {
            handleSubmitAnswer();
        } else if (phase === 'answering') {
            toast('Time has expired! Skipping to the next evaluation criteria.', { icon: '⏰' });
            handleSkip();
        }
    };

    const handleTimeExpired = useCallback(() => {
        handleTimeExpiredRef.current?.();
    }, []);

    const { timeLeft, isRunning, startTimer, stopTimer, resetTimer } = useTimer({
        duration: interview?.config?.timePerQuestion || 120,
        onExpire: handleTimeExpired
    });

    const { isListening, isSupported, startListening, stopListening, speak, stopSpeaking } = useSpeech({
        onResult: (text) => setAnswer(prev => (prev + ' ' + text).trim()),
        onError: (err) => toast.error(`Audio translation error: ${err}`)
    });

    // Load interview if not in store
    useEffect(() => {
        if (!interview && sessionId) {
            loadInterview();
        } else {
            setLoading(false);
            const savedAnswer = getAnswer(currentQuestionIndex);
            if (savedAnswer) setAnswer(savedAnswer);
        }
    }, [sessionId]);

    // Start timer when question changes
    useEffect(() => {
        if (interview && phase === 'answering') {
            resetTimer(interview.config?.timePerQuestion);
            startTimer();
        }
    }, [currentQuestionIndex, interview]);

    // Auto-save answer
    useEffect(() => {
        if (answer.trim() && phase === 'answering') {
            saveAnswer(currentQuestionIndex, answer);
        }
    }, [answer]);

    // Warn on page leave
    useEffect(() => {
        const handler = (e) => {
            if (phase === 'answering') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [phase]);

    const loadInterview = async () => {
        try {
            const { data } = await getInterview(sessionId);
            const iv = data.data.interview;
            if (iv.status === 'completed') {
                navigate(`/report/${iv.reportId}`);
                return;
            }
            setInterview(iv);
            const savedAnswer = getAnswer(currentQuestionIndex);
            if (savedAnswer) setAnswer(savedAnswer);
        } catch {
            toast.error('Failed to parse interview session');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        const finalAnswer = code.trim() ? `Explanation:\n${answer}\n\nCode:\n${code}` : answer;

        if (!finalAnswer.trim()) {
            toast.error('Response buffer empty. Please provide an answer first.');
            return;
        }
        stopTimer();
        stopListening();
        setIsEvaluating(true);
        setPhase('reviewing');

        try {
            const { data } = await submitAnswer(sessionId, {
                questionIndex: currentQuestionIndex,
                answer: finalAnswer,
                timeTaken: (interview.config.timePerQuestion - timeLeft)
            });
            setFeedback(data.data.evaluation);
            updateQuestionFeedback(currentQuestionIndex, data.data.evaluation);
        } catch (err) {
            toast.error('AI synthesis failed. Let\'s resume your timer.');
            setPhase('answering');
            startTimer();
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentIndex(currentQuestionIndex + 1);
            setAnswer('');
            setCode('');
            setFeedback(null);
            setHint('');
            setPhase('answering');
        } else {
            setShowEndModal(true);
        }
    };

    const handleSkip = async () => {
        try {
            await skipQuestion(sessionId, { questionIndex: currentQuestionIndex });
            handleNext();
        } catch {
            toast.error('Failed to flag skip on this prompt.');
        }
    };

    const handleEndInterview = async () => {
        setIsEnding(true);
        try {
            const { data } = await endInterview(sessionId);
            resetInterview();
            navigate(`/report/${data.data.reportId}`);
        } catch {
            toast.error('Could not compile final evaluation report');
        } finally {
            setIsEnding(false);
            setShowEndModal(false);
        }
    };

    const handleGetHint = async () => {
        setIsGettingHint(true);
        try {
            const { data } = await getHint({
                sessionId,
                questionIndex: currentQuestionIndex,
                userSoFar: answer
            });
            setHint(data.data.hint);
        } catch {
            toast.error('Could not load helpful hint');
        } finally {
            setIsGettingHint(false);
        }
    };

    if (loading) return <FullPageSpinner />;
    if (!interview || !currentQuestion) {
        return (
            <div className="text-center py-20 flex flex-col items-center justify-center space-y-6">
                <ShieldAlert size={36} className="text-text-muted" />
                <p className="text-text-muted mb-4">Evaluation Session Ledger Not Found</p>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-white text-surface hover:bg-white/90 rounded-full text-sm font-bold transition">Go to Dashboard</button>
            </div>
        );
    }

    const timerColor = timeLeft < 30 ? 'text-rose-500' : timeLeft < 60 ? 'text-amber-500' : 'text-emerald-400';

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Session Navigation Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                        {interview.config.interviewType.replace('_', ' ')} PARADIGM
                    </span>
                    <span className="text-text-secondary text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-1 rounded-xl">
                        PROMPT {currentQuestionIndex + 1} / {totalQuestions}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 text-lg font-mono font-bold bg-white/5 border border-white/5 px-4 py-1.5 rounded-xl ${timerColor}`}>
                        <Clock size={16} />
                        {formatTime(timeLeft)}
                    </div>
                    <button onClick={() => setShowEndModal(true)} className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer">
                        Complete Session
                    </button>
                </div>
            </div>

            {/* Session Progress Tracker */}
            <ProgressBarMono
                value={currentQuestionIndex + (phase === 'reviewing' ? 1 : 0)}
                max={totalQuestions}
            />

            {/* AI Prompter Card */}
            <div className={`p-8 rounded-2xl border transition-all duration-500 ${phase === 'answering' ? 'border-brand-500/25 bg-panel shadow-[0_0_30px_rgba(139,92,246,0.06)]' : 'border-white/5 bg-panel-light/40'}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold border border-white/10 text-text-secondary bg-white/2 uppercase tracking-wider">{currentQuestion.difficulty}</span>
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold border border-brand-500/10 bg-brand-500/5 text-brand-400 uppercase tracking-wider">{currentQuestion.topic}</span>
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-semibold border border-white/5 text-text-muted bg-white/1 uppercase tracking-wider">{currentQuestion.questionType}</span>
                    </div>
                    {interview.config.enableVoice && (
                        <button
                            onClick={() => speak(currentQuestion.questionText)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-brand-500/10 text-text-secondary hover:text-brand-400 border border-white/5 hover:border-brand-500/10 transition-colors cursor-pointer"
                            title="Speak question"
                        >
                            <Volume2 size={16} />
                        </button>
                    )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-white tracking-tight">{currentQuestion.questionText}</h2>
            </div>

            {/* Answer Board vs AI Analysis Panel */}
            {phase === 'answering' ? (
                <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md flex flex-col min-h-[340px] shadow-2xl relative">
                    {/* Pulsing Audio Waves Indicator if voice is recording */}
                    {isListening && (
                        <div className="absolute top-6 right-6 flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">Analyzing Speech</span>
                            <div className="flex gap-0.5 h-3 items-center ml-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="wave-bar w-[3px]" style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {['technical', 'dsa'].includes(interview.config.interviewType) ? (
                        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[400px]">
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Explain your rationale, trade-offs, and edge cases clearly..."
                                className="w-full md:w-1/3 bg-transparent border-none outline-none resize-none text-[14px] leading-relaxed text-white placeholder:text-text-muted pt-2"
                                disabled={isEvaluating}
                            />
                            <div className="flex-1 border border-white/10 rounded-xl overflow-hidden relative shadow-inner bg-[#1e1e1e]">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-[#2d2d2d] border-b border-white/5 flex items-center px-3 z-10">
                                    <Code2 size={14} className="text-text-muted mr-2" />
                                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Live Editor</span>
                                </div>
                                <div className="pt-8 h-full">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="javascript"
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(val) => setCode(val)}
                                        options={{ 
                                            minimap: { enabled: false }, 
                                            fontSize: 14,
                                            fontFamily: 'JetBrains Mono',
                                            padding: { top: 16 }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type or dictate your structural answer here... Explain your rationale, trade-offs, and edge cases clearly."
                            className="w-full flex-1 bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed text-white placeholder:text-text-muted pt-2"
                            disabled={isEvaluating}
                            autoFocus
                        />
                    )}

                    {/* Dynamic Hint card block */}
                    {hint && (
                        <div className="mt-4 p-4 rounded-xl border border-brand-500/15 bg-brand-500/5 relative overflow-hidden animate-in slide-in-from-bottom duration-300">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                            <div className="flex items-center gap-2 text-brand-400 text-[10px] font-extrabold mb-1.5 uppercase tracking-wider">
                                <Lightbulb size={12} /> Live Evaluator Hint
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed font-semibold">{hint}</p>
                        </div>
                    )}

                    {/* Controller bar */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            {/* Speech mic toggle */}
                            {isSupported && (
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    title={isListening ? 'Mute transcription' : 'Activate microphone'}
                                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${isListening ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/15' : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white'}`}
                                >
                                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                                    {isListening ? 'Capturing' : 'Voice Mode'}
                                </button>
                            )}
                            {/* Hint trigger */}
                            <button
                                onClick={handleGetHint}
                                disabled={!!hint || isGettingHint}
                                className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-wider hover:bg-white/4 transition-colors flex items-center gap-2 text-white disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                            >
                                {isGettingHint ? <span className="w-3.5 h-3.5 border-2 border-brand-400 border-t-white rounded-full animate-spin" /> : <Lightbulb size={14} />}
                                Hint
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={handleSkip} className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-white hover:bg-white/2 transition-colors flex items-center gap-1.5 cursor-pointer">
                                <SkipForward size={14} /> Skip
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={isEvaluating}
                                className="px-6 py-2.5 rounded-full bg-white hover:bg-white/90 text-surface text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
                            >
                                {isEvaluating ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={14} />}
                                Submit Answer
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Premium AI Evaluation Feedback Panel */
                <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="p-6 rounded-2xl border border-white/5 bg-panel backdrop-blur-md space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="space-y-1">
                                <h3 className="font-extrabold text-white tracking-tight flex items-center gap-2">
                                    AI Evaluation <Zap size={16} className="text-brand-400 animate-pulse" />
                                </h3>
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Real-time parser analysis</p>
                            </div>
                            {feedback && (
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-3xl font-extrabold text-white tracking-tighter">
                                            {feedback.score}<span className="text-sm text-text-muted font-normal"> / 10</span>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest border bg-brand-500/10 border-brand-500/25 text-brand-400`}>
                                        {feedback.grade} Grade
                                    </span>
                                </div>
                            )}
                        </div>

                        {feedback && (
                            <div className="space-y-6">
                                <p className="text-sm text-text-secondary leading-relaxed bg-white/1 p-4 rounded-xl border border-white/5">{feedback.detailedFeedback}</p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Strengths green border card */}
                                    <div className="p-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/2 space-y-3">
                                        <p className="text-xs font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-widest">
                                            <CheckCircle size={14} /> Key Strengths
                                        </p>
                                        <ul className="space-y-2">
                                            {feedback.strengths?.map((s, i) => (
                                                <li key={i} className="text-xs text-text-secondary flex items-start gap-2.5 font-medium leading-relaxed">
                                                    <span className="text-emerald-500 mt-1">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Areas to Improve crimson border card */}
                                    <div className="p-5 rounded-2xl border border-rose-500/10 bg-rose-500/2 space-y-3">
                                        <p className="text-xs font-bold text-rose-400 flex items-center gap-2 uppercase tracking-widest">
                                            <XCircle size={14} /> Improvement Matrix
                                        </p>
                                        <ul className="space-y-2">
                                            {feedback.weaknesses?.map((w, i) => (
                                                <li key={i} className="text-xs text-text-secondary flex items-start gap-2.5 font-medium leading-relaxed">
                                                    <span className="text-rose-500 mt-1">•</span> {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Ideal Answer Block */}
                                <div className="p-5 rounded-2xl border border-brand-500/10 bg-brand-500/2 relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
                                    <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-2 ml-2">Verified Model Answer</p>
                                    <p className="text-xs text-text-secondary ml-2 leading-relaxed font-semibold">{feedback.idealAnswer}</p>
                                </div>

                                {/* Pro Tip block */}
                                {feedback.improvementTip && (
                                    <div className="p-4 border-l border-white/10 pl-5 flex gap-3">
                                        <Lightbulb size={16} className="text-brand-400 flex-shrink-0 mt-0.5 animate-pulse" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-white uppercase tracking-wider">Interviewer pro-tip</p>
                                            <p className="text-xs text-text-secondary leading-relaxed font-semibold">{feedback.improvementTip}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end border-t border-white/5 pt-6">
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                {currentQuestionIndex < totalQuestions - 1 ? (
                                    <>Load Next Prompt <ChevronRight size={16} /></>
                                ) : (
                                    <>Compile Evaluation Report <ArrowRight size={16} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* End Session Confirmation Modal */}
            <Modal isOpen={showEndModal} onClose={() => setShowEndModal(false)} title="End Simulator Session?">
                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-rose-500/15 bg-rose-500/2">
                        <AlertTriangle size={24} className="text-rose-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                            <p className="font-bold text-white text-base">Terminate evaluation prematurely?</p>
                            <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                                You have answered {currentQuestionIndex} out of {totalQuestions} questions.
                                Ending the session will record unanswered items as skipped, and generate the final grading report immediately.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                        <button onClick={() => setShowEndModal(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/4 text-white transition-colors cursor-pointer">
                            Resume Session
                        </button>
                        <button
                            onClick={handleEndInterview}
                            disabled={isEnding}
                            className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                        >
                            {isEnding ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                            End & Compile
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
