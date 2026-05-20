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
    CheckCircle, XCircle, ArrowRight, Volume2, ChevronRight, PlayCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Custom minimal progress bar for InterviewPage
function ProgressBarMono({ value, max }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100)) || 0;
    return (
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
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
            toast('Time is up! Moving to next question.', { icon: '⏰' });
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
        onError: (err) => toast.error(`Voice error: ${err}`)
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

    // Auto-save
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
            toast.error('Failed to load interview');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            toast.error('Please provide an answer');
            return;
        }
        stopTimer();
        stopListening();
        setIsEvaluating(true);
        setPhase('reviewing');

        try {
            const { data } = await submitAnswer(sessionId, {
                questionIndex: currentQuestionIndex,
                answer,
                timeTaken: (interview.config.timePerQuestion - timeLeft)
            });
            setFeedback(data.data.evaluation);
            updateQuestionFeedback(currentQuestionIndex, data.data.evaluation);
        } catch (err) {
            toast.error('Evaluation failed. Please try again.');
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
            toast.error('Failed to skip');
        }
    };

    const handleEndInterview = async () => {
        setIsEnding(true);
        try {
            const { data } = await endInterview(sessionId);
            resetInterview();
            navigate(`/report/${data.data.reportId}`);
        } catch {
            toast.error('Failed to end interview');
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
            toast.error('Failed to get hint');
        } finally {
            setIsGettingHint(false);
        }
    };

    if (loading) return <FullPageSpinner />;
    if (!interview || !currentQuestion) {
        return (
            <div className="text-center py-20 flex flex-col items-center">
                <p className="text-text-muted mb-4">Interview not found</p>
                <button onClick={() => navigate('/dashboard')} className="px-5 py-2 border border-gray-400 rounded-full text-sm font-semibold hover:bg-gray-900/10 transition">Go to Dashboard</button>
            </div>
        );
    }

    const timerColor = timeLeft < 30 ? 'text-red-400' : timeLeft < 60 ? 'text-amber-400' : 'text-gray-900';

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
            {/* Top Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-900/10 text-gray-900 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {interview.config.interviewType.replace('_', ' ')}
                    </span>
                    <span className="text-text-secondary text-sm font-medium">
                        Q {currentQuestionIndex + 1} / {totalQuestions}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 text-lg font-mono font-bold ${timerColor}`}>
                        <Clock size={18} />
                        {formatTime(timeLeft)}
                    </div>
                    <button onClick={() => setShowEndModal(true)} className="px-4 py-1.5 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold">
                        End Interview
                    </button>
                </div>
            </div>

            {/* Progress */}
            <ProgressBarMono
                value={currentQuestionIndex + (phase === 'reviewing' ? 1 : 0)}
                max={totalQuestions}
            />

            {/* Question Card */}
            <div className={`p-6 rounded-2xl border transition-all duration-300 ${phase === 'answering' ? 'border-gray-400 bg-surface shadow-[0_0_30px_rgba(0,0,0,0.03)]' : 'border-gray-200 bg-surface-light/40'}`}>
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold border border-gray-300 text-text-secondary uppercase">{currentQuestion.difficulty}</span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200 bg-gray-900/5 text-gray-900">{currentQuestion.topic}</span>
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200 text-text-muted">{currentQuestion.questionType}</span>
                    </div>
                    {interview.config.enableVoice && (
                        <button
                            onClick={() => speak(currentQuestion.questionText)}
                            className="p-2 rounded-lg hover:bg-gray-900/10 transition-colors text-text-muted hover:text-gray-900"
                            title="Read question aloud"
                        >
                            <Volume2 size={18} />
                        </button>
                    )}
                </div>
                <h2 className="text-xl font-medium leading-relaxed text-gray-900 tracking-tight">{currentQuestion.questionText}</h2>
            </div>

            {/* Answer Input / Feedback */}
            {phase === 'answering' ? (
                <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm flex flex-col min-h-[300px]">
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer here... Be thorough and specific."
                        className="w-full flex-1 bg-transparent border-none outline-none resize-none text-[15px] leading-relaxed text-gray-900 placeholder:text-text-muted"
                        disabled={isEvaluating}
                        autoFocus
                    />

                    {/* Hint */}
                    {hint && (
                        <div className="mt-4 p-4 rounded-xl border border-gray-300 bg-gray-900/5">
                            <div className="flex items-center gap-2 text-gray-900 text-xs font-bold mb-2 uppercase tracking-wide">
                                <Lightbulb size={14} /> Hint
                            </div>
                            <p className="text-sm text-text-secondary">{hint}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            {/* Voice */}
                            {isSupported && (
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    title={isListening ? 'Stop listening' : 'Start voice input'}
                                    className={`p-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${isListening ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-900/5 text-gray-900'}`}
                                >
                                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                                    {isListening ? 'Recording' : 'Voice'}
                                </button>
                            )}
                            {/* Hint */}
                            <button
                                onClick={handleGetHint}
                                disabled={!!hint || isGettingHint}
                                className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-900/5 transition-colors flex items-center gap-2 text-gray-900 disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                                {isGettingHint ? <span className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin" /> : <Lightbulb size={16} />}
                                Hint
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={handleSkip} className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-gray-900 transition-colors flex items-center gap-2">
                                <SkipForward size={16} /> Skip
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={isEvaluating}
                                className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.1)] disabled:opacity-70"
                            >
                                {isEvaluating ? <span className="w-4 h-4 border-2 border-surface/20 border-t-surface rounded-full animate-spin" /> : <Send size={16} />}
                                Submit Answer
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Feedback Panel */
                <div className="space-y-4">
                    {/* Score */}
                    <div className="p-6 rounded-2xl border border-gray-200 bg-surface-light/40 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-900 tracking-tight">AI Evaluation</h3>
                            {feedback && (
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl font-bold text-gray-900 tracking-tighter">
                                        {feedback.score}<span className="text-lg text-text-muted font-normal">/10</span>
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${feedback.score >= 7 ? 'border-blue-600 bg-blue-600 text-white' : feedback.score >= 5 ? 'border-gray-300 text-gray-900' : 'border-gray-400 text-text-secondary'}`}>
                                        {feedback.grade}
                                    </span>
                                </div>
                            )}
                        </div>

                        {feedback && (
                            <div className="space-y-6">
                                <p className="text-[15px] text-text-secondary leading-relaxed">{feedback.detailedFeedback}</p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Strengths */}
                                    <div className="p-4 rounded-xl border border-gray-300 bg-gray-900/5">
                                        <p className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                            <CheckCircle size={14} className="text-gray-900" /> Strengths
                                        </p>
                                        <ul className="space-y-2">
                                            {feedback.strengths?.map((s, i) => (
                                                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                                    <span className="text-gray-900/50 mt-0.5">•</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Weaknesses */}
                                    <div className="p-4 rounded-xl border border-gray-200 bg-surface">
                                        <p className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                            <XCircle size={14} className="text-text-muted" /> Areas to Improve
                                        </p>
                                        <ul className="space-y-2">
                                            {feedback.weaknesses?.map((w, i) => (
                                                <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                                                    <span className="text-gray-900/30 mt-0.5">•</span> {w}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Ideal Answer */}
                                <div className="p-4 rounded-xl border border-gray-300 bg-surface relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                    <p className="text-xs font-bold text-gray-900 mb-2 ml-2 uppercase tracking-wide">Ideal Answer</p>
                                    <p className="text-sm text-text-secondary ml-2 leading-relaxed">{feedback.idealAnswer}</p>
                                </div>

                                {/* Tip */}
                                {feedback.improvementTip && (
                                    <div className="p-3 border-l-2 border-white/30 pl-4">
                                        <p className="text-xs font-bold text-gray-900 mb-1 uppercase tracking-wide flex items-center gap-1.5">
                                            <Lightbulb size={12} /> Pro Tip
                                        </p>
                                        <p className="text-sm text-text-secondary">{feedback.improvementTip}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleNext}
                                className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                {currentQuestionIndex < totalQuestions - 1 ? (
                                    <>Next Question <ChevronRight size={18} /></>
                                ) : (
                                    <>Finish Interview <ArrowRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* End Interview Modal */}
            <Modal isOpen={showEndModal} onClose={() => setShowEndModal(false)} title="End Interview?">
                <div className="space-y-5">
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-300 bg-surface">
                        <AlertTriangle size={20} className="text-gray-900 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Are you sure you want to end this interview?</p>
                            <p className="text-sm text-text-muted mt-2 leading-relaxed">
                                You've answered {currentQuestionIndex} out of {totalQuestions} questions.
                                Unanswered questions will be marked as skipped.
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowEndModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900/5 text-gray-900 transition-colors">
                            Continue
                        </button>
                        <button
                            onClick={handleEndInterview}
                            disabled={isEnding}
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            {isEnding ? <span className="w-4 h-4 border-2 border-surface/20 border-t-surface rounded-full animate-spin" /> : null}
                            End & Generate Report
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
