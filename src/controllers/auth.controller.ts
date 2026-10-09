import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    // Reject non-string payloads (?email[$gt]=... style operator injection and
    // accidental 500s from .toLowerCase() on objects/arrays).
    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email ||
      !password
    ) {
      sendError(res, 'Email and password are required.', 400);
      return;
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
    if (!user) {
      sendError(res, 'Invalid credentials.', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid credentials.', 401);
      return;
    }

    const payload = { userId: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    if (!user.refreshTokens) user.refreshTokens = [];
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

    sendSuccess(res, {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Cookie only: the refresh token must never be accepted in the request
    // body (single credential channel; frontend never sends it).
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      sendError(res, 'Refresh token not provided.', 401);
      return;
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      sendError(res, 'Invalid or expired refresh token.', 401);
      return;
    }

    const user = await User.findById(decoded.userId).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      sendError(res, 'Refresh token not found or revoked.', 401);
      return;
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    const newAccessToken = generateAccessToken({
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

    sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed');
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.userId).select('+refreshTokens');
        if (user) {
          user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
          await user.save();
        }
      } catch {
        // Token may already be invalid, that's fine
      }
    }

    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      sendError(res, 'User not found.', 404);
      return;
    }
    sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
}
