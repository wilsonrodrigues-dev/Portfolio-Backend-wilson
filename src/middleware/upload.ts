import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  // Validate BOTH the client-declared MIME type and the filename extension.
  // The stored file keeps its extension and is served statically, so an
  // arbitrary extension (.html/.js/...) with an allowed MIME header would be a
  // stored-XSS vector on the API origin.
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    const error = new Error(
      `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    ) as Error & { statusCode?: number };
    error.statusCode = 400;
    cb(error);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
});
