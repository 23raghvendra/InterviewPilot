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

function generateFallbackQuestions({ interviewType, difficulty, domain, totalQuestions }) {
    const questionTemplates = {
        technical: [
            { text: "Explain the difference between REST and GraphQL APIs. When would you choose one over the other?", type: "descriptive", topic: "API Design" },
            { text: "How would you optimize a slow database query? Walk me through your debugging process.", type: "descriptive", topic: "Database" },
            { text: "Describe the concept of microservices architecture. What are its advantages and challenges?", type: "descriptive", topic: "System Design" },
            { text: "Explain how you would implement authentication and authorization in a web application.", type: "descriptive", topic: "Security" },
            { text: "What is the difference between SQL and NoSQL databases? Give examples of when to use each.", type: "descriptive", topic: "Database" },
            { text: "Explain the concept of caching. How would you implement it in a high-traffic application?", type: "descriptive", topic: "Performance" },
            { text: "What are design patterns? Explain any three patterns you have used in your projects.", type: "descriptive", topic: "Design Patterns" },
            { text: "How do you ensure code quality in your projects? What tools and practices do you follow?", type: "descriptive", topic: "Best Practices" },
            { text: "Explain the concept of CI/CD. How would you set up a deployment pipeline?", type: "descriptive", topic: "DevOps" },
            { text: "What is containerization? Explain the benefits of using Docker in development.", type: "descriptive", topic: "DevOps" },
        ],
        behavioral: [
            { text: "Tell me about a time when you had to deal with a difficult team member. How did you handle it?", type: "situational", topic: "Teamwork" },
            { text: "Describe a situation where you had to meet a tight deadline. How did you manage your time?", type: "situational", topic: "Time Management" },
            { text: "Tell me about a project that failed. What did you learn from it?", type: "situational", topic: "Learning" },
            { text: "Describe a time when you had to learn a new technology quickly. How did you approach it?", type: "situational", topic: "Adaptability" },
            { text: "Tell me about a time when you disagreed with your manager. How did you handle it?", type: "situational", topic: "Communication" },
            { text: "Describe a situation where you had to prioritize multiple tasks. How did you decide what to do first?", type: "situational", topic: "Prioritization" },
            { text: "Tell me about your most challenging project. What made it challenging and how did you overcome it?", type: "situational", topic: "Problem Solving" },
            { text: "Describe a time when you received critical feedback. How did you respond?", type: "situational", topic: "Growth Mindset" },
            { text: "Tell me about a time when you had to work with incomplete requirements. How did you proceed?", type: "situational", topic: "Ambiguity" },
            { text: "Describe a situation where you went above and beyond your job responsibilities.", type: "situational", topic: "Initiative" },
        ],
        dsa: [
            { text: "Given an array of integers, find two numbers that add up to a target sum. Explain your approach and time complexity.", type: "coding", topic: "Arrays" },
            { text: "Implement a function to reverse a linked list. Discuss both iterative and recursive approaches.", type: "coding", topic: "Linked Lists" },
            { text: "Given a binary tree, write a function to find its maximum depth. What is the time and space complexity?", type: "coding", topic: "Trees" },
            { text: "Implement a function to detect a cycle in a linked list. Explain the algorithm you would use.", type: "coding", topic: "Linked Lists" },
            { text: "Given a string, find the longest substring without repeating characters. Optimize for time complexity.", type: "coding", topic: "Strings" },
            { text: "Implement a stack that supports push, pop, and getMin operations in O(1) time.", type: "coding", topic: "Stacks" },
            { text: "Given a sorted array, implement binary search. What are the edge cases to consider?", type: "coding", topic: "Binary Search" },
            { text: "Implement a function to merge two sorted arrays. What is the optimal approach?", type: "coding", topic: "Arrays" },
            { text: "Given a matrix of 0s and 1s, find the number of islands. Explain your algorithm.", type: "coding", topic: "Graphs" },
            { text: "Implement a function to validate a binary search tree. What approach would you use?", type: "coding", topic: "Trees" },
        ],
        system_design: [
            { text: "Design a URL shortening service like bit.ly. Discuss the system architecture and database schema.", type: "descriptive", topic: "System Design" },
            { text: "How would you design a real-time chat application? Consider scalability and message delivery.", type: "descriptive", topic: "Real-time Systems" },
            { text: "Design a rate limiter for an API. What algorithms and data structures would you use?", type: "descriptive", topic: "API Design" },
            { text: "How would you design a notification system that can handle millions of users?", type: "descriptive", topic: "Distributed Systems" },
            { text: "Design a file storage service like Dropbox. Consider synchronization and conflict resolution.", type: "descriptive", topic: "Storage Systems" },
            { text: "How would you design a search autocomplete feature? Discuss data structures and caching.", type: "descriptive", topic: "Search Systems" },
            { text: "Design a distributed cache system. How would you handle cache invalidation?", type: "descriptive", topic: "Caching" },
            { text: "How would you design an e-commerce checkout system? Consider payment processing and inventory.", type: "descriptive", topic: "E-commerce" },
            { text: "Design a content delivery network (CDN). How would you optimize for latency?", type: "descriptive", topic: "CDN" },
            { text: "How would you design a logging and monitoring system for a microservices architecture?", type: "descriptive", topic: "Observability" },
        ],
    };

    const templates = questionTemplates[interviewType] || questionTemplates.technical;
    const questions = [];
    
    for (let i = 0; i < Math.min(totalQuestions, templates.length); i++) {
        const template = templates[i];
        questions.push({
            id: `q_${Date.now()}_${i}`,
            text: template.text,
            type: template.type,
            topic: template.topic,
            difficulty: difficulty,
            expectedDuration: 120,
            hints: ["Think about the key concepts involved", "Consider edge cases and trade-offs"],
            keyPoints: ["Clear explanation", "Practical examples", "Understanding of trade-offs"]
        });
    }

    return questions;
}

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

    try {
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
        } catch (parseError) {
            console.warn("Initial JSON parse failed, retrying with stricter instruction...");
            
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
            
            try {
                return JSON.parse(retryCleaned);
            } catch (retryParseError) {
                console.warn("Retry also failed, using fallback questions");
                return generateFallbackQuestions({ interviewType, difficulty, domain, totalQuestions });
            }
        }
    } catch (apiError) {
        console.error("AI API error, using fallback questions:", apiError?.message || apiError);
        return generateFallbackQuestions({ interviewType, difficulty, domain, totalQuestions });
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
