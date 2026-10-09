import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  featured: boolean;
  coverImage?: string;
  gallery: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  problem?: string;
  solution?: string;
  features: string[];
  architecture?: string;
  outcome?: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
    },
    gallery: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    problem: {
      type: String,
    },
    solution: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
    architecture: {
      type: String,
    },
    outcome: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ published: 1, order: 1 });
ProjectSchema.index({ featured: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);
