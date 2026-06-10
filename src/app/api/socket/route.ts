import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextRequest } from 'next/server';

// Store for Socket.IO server instance
let io: SocketIOServer | null = null;

// Room management
const rooms = new Map<string, Set<string>>();

export async function GET(req: NextRequest) {
  if (!io) {
    // Initialize Socket.IO server
    const httpServer = (req as any).socket?.server as HTTPServer;
    
    if (httpServer) {
      io = new SocketIOServer(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });

      io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Join room
        socket.on('join-room', ({ roomId, userId, userName }) => {
          socket.join(roomId);
          
          // Add user to room
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId)?.add(userId);

          // Get all users in room
          const roomUsers = Array.from(rooms.get(roomId) || []);
          
          // Send existing users to the new user
          socket.emit('room-users', roomUsers.filter(id => id !== userId));
          
          // Notify others about new user
          socket.to(roomId).emit('user-joined', { userId, userName });

          console.log(`User ${userId} joined room ${roomId}`);
        });

        // Handle WebRTC signaling
        socket.on('signal', ({ signal, to, from, roomId }) => {
          io?.to(roomId).emit('signal', { signal, from });
        });

        // Handle chat messages
        socket.on('send-message', ({ roomId, message, userId, userName }) => {
          io?.to(roomId).emit('receive-message', {
            message,
            userId,
            userName,
            timestamp: new Date().toISOString(),
          });
        });

        // Leave room
        socket.on('leave-room', ({ roomId, userId }) => {
          socket.leave(roomId);
          
          // Remove user from room
          rooms.get(roomId)?.delete(userId);
          
          // If room is empty, delete it
          if (rooms.get(roomId)?.size === 0) {
            rooms.delete(roomId);
          }

          // Notify others
          socket.to(roomId).emit('user-left', { userId });

          console.log(`User ${userId} left room ${roomId}`);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
          
          // Clean up user from all rooms
          rooms.forEach((users, roomId) => {
            users.forEach((userId) => {
              socket.to(roomId).emit('user-left', { userId });
            });
          });
        });
      });
    }
  }

  return new Response('Socket.IO server initialized', { status: 200 });
}

// Made with Bob
