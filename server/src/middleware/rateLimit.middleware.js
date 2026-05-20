import rateLimit from 'express-rate-limit';

export const aiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { success: false, message: 'Too many AI requests. Please wait before continuing.' },
    keyGenerator: (req) => req.user?._id?.toString() || req.ip,
    standardHeaders: true,
    legacyHeaders: false
});

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many auth attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

export const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: 'Too many requests. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false
});
