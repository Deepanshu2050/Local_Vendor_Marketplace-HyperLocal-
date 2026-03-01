import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { Service } from '../models/Service';
import { VendorProfile } from '../models/VendorProfile';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// ─── Create Booking ─────────────────────────
router.post('/', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { vendorId, serviceId, scheduledDate, scheduledTime, notes, address, serviceName, servicePrice } = req.body;

        if (!scheduledDate || !scheduledTime || !address) {
            res.status(400).json({ success: false, message: 'Date, time, and address are required' });
            return;
        }

        let totalAmount = servicePrice || 500;
        let finalVendorId = vendorId;
        let finalServiceId = serviceId;

        // Try to look up real service if valid ObjectId
        if (isValidObjectId(serviceId)) {
            const service = await Service.findById(serviceId);
            if (service) totalAmount = service.price;
        }

        // If vendorId is not a valid ObjectId, try to find any approved vendor
        if (!isValidObjectId(vendorId)) {
            const anyVendor = await VendorProfile.findOne({ verified: 'approved' });
            if (anyVendor) {
                finalVendorId = anyVendor._id.toString();
                // Also get a real service from this vendor
                const anyService = await Service.findOne({ vendorId: anyVendor._id });
                if (anyService) {
                    finalServiceId = anyService._id.toString();
                    totalAmount = anyService.price;
                } else {
                    // Create a placeholder service
                    const newService = await Service.create({
                        vendorId: anyVendor._id,
                        name: serviceName || 'General Service',
                        description: 'Service booking',
                        price: totalAmount,
                        duration: 60,
                        category: anyVendor.categories[0] || 'General',
                    });
                    finalServiceId = newService._id.toString();
                }
            } else {
                res.status(404).json({ success: false, message: 'No vendors available. Please try again later.' });
                return;
            }
        }

        const booking = await Booking.create({
            customerId: req.user._id,
            vendorId: finalVendorId,
            serviceId: finalServiceId,
            scheduledDate, scheduledTime, notes, address,
            totalAmount,
        });

        // Try to increment vendor booking count
        if (isValidObjectId(finalVendorId)) {
            await VendorProfile.findByIdAndUpdate(finalVendorId, { $inc: { totalBookings: 1 } }).catch(() => { });
        }

        const populated = await Booking.findById(booking._id)
            .populate('serviceId')
            .populate({ path: 'vendorId', populate: { path: 'userId', select: 'name' } });

        res.status(201).json({ success: true, data: populated });
    } catch (err) {
        console.error('Create booking error:', err);
        res.status(500).json({ success: false, message: 'Booking failed' });
    }
});

// ─── My Bookings (Customer) ─────────────────
router.get('/my', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.query;
        const filter: any = { customerId: req.user._id };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('serviceId')
            .populate({ path: 'vendorId', populate: { path: 'userId', select: 'name' } })
            .sort({ scheduledDate: -1 });

        res.json({ success: true, data: bookings, total: bookings.length, page: 1, limit: 50, totalPages: 1 });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
});

// ─── Vendor Bookings ────────────────────────
router.get('/vendor', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendor = await VendorProfile.findOne({ userId: req.user._id });
        if (!vendor) { res.status(404).json({ success: false, message: 'Vendor not found' }); return; }

        const { status } = req.query;
        const filter: any = { vendorId: vendor._id };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .populate('serviceId')
            .populate('customerId', 'name email phone')
            .sort({ scheduledDate: -1 });

        res.json({ success: true, data: bookings, total: bookings.length, page: 1, limit: 50, totalPages: 1 });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
});

// ─── Update Booking Status ──────────────────
router.patch('/:id/status', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('serviceId').populate('customerId', 'name');

        if (!booking) { res.status(404).json({ success: false, message: 'Booking not found' }); return; }
        res.json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Status update failed' });
    }
});

// ─── Get Booking by ID ──────────────────────
router.get('/:id', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('serviceId')
            .populate('customerId', 'name email phone')
            .populate({ path: 'vendorId', populate: { path: 'userId', select: 'name' } });

        if (!booking) { res.status(404).json({ success: false, message: 'Booking not found' }); return; }
        res.json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch booking' });
    }
});

export default router;
