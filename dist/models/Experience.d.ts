import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IExperience, {}, {}, {}, Document<unknown, {}, IExperience, {}, mongoose.DefaultSchemaOptions> & IExperience & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IExperience>;
export default _default;
//# sourceMappingURL=Experience.d.ts.map