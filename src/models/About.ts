import mongoose, { Document, Schema } from 'mongoose';

export interface IAbout extends Document {
  name: string;
  headline: string;
  subheadline: string;
  bio: string;
  longBio?: string;
  location: string;
  email: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  resumeUrl?: string;
  avatar?: string;
  availableForWork: boolean;
  availabilityNote?: string;
  yearsOfExperience?: number;
  seoTitle?: string;
  seoDescription?: string;
}

const AboutSchema = new Schema<IAbout>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      default: 'Wilson Rodrigues',
    },
    headline: {
      type: String,
      required: [true, 'Headline is required'],
      default: 'Full-Stack Developer',
    },
    subheadline: {
      type: String,
      default: 'Building useful systems from complex ideas.',
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    longBio: {
      type: String,
    },
    location: {
      type: String,
      default: 'Mangaluru, Karnataka, India',
    },
    email: {
      type: String,
      default: 'wilsonrodrigues.dev20@gmail.com',
    },
    phone: {
      type: String,
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/wilsonrodrigues-dev',
    },
    linkedinUrl: {
      type: String,
      default: 'https://linkedin.com/in/wilson-rodrigues-dev',
    },
    twitterUrl: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    avatar: {
      type: String,
    },
    availableForWork: {
      type: Boolean,
      default: true,
    },
    availabilityNote: {
      type: String,
    },
    yearsOfExperience: {
      type: Number,
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAbout>('About', AboutSchema);
