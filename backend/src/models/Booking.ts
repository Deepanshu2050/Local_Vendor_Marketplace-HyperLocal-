import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    customerId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    scheduledDate: string;
    scheduledTime: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
    totalAmount: number;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vendorId: { type: Schema.Types.ObjectId, ref: 'VendorProfile', required: true },
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
        scheduledDate: { type: String, required: true },
        scheduledTime: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: String,
        totalAmount: { type: Number, required: true },
        address: { type: String, required: true },
    },
    { timestamps: true }
);

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ vendorId: 1, status: 1 });
bookingSchema.index({ scheduledDate: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
