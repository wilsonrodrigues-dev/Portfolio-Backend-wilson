import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import Media from '../models/Media';
import { sendSuccess, sendError } from '../utils/response';

export async function uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      sendError(res, 'No file uploaded.', 400);
      return;
    }

    const relativePath = `uploads/images/${req.file.filename}`;
    const url = `/${relativePath}`;

    const media = await Media.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url,
      path: relativePath,
      altText: req.body.altText,
      caption: req.body.caption,
    });

    sendSuccess(res, media, 'Image uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function uploadMultipleImages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      sendError(res, 'No files uploaded.', 400);
      return;
    }

    const mediaItems = await Promise.all(
      files.map((file) => {
        const relativePath = `uploads/images/${file.filename}`;
        const url = `/${relativePath}`;
        return Media.create({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url,
          path: relativePath,
        });
      })
    );

    sendSuccess(res, mediaItems, 'Files uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function getMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      Media.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Media.countDocuments(),
    ]);

    sendSuccess(res, media, 'Media retrieved', 200, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      sendError(res, 'Media not found.', 404);
      return;
    }

    // Delete local file — but only if it resolves inside the uploads directory
    // (guards against a tampered `path` value escaping the storage root).
    const uploadsRoot = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
    const filePath = path.resolve(process.cwd(), media.path);
    if (filePath.startsWith(uploadsRoot + path.sep)) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      console.warn(`⚠️ Refusing to delete file outside uploads dir: ${media.path}`);
    }

    await Media.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, 'Media deleted successfully');
  } catch (error) {
    next(error);
  }
}
