import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorProfile extends Document {
    userId: mongoose.Types.ObjectId;
    businessName: string;
    description: string;
    categories: string[];
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    address: string;
    coverImage?: string;
    gallery: string[];
    averageRating: number;
    totalReviews: number;
    totalBookings: number;
    verified: 'pending' | 'approved' | 'rejected';
    availability: Record<string, { start: string; end: string }[]>;
    createdAt: Date;
    updatedAt: Date;
}

const vendorProfileSchema = new Schema<IVendorProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        businessName: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        categories: [{ type: String }],
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], required: true },
        },
        address: { type: String, default: '' },
        coverImage: String,
        gallery: [String],
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 },
        totalBookings: { type: Number, default: 0 },
        verified: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        availability: {
            type: Schema.Types.Mixed,
            default: {
                monday: [], tuesday: [], wednesday: [], thursday: [],
                friday: [], saturday: [], sunday: [],
            },
        },
    },
    { timestamps: true }
);

vendorProfileSchema.index({ location: '2dsphere' });
vendorProfileSchema.index({ categories: 1 });
vendorProfileSchema.index({ verified: 1 });
vendorProfileSchema.index({ averageRating: -1 });

export const VendorProfile = mongoose.model<IVendorProfile>('VendorProfile', vendorProfileSchema);
