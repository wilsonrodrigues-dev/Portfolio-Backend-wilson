import mongoose, { Document } from 'mongoose';
export interface IService extends Document {
    title: string;
    description: string;
    icon?: string;
    features: string[];
    order: number;
    visible: boolean;
}
declare const _default: mongoose.Model<IService, {}, {}, {}, Document<unknown, {}, IService, {}, mongoose.DefaultSchemaOptions> & IService & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IService>;
export default _default;
//# sourceMappingURL=Service.d.ts.map