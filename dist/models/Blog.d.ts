import mongoose, { Document } from 'mongoose';
export interface IBlog extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    tags: string[];
    category: string;
    author: string;
    featured: boolean;
    status: 'draft' | 'published' | 'scheduled';
    publishedAt?: Date;
    scheduledFor?: Date;
    seoTitle?: string;
    seoDescription?: string;
    readingTime: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IBlog, {}, {}, {}, Document<unknown, {}, IBlog, {}, mongoose.DefaultSchemaOptions> & IBlog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBlog>;
export default _default;
//# sourceMappingURL=Blog.d.ts.map