import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    vendorId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    isActive: boolean;
    createdAt: Date;
}

const serviceSchema = new Schema<IService>(
    {
        vendorId: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        price: { type: Number, required: true, min: 0 },
        duration: { type: Number, required: true, min: 1 },
        category: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

serviceSchema.index({ vendorId: 1 });

export const Service = mongoose.model<IService>('Service', serviceSchema);
