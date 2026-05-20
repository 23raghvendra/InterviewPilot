import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

const generateTokens = async (user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, targetRole, skills } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, 'Name, email, and password are required.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, 'User with this email already exists.');
    }

    const user = await User.create({ name, email, password, targetRole, skills });
    const { accessToken, refreshToken } = await generateTokens(user);

    const userData = await User.findById(user._id);

    return res
        .status(201)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
        .json(new ApiResponse(201, { user: userData, accessToken }, 'Registration successful'));
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required.');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password.');
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    const userData = await User.findById(user._id);

    return res
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
        .json(new ApiResponse(200, { user: userData, accessToken }, 'Login successful'));
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    return res
        .clearCookie('accessToken', cookieOptions)
        .clearCookie('refreshToken', cookieOptions)
        .json(new ApiResponse(200, {}, 'Logout successful'));
});

// POST /api/auth/refresh-token
export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Refresh token required.');
    }

    try {
        const decoded = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select('+refreshToken');

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'Invalid refresh token.');
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        return res
            .cookie('accessToken', accessToken, cookieOptions)
            .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 })
            .json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token.');
    }
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
    return res.json(new ApiResponse(200, { user: req.user }, 'User profile'));
});

// PATCH /api/auth/update-profile
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, targetRole, targetCompanies, skills, avatar } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (targetRole !== undefined) updates.targetRole = targetRole;
    if (targetCompanies) updates.targetCompanies = targetCompanies;
    if (skills) updates.skills = skills;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    return res.json(new ApiResponse(200, { user }, 'Profile updated'));
});

// POST /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, 'Current and new passwords are required.');
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, 'New password must be at least 6 characters.');
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
        throw new ApiError(400, 'Current password is incorrect.');
    }

    user.password = newPassword;
    await user.save();

    return res.json(new ApiResponse(200, {}, 'Password changed successfully'));
});
