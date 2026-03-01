import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    bookingId: mongoose.Types.ObjectId;
    customerId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    rating: number;
    text: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
        customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vendorId: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

reviewSchema.index({ vendorId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
