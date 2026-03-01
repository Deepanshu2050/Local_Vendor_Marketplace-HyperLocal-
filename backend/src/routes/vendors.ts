import { Router, Response } from 'express';
import { VendorProfile } from '../models/VendorProfile';
import { Service } from '../models/Service';
import { auth, AuthRequest, vendorOnly } from '../middleware/auth';

const router = Router();

// ─── Nearby Vendors (GeoJSON $near) ─────────
router.get('/nearby', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { latitude, longitude, radius = 10, category, search, minRating = 0, sortBy = 'distance', page = 1, limit = 20 } = req.query;

        const lat = parseFloat(latitude as string);
        const lng = parseFloat(longitude as string);
        const radiusKm = parseFloat(radius as string);
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        if (isNaN(lat) || isNaN(lng)) {
            res.status(400).json({ success: false, message: 'Invalid coordinates' });
            return;
        }

        const filter: any = {
            verified: 'approved',
            averageRating: { $gte: parseFloat(minRating as string) },
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lng, lat] },
                    $maxDistance: radiusKm * 1000, // meters
                },
            },
        };

        if (category) filter.categories = category;
        if (search) filter.businessName = { $regex: search, $options: 'i' };

        const vendors = await VendorProfile.find(filter)
            .populate('userId', 'name email phone avatar')
            .skip(skip)
            .limit(parseInt(limit as string));

        const total = await VendorProfile.countDocuments(filter);

        // Populate services for each vendor
        const vendorsWithServices = await Promise.all(
            vendors.map(async (v) => {
                const services = await Service.find({ vendorId: v._id, isActive: true });
                const vendorObj = v.toObject();
                return { ...vendorObj, services, user: vendorObj.userId };
            })
        );

        res.json({
            success: true,
            data: vendorsWithServices,
            total,
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            totalPages: Math.ceil(total / parseInt(limit as string)),
        });
    } catch (err) {
        console.error('Nearby vendors error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch vendors' });
    }
});

// ─── Get Vendor by ID ───────────────────────
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendor = await VendorProfile.findById(req.params.id).populate('userId', 'name email phone avatar');
        if (!vendor) {
            res.status(404).json({ success: false, message: 'Vendor not found' });
            return;
        }
        const services = await Service.find({ vendorId: vendor._id, isActive: true });
        res.json({ success: true, data: { ...vendor.toObject(), services, user: vendor.userId } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch vendor' });
    }
});

// ─── Get Vendor Services ────────────────────
router.get('/:vendorId/services', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const services = await Service.find({ vendorId: req.params.vendorId, isActive: true });
        res.json({ success: true, data: services });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch services' });
    }
});

// ─── Vendor: Update Profile ─────────────────
router.put('/profile', auth, vendorOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendor = await VendorProfile.findOneAndUpdate(
            { userId: req.user._id },
            req.body,
            { new: true }
        );
        res.json({ success: true, data: vendor });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

// ─── Vendor: CRUD Services ──────────────────
router.post('/services', auth, vendorOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const vendor = await VendorProfile.findOne({ userId: req.user._id });
        if (!vendor) { res.status(404).json({ success: false, message: 'Vendor profile not found' }); return; }

        const service = await Service.create({ ...req.body, vendorId: vendor._id });
        res.status(201).json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create service' });
    }
});

router.put('/services/:serviceId', auth, vendorOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.serviceId, req.body, { new: true });
        res.json({ success: true, data: service });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

router.delete('/services/:serviceId', auth, vendorOnly, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await Service.findByIdAndDelete(req.params.serviceId);
        res.json({ success: true, message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
});

export default router;
