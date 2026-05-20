import mongoose from 'mongoose';

const { Schema } = mongoose;

const interviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: String, unique: true, required: true },
    status: {
        type: String,
        enum: ['setup', 'in_progress', 'completed', 'abandoned'],
        default: 'setup'
    },
    config: {
        interviewType: {
            type: String,
            enum: ['technical', 'hr', 'behavioral', 'system_design', 'dsa', 'mixed'],
            required: true
        },
        difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
        domain: String,
        company: String,
        role: String,
        totalQuestions: { type: Number, default: 10, min: 3, max: 20 },
        timePerQuestion: { type: Number, default: 120 },
        enableVoice: { type: Boolean, default: false },
        language: { type: String, default: 'english' }
    },
    questions: [{
        questionId: String,
        questionText: String,
        questionType: { type: String, enum: ['mcq', 'descriptive', 'coding', 'situational'] },
        difficulty: String,
        topic: String,
        hints: [String],
        keyPoints: [String],
        expectedDuration: Number,
        userAnswer: { type: String, default: '' },
        codeAnswer: { type: String, default: '' },
        aiFeedback: {
            score: { type: Number, min: 0, max: 10 },
            grade: String,
            strengths: [String],
            weaknesses: [String],
            idealAnswer: String,
            keyPointsCovered: [String],
            keyPointsMissed: [String],
            detailedFeedback: String,
            followUpQuestion: String,
            improvementTip: String
        },
        timeTaken: Number,
        skipped: { type: Boolean, default: false },
        answeredAt: Date
    }],
    overallScore: { type: Number, min: 0, max: 100 },
    reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
    startedAt: Date,
    completedAt: Date,
    duration: Number,
    metadata: {
        userAgent: String,
        ipAddress: String
    }
}, { timestamps: true });

// Indexes for performance
interviewSchema.index({ userId: 1, createdAt: -1 });
interviewSchema.index({ status: 1, userId: 1 });

export const Interview = mongoose.model('Interview', interviewSchema);
