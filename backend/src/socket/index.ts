import { Server, Socket } from 'socket.io';

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Join a room (for 1-on-1 chat)
        socket.on('join-room', (roomId: string) => {
            socket.join(roomId);
            console.log(`${socket.id} joined room: ${roomId}`);
        });

        // Send message
        socket.on('send-message', (data: { roomId: string; message: any }) => {
            socket.to(data.roomId).emit('receive-message', data.message);
        });

        // Typing indicator
        socket.on('typing', (data: { roomId: string; userId: string }) => {
            socket.to(data.roomId).emit('typing', { userId: data.userId });
        });

        // Stop typing
        socket.on('stop-typing', (data: { roomId: string; userId: string }) => {
            socket.to(data.roomId).emit('stop-typing', { userId: data.userId });
        });

        // Booking status update notification
        socket.on('booking-update', (data: { userId: string; booking: any }) => {
            io.to(data.userId).emit('booking-update', data.booking);
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
