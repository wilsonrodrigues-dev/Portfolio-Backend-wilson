import mongoose, { Document } from 'mongoose';
export interface IMedia extends Document {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    url: string;
    path: string;
    cloudinaryId?: string;
    width?: number;
    height?: number;
    altText?: string;
    caption?: string;
    uploadedBy?: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IMedia, {}, {}, {}, Document<unknown, {}, IMedia, {}, mongoose.DefaultSchemaOptions> & IMedia & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMedia>;
export default _default;
//# sourceMappingURL=Media.d.ts.map