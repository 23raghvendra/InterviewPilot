import { Report } from '../models/Report.model.js';
import { Interview } from '../models/Interview.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/reports/:reportId
export const getReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;

    const report = await Report.findById(reportId).populate('interviewId');
    if (!report) throw new ApiError(404, 'Report not found.');
    if (report.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, 'Not authorized to view this report.');
    }

    return res.json(new ApiResponse(200, { report }, 'Report retrieved'));
});

// GET /api/reports/user/all
export const getUserReports = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reports, total] = await Promise.all([
        Report.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .select('summary.overallScore summary.grade summary.readinessLevel createdAt interviewId'),
        Report.countDocuments({ userId: req.user._id })
    ]);

    return res.json(new ApiResponse(200, {
        reports,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    }, 'User reports'));
});

// GET /api/reports/stats/overview
export const getStatsOverview = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Aggregate stats
    const [interviewStats] = await Interview.aggregate([
        { $match: { userId, status: 'completed' } },
        {
            $group: {
                _id: null,
                totalInterviews: { $sum: 1 },
                avgScore: { $avg: '$overallScore' },
                totalDuration: { $sum: '$duration' },
                typeBreakdown: { $push: '$config.interviewType' }
            }
        }
    ]);

    // Recent scores for trend
    const recentInterviews = await Interview.find({ userId, status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(10)
        .select('overallScore config.interviewType completedAt');

    // Skill breakdown from reports
    const skillData = await Report.aggregate([
        { $match: { userId } },
        { $unwind: '$skillBreakdown' },
        {
            $group: {
                _id: '$skillBreakdown.skill',
                avgScore: { $avg: '$skillBreakdown.score' },
                count: { $sum: '$skillBreakdown.questionsCount' }
            }
        },
        { $sort: { avgScore: -1 } },
        { $limit: 10 }
    ]);

    // Type distribution
    const typeDistribution = await Interview.aggregate([
        { $match: { userId, status: 'completed' } },
        { $group: { _id: '$config.interviewType', count: { $sum: 1 }, avgScore: { $avg: '$overallScore' } } }
    ]);

    return res.json(new ApiResponse(200, {
        overview: {
            totalInterviews: interviewStats?.totalInterviews || 0,
            averageScore: Math.round(interviewStats?.avgScore || 0),
            totalDuration: interviewStats?.totalDuration || 0,
            streak: req.user.streak || 0
        },
        recentScores: recentInterviews.map(i => ({
            score: i.overallScore,
            type: i.config.interviewType,
            date: i.completedAt
        })),
        skillBreakdown: skillData.map(s => ({
            skill: s._id,
            score: Math.round(s.avgScore),
            count: s.count
        })),
        typeDistribution: typeDistribution.map(t => ({
            type: t._id,
            count: t.count,
            avgScore: Math.round(t.avgScore)
        }))
    }, 'Stats overview'));
});
