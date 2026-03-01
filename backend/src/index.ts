import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import vendorRoutes from './routes/vendors';
import bookingRoutes from './routes/bookings';
import reviewRoutes from './routes/reviews';
import chatRoutes from './routes/chat';
import adminRoutes from './routes/admin';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
});

// ─── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ───────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Socket.IO ──────────────────────────────
setupSocket(io);

// ─── Database & Server ──────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/local-vendor-marketplace';

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('✓ MongoDB connected');
        server.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ API: http://localhost:${PORT}/api`);
            console.log(`✓ Socket.IO: ws://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('✗ MongoDB connection failed:', err.message);
        process.exit(1);
    });

export { app, server, io };
