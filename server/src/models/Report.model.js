import mongoose from 'mongoose';

const { Schema } = mongoose;

const reportSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    interviewId: { type: Schema.Types.ObjectId, ref: 'Interview', required: true },
    summary: {
        overallScore: Number,
        grade: { type: String, enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'] },
        totalQuestions: Number,
        answered: Number,
        skipped: Number,
        strongAreas: [String],
        weakAreas: [String],
        recommendation: String,
        readinessLevel: { type: String, enum: ['not_ready', 'needs_work', 'almost_ready', 'ready'] }
    },
    skillBreakdown: [{
        skill: String,
        score: Number,
        questionsCount: Number
    }],
    improvementPlan: [{
        topic: String,
        priority: { type: String, enum: ['high', 'medium', 'low'] },
        resources: [String],
        tip: String
    }],
    aiGeneratedInsights: String,
    peerComparison: {
        percentile: Number,
        averageScore: Number
    }
}, { timestamps: true });

// Indexes
reportSchema.index({ userId: 1, createdAt: -1 });
reportSchema.index({ interviewId: 1 }, { unique: true });

export const Report = mongoose.model('Report', reportSchema);
