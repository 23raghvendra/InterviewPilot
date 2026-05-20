import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

const isApiKeyConfigured = env.GEMINI_API_KEY && 
    !env.GEMINI_API_KEY.includes('your_') && 
    env.GEMINI_API_KEY.length > 20;

if (!isApiKeyConfigured) {
    console.warn('⚠️  WARNING: Gemini API key is not configured or is using placeholder value.');
    console.warn('   Please set a valid GEMINI_API_KEY in your .env file.');
    console.warn('   Get your API key from: https://aistudio.google.com/apikey');
    console.warn('   AI features will not work until this is configured.');
}

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

function checkApiKey() {
    if (!isApiKeyConfigured) {
        throw new Error('Gemini API key is not configured. Please set a valid GEMINI_API_KEY in your .env file. Get your key from https://aistudio.google.com/apikey');
    }
}

async function generateWithFallback(options) {
    try {
        return await ai.models.generateContent(options);
    } catch (error) {
        console.error("Primary model failed:", error?.message);
        // Fallback to 1.5-flash if 2.5-flash is overloaded
        if (options.model === 'gemini-2.5-flash') {
            console.log("Falling back to gemini-1.5-flash...");
            try {
                return await ai.models.generateContent({ ...options, model: 'gemini-1.5-flash' });
            } catch (fallbackError) {
                console.error("Fallback model also failed:", fallbackError?.message);
                throw fallbackError;
            }
        }
        throw error;
    }
}

// ─────────────────────────────────────────
// 1. GENERATE INTERVIEW QUESTIONS
// ─────────────────────────────────────────
export async function generateQuestions({ interviewType, difficulty, domain, company, role, totalQuestions }) {
    checkApiKey();
    
    const systemPrompt = `You are an expert technical interviewer at top tech companies like Google, Amazon, and Microsoft.
Generate realistic, varied interview questions. Return ONLY valid JSON array. No markdown, no preamble, no explanation.`;

    const userPrompt = `Generate exactly ${totalQuestions} interview questions for:
- Interview Type: ${interviewType}
- Domain: ${domain || 'General'}
- Target Role: ${role || 'Software Engineer'}
- Target Company: ${company || 'Top Tech Company'}
- Difficulty: ${difficulty}

Return a JSON array of objects, each with:
{
  "id": "unique_string_id",
  "text": "question text",
  "type": "descriptive|coding|situational|mcq",
  "topic": "topic name",
  "difficulty": "${difficulty}",
  "expectedDuration": number_in_seconds,
  "hints": ["hint1", "hint2"],
  "keyPoints": ["point1", "point2", "point3"]
}

Guidelines:
- Mix question types realistically
- For coding questions, include problem statement with examples
- For behavioral, use STAR method context
- Difficulty distribution: match requested difficulty
- Topics should cover breadth of ${domain || interviewType}
- Return ONLY the JSON array, nothing else`;

    const response = await generateWithFallback({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 4000,
            temperature: 0.7
        }
    });

    const raw = response.text.trim();
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        // Retry with stricter instruction
        const retryResponse = await generateWithFallback({
            model: 'gemini-2.5-flash',
            contents: `The previous response was not valid JSON. Please return ONLY a valid JSON array for interview questions, no other text.\n\nOriginal request: ${userPrompt}`,
            config: {
                systemInstruction: systemPrompt,
                maxOutputTokens: 4000,
                temperature: 0.5
            }
        });
        const retryRaw = retryResponse.text.trim();
        const retryCleaned = retryRaw.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(retryCleaned);
    }
}

// ─────────────────────────────────────────
// 2. EVALUATE ANSWER
// ─────────────────────────────────────────
export async function evaluateAnswer({ question, userAnswer, interviewType, difficulty }) {
    checkApiKey();
    
    const systemPrompt = `You are a strict but fair technical interviewer. 
Evaluate the candidate's answer honestly. Return ONLY valid JSON. No markdown, no preamble.`;

    const userPrompt = `Question: "${question.text}"
Question Type: ${question.type}
Difficulty: ${difficulty}
Interview Type: ${interviewType}

Candidate's Answer:
"${userAnswer}"

Evaluate and return JSON:
{
  "score": number_0_to_10,
  "grade": "A+|A|B+|B|C|D|F",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "idealAnswer": "concise ideal answer",
  "keyPointsCovered": ["covered point"],
  "keyPointsMissed": ["missed point"],
  "detailedFeedback": "3-4 sentence constructive feedback",
  "followUpQuestion": "a relevant follow-up question",
  "improvementTip": "one actionable tip"
}

Scoring rubric:
- 9-10: Exceptional, production-ready answer
- 7-8: Good, covers most key points
- 5-6: Average, partial understanding
- 3-4: Below average, major gaps
- 0-2: No understanding demonstrated

Return ONLY the JSON object.`;

    const response = await generateWithFallback({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 1500,
            temperature: 0.3
        }
    });

    const raw = response.text.trim();
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        return {
            score: 5,
            grade: 'C',
            strengths: ['Answer provided'],
            weaknesses: ['Could not fully evaluate'],
            idealAnswer: 'Evaluation error occurred',
            keyPointsCovered: [],
            keyPointsMissed: [],
            detailedFeedback: 'There was an error processing the evaluation. Your answer has been recorded.',
            followUpQuestion: '',
            improvementTip: 'Try to be more structured in your answer.'
        };
    }
}

// ─────────────────────────────────────────
// 3. GENERATE FULL REPORT
// ─────────────────────────────────────────
export async function generateReport({ interview, questions }) {
    checkApiKey();
    
    const questionSummaries = questions.map((q, i) => ({
        index: i + 1,
        topic: q.topic,
        type: q.questionType,
        score: q.aiFeedback?.score || 0,
        weaknesses: q.aiFeedback?.weaknesses || [],
        strengths: q.aiFeedback?.strengths || [],
        skipped: q.skipped
    }));

    const userPrompt = `Generate a comprehensive interview performance report.

Interview Config:
- Type: ${interview.config.interviewType}
- Role: ${interview.config.role || 'Software Engineer'}
- Company: ${interview.config.company || 'Tech Company'}
- Difficulty: ${interview.config.difficulty}
- Total Questions: ${interview.config.totalQuestions}

Question Performance Summary:
${JSON.stringify(questionSummaries, null, 2)}

Return ONLY valid JSON:
{
  "summary": {
    "overallScore": number_0_to_100,
    "grade": "A+|A|B+|B|C|D|F",
    "readinessLevel": "not_ready|needs_work|almost_ready|ready",
    "strongAreas": ["area1", "area2"],
    "weakAreas": ["area1", "area2"],
    "recommendation": "2-3 sentence personalized recommendation"
  },
  "skillBreakdown": [
    { "skill": "skill_name", "score": number_0_to_100, "questionsCount": number }
  ],
  "improvementPlan": [
    {
      "topic": "topic_name",
      "priority": "high|medium|low",
      "tip": "specific actionable tip",
      "resources": ["resource suggestion"]
    }
  ],
  "aiGeneratedInsights": "comprehensive 4-6 sentence personalized insight paragraph",
  "peerComparisonPercentile": number_0_to_100
}`;

    const response = await generateWithFallback({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            maxOutputTokens: 3000,
            temperature: 0.4
        }
    });

    const raw = response.text.trim();
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        return {
            summary: {
                overallScore: 0,
                grade: 'F',
                readinessLevel: 'not_ready',
                strongAreas: [],
                weakAreas: ['Report generation failed'],
                recommendation: 'Please try again later.'
            },
            skillBreakdown: [],
            improvementPlan: [],
            aiGeneratedInsights: 'Unable to generate insights at this time.',
            peerComparisonPercentile: 50
        };
    }
}

// ─────────────────────────────────────────
// 4. GENERATE HINT
// ─────────────────────────────────────────
export async function generateHint({ question, userSoFar }) {
    checkApiKey();
    
    const response = await generateWithFallback({
        model: 'gemini-2.5-flash',
        contents: `Give ONE subtle, non-spoiling hint for this interview question without giving the answer away.
Question: "${question.text}"
What candidate has written so far: "${userSoFar || 'Nothing yet'}"
Hint (2-3 sentences max, guiding not telling):`,
        config: {
            maxOutputTokens: 300,
            temperature: 0.6
        }
    });
    return response.text.trim();
}

// ─────────────────────────────────────────
// 5. GENERATE FOLLOW-UP QUESTION
// ─────────────────────────────────────────
export async function generateFollowUp({ question, userAnswer }) {
    checkApiKey();
    
    const response = await generateWithFallback({
        model: 'gemini-2.5-flash',
        contents: `Based on this interview Q&A, generate ONE natural follow-up question an interviewer would ask.
Original Question: "${question.text}"
Candidate Answer: "${userAnswer}"
Follow-up Question (one sentence only):`,
        config: {
            maxOutputTokens: 200,
            temperature: 0.6
        }
    });
    return response.text.trim();
}
