import { Router, Response } from 'express';
import { Review } from '../models/Review';
import { Booking } from '../models/Booking';
import { VendorProfile } from '../models/VendorProfile';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── Create Review (verified booking only) ──
router.post('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { bookingId, vendorId, rating, text } = req.body;

        // Verify the booking exists, is completed, and belongs to the user
        const booking = await Booking.findOne({
            _id: bookingId,
            customerId: req.user._id,
            status: 'completed',
        });

        if (!booking) {
            res.status(400).json({ success: false, message: 'Can only review completed bookings' });
            return;
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ bookingId });
        if (existingReview) {
            res.status(400).json({ success: false, message: 'Booking already reviewed' });
            return;
        }

        const review = await Review.create({
            bookingId, customerId: req.user._id, vendorId, rating, text,
        });

        // Update vendor average rating
        const reviews = await Review.find({ vendorId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await VendorProfile.findByIdAndUpdate(vendorId, {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length,
        });

        const populated = await Review.findById(review._id).populate('customerId', 'name avatar');
        res.status(201).json({ success: true, data: populated });
    } catch (err) {
        console.error('Create review error:', err);
        res.status(500).json({ success: false, message: 'Review failed' });
    }
});

// ─── Get Vendor Reviews ─────────────────────
router.get('/vendor/:vendorId', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { page = 1 } = req.query;
        const limit = 20;
        const skip = (parseInt(page as string) - 1) * limit;

        const reviews = await Review.find({ vendorId: req.params.vendorId })
            .populate('customerId', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ vendorId: req.params.vendorId });

        res.json({
            success: true,
            data: reviews,
            total,
            page: parseInt(page as string),
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
});

export default router;
