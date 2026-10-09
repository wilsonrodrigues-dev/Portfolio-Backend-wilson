import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IProject, {}, {}, {}, Document<unknown, {}, IProject, {}, mongoose.DefaultSchemaOptions> & IProject & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProject>;
export default _default;
//# sourceMappingURL=Project.d.ts.map