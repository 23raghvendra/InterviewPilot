import crypto from 'crypto';
import { Interview } from '../models/Interview.model.js';
import { Report } from '../models/Report.model.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateQuestions, evaluateAnswer, generateReport } from '../services/ai.service.js';
import { MAX_ANSWER_LENGTH } from '../config/constants.js';

// POST /api/interviews/start
export const startInterview = asyncHandler(async (req, res) => {
    const { interviewType, difficulty, domain, company, role, totalQuestions, timePerQuestion, enableVoice } = req.body;

    if (!interviewType) {
        throw new ApiError(400, 'Interview type is required.');
    }

    // Check for active sessions
    const activeSession = await Interview.findOne({ userId: req.user._id, status: 'in_progress' });
    if (activeSession) {
        throw new ApiError(400, 'You already have an active interview session. Please complete or abandon it first.');
    }

    // Generate questions via AI
    const rawQuestions = await generateQuestions({
        interviewType,
        difficulty: difficulty || 'medium',
        domain,
        company,
        role,
        totalQuestions: totalQuestions || 10
    });

    const sessionId = crypto.randomUUID();

    const interview = await Interview.create({
        userId: req.user._id,
        sessionId,
        status: 'in_progress',
        config: {
            interviewType,
            difficulty: difficulty || 'medium',
            domain,
            company,
            role,
            totalQuestions: totalQuestions || 10,
            timePerQuestion: timePerQuestion || 120,
            enableVoice: enableVoice || false
        },
        questions: rawQuestions.map(q => ({
            questionId: q.id,
            questionText: q.text,
            questionType: q.type,
            difficulty: q.difficulty,
            topic: q.topic,
            hints: q.hints || [],
            keyPoints: q.keyPoints || [],
            expectedDuration: q.expectedDuration || 120
        })),
        startedAt: new Date(),
        metadata: {
            userAgent: req.get('user-agent'),
            ipAddress: req.ip
        }
    });

    return res.status(201).json(new ApiResponse(201, { sessionId, interview }, 'Interview started'));
});

// GET /api/interviews/:sessionId
export const getInterview = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const interview = await Interview.findOne({ sessionId, userId: req.user._id });
    if (!interview) {
        throw new ApiError(404, 'Interview session not found.');
    }

    return res.json(new ApiResponse(200, { interview }, 'Interview retrieved'));
});

// PATCH /api/interviews/:sessionId/answer
export const submitAnswer = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { questionIndex, answer, codeAnswer, timeTaken } = req.body;

    const interview = await Interview.findOne({ sessionId, userId: req.user._id });
    if (!interview) {
        throw new ApiError(404, 'Interview session not found.');
    }
    if (interview.status !== 'in_progress') {
        throw new ApiError(400, 'Interview is not active.');
    }

    const question = interview.questions[questionIndex];
    if (!question) {
        throw new ApiError(400, 'Invalid question index.');
    }

    // Idempotency: check if already answered
    if (question.aiFeedback?.score !== undefined && question.aiFeedback?.score !== null) {
        return res.json(new ApiResponse(200, { evaluation: question.aiFeedback }, 'Answer already evaluated'));
    }

    // Truncate long answers
    let userAnswer = (answer || codeAnswer || '').substring(0, MAX_ANSWER_LENGTH);

    // Evaluate via AI
    const evaluation = await evaluateAnswer({
        question: { text: question.questionText, type: question.questionType },
        userAnswer,
        interviewType: interview.config.interviewType,
        difficulty: interview.config.difficulty
    });

    // Update question
    interview.questions[questionIndex].userAnswer = answer || '';
    interview.questions[questionIndex].codeAnswer = codeAnswer || '';
    interview.questions[questionIndex].aiFeedback = evaluation;
    interview.questions[questionIndex].timeTaken = timeTaken;
    interview.questions[questionIndex].answeredAt = new Date();
    interview.markModified('questions');
    await interview.save();

    return res.json(new ApiResponse(200, { evaluation }, 'Answer evaluated'));
});

// PATCH /api/interviews/:sessionId/skip
export const skipQuestion = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { questionIndex } = req.body;

    const interview = await Interview.findOne({ sessionId, userId: req.user._id });
    if (!interview) throw new ApiError(404, 'Interview session not found.');
    if (interview.status !== 'in_progress') throw new ApiError(400, 'Interview is not active.');

    const question = interview.questions[questionIndex];
    if (!question) throw new ApiError(400, 'Invalid question index.');

    interview.questions[questionIndex].skipped = true;
    interview.questions[questionIndex].answeredAt = new Date();
    interview.markModified('questions');
    await interview.save();

    return res.json(new ApiResponse(200, {}, 'Question skipped'));
});

// POST /api/interviews/:sessionId/end
export const endInterview = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const interview = await Interview.findOne({ sessionId, userId: req.user._id });
    if (!interview) throw new ApiError(404, 'Session not found.');
    if (interview.status === 'completed') {
        return res.json(new ApiResponse(200, { reportId: interview.reportId, overallScore: interview.overallScore }, 'Interview already completed'));
    }

    // Calculate overall score
    const answered = interview.questions.filter(q => !q.skipped && q.aiFeedback?.score !== undefined);
    const totalScore = answered.reduce((sum, q) => sum + (q.aiFeedback?.score || 0), 0);
    const overallScore = answered.length > 0 ? Math.round((totalScore / (answered.length * 10)) * 100) : 0;

    // Generate report via AI
    const reportData = await generateReport({ interview, questions: interview.questions });

    const report = await Report.create({
        userId: req.user._id,
        interviewId: interview._id,
        summary: {
            ...reportData.summary,
            overallScore,
            totalQuestions: interview.questions.length,
            answered: answered.length,
            skipped: interview.questions.length - answered.length
        },
        skillBreakdown: reportData.skillBreakdown,
        improvementPlan: reportData.improvementPlan,
        aiGeneratedInsights: reportData.aiGeneratedInsights,
        peerComparison: {
            percentile: reportData.peerComparisonPercentile || 50,
            averageScore: 65
        }
    });

    // Finalize interview
    interview.status = 'completed';
    interview.overallScore = overallScore;
    interview.reportId = report._id;
    interview.completedAt = new Date();
    interview.duration = Math.round((new Date() - interview.startedAt) / 1000);
    await interview.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    const newTotal = user.totalInterviews + 1;
    const newAvg = Math.round(((user.averageScore * user.totalInterviews) + overallScore) / newTotal);

    // Calculate streak
    const lastDate = user.lastInterviewDate;
    const now = new Date();
    let newStreak = 1;
    if (lastDate) {
        const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) newStreak = user.streak + 1;
    }

    await User.findByIdAndUpdate(req.user._id, {
        totalInterviews: newTotal,
        averageScore: newAvg,
        streak: newStreak,
        lastInterviewDate: now
    });

    return res.json(new ApiResponse(200, { reportId: report._id, overallScore }, 'Interview completed'));
});

// GET /api/interviews/history
export const getHistory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [interviews, total] = await Promise.all([
        Interview.find({ userId: req.user._id, status: { $in: ['completed', 'abandoned'] } })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('sessionId config.interviewType config.difficulty config.domain overallScore status completedAt duration createdAt reportId'),
        Interview.countDocuments({ userId: req.user._id, status: { $in: ['completed', 'abandoned'] } })
    ]);

    return res.json(new ApiResponse(200, {
        interviews,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    }, 'Interview history'));
});

// DELETE /api/interviews/:sessionId
export const deleteInterview = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const interview = await Interview.findOneAndDelete({ sessionId, userId: req.user._id });
    if (!interview) throw new ApiError(404, 'Interview not found.');

    // Also delete associated report
    if (interview.reportId) {
        await Report.findByIdAndDelete(interview.reportId);
    }

    return res.json(new ApiResponse(200, {}, 'Interview deleted'));
});
