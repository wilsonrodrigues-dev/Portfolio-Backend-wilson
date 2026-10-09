"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
exports.generateSlug = generateSlug;
exports.getPaginationParams = getPaginationParams;
function sendSuccess(res, data, message = 'Success', statusCode = 200, meta) {
    const response = { success: true, data, message };
    if (meta)
        response.meta = meta;
    return res.status(statusCode).json(response);
}
function sendError(res, message, statusCode = 400, errors) {
    const response = { success: false, message };
    if (errors)
        response.errors = errors;
    return res.status(statusCode).json(response);
}
function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
function getPaginationParams(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
