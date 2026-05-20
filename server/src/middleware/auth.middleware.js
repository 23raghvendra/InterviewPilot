import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new ApiError(401, 'Authentication required. Please log in.');
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await User.findById(decoded._id).select('-password -refreshToken');

        if (!user) {
            throw new ApiError(401, 'Invalid token. User not found.');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(401, 'Invalid or expired token.');
    }
});

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            throw new ApiError(403, 'You do not have permission to perform this action.');
        }
        next();
    };
};
