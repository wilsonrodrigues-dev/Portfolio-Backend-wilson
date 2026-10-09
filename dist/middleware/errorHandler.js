"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFound = notFound;
const response_1 = require("../utils/response");
function errorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 422;
        message = 'Validation failed';
        const errors = Object.values(err.errors).map((e) => e.message);
        (0, response_1.sendError)(res, message, statusCode, errors);
        return;
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0];
        message = field ? `A record with this ${field} already exists.` : 'Duplicate entry.';
    }
    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format.';
    }
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired.';
    }
    // Log in development
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', err);
    }
    (0, response_1.sendError)(res, message, statusCode);
}
function notFound(req, res, next) {
    const error = new Error(`Not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}
