import mongoose, { Document } from 'mongoose';
export interface ISkill extends Document {
    name: string;
    category: string;
    level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    icon?: string;
    order: number;
    visible: boolean;
}
declare const _default: mongoose.Model<ISkill, {}, {}, {}, Document<unknown, {}, ISkill, {}, mongoose.DefaultSchemaOptions> & ISkill & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISkill>;
export default _default;
//# sourceMappingURL=Skill.d.ts.map