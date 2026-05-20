import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Interview } from '../models/Interview.model.js';
import { generateHint, generateFollowUp } from '../services/ai.service.js';

// POST /api/ai/hint
export const getHint = asyncHandler(async (req, res) => {
    const { sessionId, questionIndex, userSoFar } = req.body;

    const interview = await Interview.findOne({ sessionId, userId: req.user._id });
    if (!interview) throw new ApiError(404, 'Interview session not found.');
    if (interview.status !== 'in_progress') throw new ApiError(400, 'Interview is not active.');

    const question = interview.questions[questionIndex];
    if (!question) throw new ApiError(400, 'Invalid question index.');

    const hint = await generateHint({
        question: { text: question.questionText },
        userSoFar
    });

    return res.json(new ApiResponse(200, { hint }, 'Hint generated'));
});

// GET /api/ai/follow-up
export const getFollowUp = asyncHandler(async (req, res) => {
    const { sessionId, questionIndex } = req.query;

    const interview = await Interview.findOne({ sessionId, userId: req.user._id });
    if (!interview) throw new ApiError(404, 'Interview session not found.');

    const question = interview.questions[parseInt(questionIndex)];
    if (!question) throw new ApiError(400, 'Invalid question index.');
    if (!question.userAnswer) throw new ApiError(400, 'No answer submitted for this question.');

    const followUp = await generateFollowUp({
        question: { text: question.questionText },
        userAnswer: question.userAnswer
    });

    return res.json(new ApiResponse(200, { followUp }, 'Follow-up generated'));
});
