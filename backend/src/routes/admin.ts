import { Router, Response } from 'express';
import { User } from '../models/User';
import { VendorProfile } from '../models/VendorProfile';
import { Booking } from '../models/Booking';
import { auth, AuthRequest, adminOnly } from '../middleware/auth';

const router = Router();

// ─── Platform Analytics ─────────────────────
router.get('/analytics', auth, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalUsers, totalVendors, activeVendors, pendingApprovals, totalBookings, bookingsToday] =
            await Promise.all([
                User.countDocuments(),
                VendorProfile.countDocuments(),
                VendorProfile.countDocuments({ verified: 'approved' }),
                VendorProfile.countDocuments({ verified: 'pending' }),
                Booking.countDocuments(),
                Booking.countDocuments({ createdAt: { $gte: today } }),
            ]);

        const revenueResult = await Booking.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        const todayRevResult = await Booking.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalVendors,
                activeVendors,
                pendingApprovals,
                totalBookings,
                bookingsToday,
                totalRevenue: revenueResult[0]?.total || 0,
                revenueToday: todayRevResult[0]?.total || 0,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
    }
});

// ─── Approve Vendor ─────────────────────────
router.post('/vendors/:id/approve', auth, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendor = await VendorProfile.findByIdAndUpdate(
            req.params.id,
            { verified: 'approved' },
            { new: true }
        );
        if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
        res.json({ success: true, data: vendor });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Approval failed' });
    }
});

// ─── Reject Vendor ──────────────────────────
router.post('/vendors/:id/reject', auth, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendor = await VendorProfile.findByIdAndUpdate(
            req.params.id,
            { verified: 'rejected' },
            { new: true }
        );
        if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }
        res.json({ success: true, data: vendor });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Rejection failed' });
    }
});

// ─── Get Pending Vendors ────────────────────
router.get('/vendors/pending', auth, adminOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendors = await VendorProfile.find({ verified: 'pending' })
            .populate('userId', 'name email phone');
        res.json({ success: true, data: vendors });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch vendors' });
    }
});

export default router;
