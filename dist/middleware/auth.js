"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
exports.requireRole = requireRole;
exports.optionalAuth = optionalAuth;
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
function protect(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_1.sendError)(res, 'Access denied. No token provided.', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                (0, response_1.sendError)(res, 'Access token expired. Please refresh.', 401);
                return;
            }
            if (error.name === 'JsonWebTokenError') {
                (0, response_1.sendError)(res, 'Invalid access token.', 401);
                return;
            }
        }
        (0, response_1.sendError)(res, 'Authentication failed.', 401);
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendError)(res, 'Not authenticated.', 401);
            return;
        }
        if (!roles.includes(req.user.role)) {
            (0, response_1.sendError)(res, 'Insufficient permissions.', 403);
            return;
        }
        next();
    };
}
// Attaches req.user when a valid Bearer token is present, otherwise continues
// as anonymous. Used by public list/detail routes so drafts stay hidden from
// anonymous callers while authenticated admins still see everything.
function optionalAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            req.user = (0, jwt_1.verifyAccessToken)(authHeader.split(' ')[1]);
        }
        catch {
            // Invalid/expired token → treat as anonymous; the route may be public.
        }
    }
    next();
}
