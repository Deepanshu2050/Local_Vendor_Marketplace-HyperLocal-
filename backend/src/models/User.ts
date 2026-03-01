import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'customer' | 'vendor' | 'admin';
    avatar?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number];
    };
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        phone: { type: String, required: true },
        role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
        avatar: String,
        location: {
            type: { type: String, enum: ['Point'], default: 'Point' },
            coordinates: { type: [Number], default: [0, 0] },
        },
        address: String,
    },
    { timestamps: true }
);

userSchema.index({ location: '2dsphere' });
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
