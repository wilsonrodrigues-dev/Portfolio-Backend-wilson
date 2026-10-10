"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
exports.uploadMultipleImages = uploadMultipleImages;
exports.getMedia = getMedia;
exports.deleteMedia = deleteMedia;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Media_1 = __importDefault(require("../models/Media"));
const response_1 = require("../utils/response");
async function uploadImage(req, res, next) {
    try {
        if (!req.file) {
            (0, response_1.sendError)(res, 'No file uploaded.', 400);
            return;
        }
        const relativePath = `uploads/images/${req.file.filename}`;
        const url = `/${relativePath}`;
        const media = await Media_1.default.create({
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url,
            path: relativePath,
            altText: req.body.altText,
            caption: req.body.caption,
        });
        (0, response_1.sendSuccess)(res, media, 'Image uploaded successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
async function uploadMultipleImages(req, res, next) {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            (0, response_1.sendError)(res, 'No files uploaded.', 400);
            return;
        }
        const mediaItems = await Promise.all(files.map((file) => {
            const relativePath = `uploads/images/${file.filename}`;
            const url = `/${relativePath}`;
            return Media_1.default.create({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url,
                path: relativePath,
            });
        }));
        (0, response_1.sendSuccess)(res, mediaItems, 'Files uploaded successfully', 201);
    }
    catch (error) {
        next(error);
    }
}
async function getMedia(req, res, next) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);
        const skip = (page - 1) * limit;
        const [media, total] = await Promise.all([
            Media_1.default.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Media_1.default.countDocuments(),
        ]);
        (0, response_1.sendSuccess)(res, media, 'Media retrieved', 200, {
            page, limit, total, pages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        next(error);
    }
}
async function deleteMedia(req, res, next) {
    try {
        const media = await Media_1.default.findById(req.params.id);
        if (!media) {
            (0, response_1.sendError)(res, 'Media not found.', 404);
            return;
        }
        // Delete local file — but only if it resolves inside the uploads directory
        // (guards against a tampered `path` value escaping the storage root).
        const uploadsRoot = path_1.default.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
        const filePath = path_1.default.resolve(process.cwd(), media.path);
        if (filePath.startsWith(uploadsRoot + path_1.default.sep)) {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        else {
            console.warn(`⚠️ Refusing to delete file outside uploads dir: ${media.path}`);
        }
        await Media_1.default.findByIdAndDelete(req.params.id);
        (0, response_1.sendSuccess)(res, null, 'Media deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
