import mongoose, { Document } from 'mongoose';
export interface ITestimonial extends Document {
    name: string;
    role: string;
    organization: string;
    message: string;
    avatar?: string;
    published: boolean;
    order: number;
}
declare const _default: mongoose.Model<ITestimonial, {}, {}, {}, Document<unknown, {}, ITestimonial, {}, mongoose.DefaultSchemaOptions> & ITestimonial & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITestimonial>;
export default _default;
//# sourceMappingURL=Testimonial.d.ts.map