import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('8000'),
    MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
    GEMINI_API_KEY: z.string().min(1, 'Gemini API key is required'),
    JWT_SECRET: z.string().min(10, 'JWT secret must be at least 10 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    REFRESH_TOKEN_SECRET: z.string().min(10),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
