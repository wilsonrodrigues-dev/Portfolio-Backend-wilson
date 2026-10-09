import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  title: string;
  organization: string;
  type: 'education' | 'work' | 'certification' | 'achievement' | 'hackathon';
  description: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  technologies: string[];
  location?: string;
  url?: string;
  achievement?: string;
  order: number;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true,
      maxlength: [200, 'Organization cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: ['education', 'work', 'certification', 'achievement', 'hackathon'],
      required: [true, 'Type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    current: {
      type: Boolean,
      default: false,
    },
    technologies: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    achievement: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ExperienceSchema.index({ type: 1, order: 1 });
ExperienceSchema.index({ startDate: -1 });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
