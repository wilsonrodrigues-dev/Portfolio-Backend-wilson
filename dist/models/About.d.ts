import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IAbout, {}, {}, {}, Document<unknown, {}, IAbout, {}, mongoose.DefaultSchemaOptions> & IAbout & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAbout>;
export default _default;
//# sourceMappingURL=About.d.ts.map