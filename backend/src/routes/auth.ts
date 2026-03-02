import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { VendorProfile } from '../models/VendorProfile';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── Register ───────────────────────────────
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword, phone, role: role || 'customer' });

        // Auto-create vendor profile if vendor role
        if (role === 'vendor') {
            await VendorProfile.create({
                userId: user._id,
                businessName: name,
                location: { type: 'Point', coordinates: [0, 0] },
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string & jwt.SignOptions['expiresIn'],
        } as jwt.SignOptions);

        const userObj = user.toObject();
        const { password: _, ...userWithoutPassword } = userObj;

        res.status(201).json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

// ─── Login ──────────────────────────────────
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string & jwt.SignOptions['expiresIn'],
        } as jwt.SignOptions);

        const userObj = user.toObject();
        const { password: _, ...userWithoutPassword } = userObj;

        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// ─── Get Profile ────────────────────────────
router.get('/profile', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({ success: true, data: req.user });
});

// ─── Update Profile ─────────────────────────
router.put('/profile', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const updates = req.body;
        delete updates.password;
        delete updates.role;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
});

export default router;
