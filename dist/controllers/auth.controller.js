"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.getMe = getMe;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, response_1.sendError)(res, 'Email and password are required.', 400);
            return;
        }
        // Find user with password
        const user = await User_1.default.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
        if (!user) {
            (0, response_1.sendError)(res, 'Invalid credentials.', 401);
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            (0, response_1.sendError)(res, 'Invalid credentials.', 401);
            return;
        }
        const payload = { userId: user._id.toString(), email: user.email, role: user.role };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        // Store refresh token
        if (!user.refreshTokens)
            user.refreshTokens = [];
        user.refreshTokens.push(refreshToken);
        // Keep only last 5 refresh tokens
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }
        await user.save();
        // Set refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        (0, response_1.sendSuccess)(res, {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        }, 'Login successful');
    }
    catch (error) {
        next(error);
    }
}
async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!refreshToken) {
            (0, response_1.sendError)(res, 'Refresh token not provided.', 401);
            return;
        }
        let decoded;
        try {
            decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            (0, response_1.sendError)(res, 'Invalid or expired refresh token.', 401);
            return;
        }
        const user = await User_1.default.findById(decoded.userId).select('+refreshTokens');
        if (!user || !user.refreshTokens.includes(refreshToken)) {
            (0, response_1.sendError)(res, 'Refresh token not found or revoked.', 401);
            return;
        }
        // Rotate refresh token
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        user.refreshTokens.push(newRefreshToken);
        await user.save();
        const newAccessToken = (0, jwt_1.generateAccessToken)({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        (0, response_1.sendSuccess)(res, { accessToken: newAccessToken }, 'Token refreshed');
    }
    catch (error) {
        next(error);
    }
}
async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (refreshToken) {
            try {
                const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
                const user = await User_1.default.findById(decoded.userId).select('+refreshTokens');
                if (user) {
                    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
                    await user.save();
                }
            }
            catch {
                // Token may already be invalid, that's fine
            }
        }
        res.clearCookie('refreshToken');
        (0, response_1.sendSuccess)(res, null, 'Logged out successfully');
    }
    catch (error) {
        next(error);
    }
}
async function getMe(req, res, next) {
    try {
        const user = await User_1.default.findById(req.user?.userId);
        if (!user) {
            (0, response_1.sendError)(res, 'User not found.', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        });
    }
    catch (error) {
        next(error);
    }
}
