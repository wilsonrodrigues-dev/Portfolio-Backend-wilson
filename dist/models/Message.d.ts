import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    projectType?: string;
    read: boolean;
    starred: boolean;
    replied: boolean;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMessage, {}, {}, {}, Document<unknown, {}, IMessage, {}, mongoose.DefaultSchemaOptions> & IMessage & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMessage>;
export default _default;
//# sourceMappingURL=Message.d.ts.map