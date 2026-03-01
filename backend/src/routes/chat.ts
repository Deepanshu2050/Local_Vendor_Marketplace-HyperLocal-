import { Router, Response } from 'express';
import { ChatMessage } from '../models/ChatMessage';
import { User } from '../models/User';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── Get Chat Threads ───────────────────────
router.get('/threads', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;

        // Get distinct conversation partners
        const sent = await ChatMessage.distinct('receiverId', { senderId: userId });
        const received = await ChatMessage.distinct('senderId', { receiverId: userId });
        const partnerIds = [...new Set([...sent, ...received].map(String))];

        const threads = await Promise.all(
            partnerIds.map(async (partnerId) => {
                const lastMessage = await ChatMessage.findOne({
                    $or: [
                        { senderId: userId, receiverId: partnerId },
                        { senderId: partnerId, receiverId: userId },
                    ],
                }).sort({ createdAt: -1 });

                const unreadCount = await ChatMessage.countDocuments({
                    senderId: partnerId, receiverId: userId, read: false,
                });

                const participant = await User.findById(partnerId).select('name email avatar role');

                return {
                    _id: partnerId,
                    participant,
                    lastMessage,
                    unreadCount,
                };
            })
        );

        // Sort by last message time
        threads.sort((a, b) => {
            const aTime = a.lastMessage?.createdAt?.getTime() || 0;
            const bTime = b.lastMessage?.createdAt?.getTime() || 0;
            return bTime - aTime;
        });

        res.json({ success: true, data: threads });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch threads' });
    }
});

// ─── Get Messages with User ─────────────────
router.get('/:userId', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { page = 1 } = req.query;
        const limit = 50;
        const skip = (parseInt(page as string) - 1) * limit;

        const messages = await ChatMessage.find({
            $or: [
                { senderId: req.user._id, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.user._id },
            ],
        })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);

        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
});

// ─── Send Message ───────────────────────────
router.post('/send', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { receiverId, content } = req.body;
        const message = await ChatMessage.create({
            senderId: req.user._id, receiverId, content,
        });
        res.status(201).json({ success: true, data: message });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send message' });
    }
});

// ─── Mark as Read ───────────────────────────
router.patch('/:userId/read', auth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await ChatMessage.updateMany(
            { senderId: req.params.userId, receiverId: req.user._id, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to mark as read' });
    }
});

export default router;
