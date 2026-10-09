import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  projectType?: string;
  read: boolean;
  starred: boolean;
  replied: boolean;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [300, 'Subject cannot exceed 300 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    phone: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    starred: {
      type: Boolean,
      default: false,
    },
    replied: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ read: 1, createdAt: -1 });
MessageSchema.index({ createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
