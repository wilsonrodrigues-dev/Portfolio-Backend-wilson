import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
  cloudinaryId?: string;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  uploadedBy?: string;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    altText: {
      type: String,
    },
    caption: {
      type: String,
    },
    uploadedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ mimetype: 1 });

export default mongoose.model<IMedia>('Media', MediaSchema);
