const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Room management
const rooms = new Map();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    path: '/api/socket',
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
      rooms.get(roomId).add(userId);

      // Get all users in room
      const roomUsers = Array.from(rooms.get(roomId));
      
      // Send existing users to the new user
      socket.emit('room-users', roomUsers.filter(id => id !== userId));
      
      // Notify others about new user
      socket.to(roomId).emit('user-joined', { userId, userName });

      console.log(`User ${userId} (${userName}) joined room ${roomId}`);
    });

    // Handle WebRTC signaling
    socket.on('signal', ({ signal, to, from, roomId }) => {
      socket.to(roomId).emit('signal', { signal, from });
    });

    // Handle chat messages
    socket.on('send-message', ({ roomId, message, userId, userName }) => {
      io.to(roomId).emit('receive-message', {
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
      if (rooms.has(roomId)) {
        rooms.get(roomId).delete(userId);
        
        // If room is empty, delete it
        if (rooms.get(roomId).size === 0) {
          rooms.delete(roomId);
        }
      }

      // Notify others
      socket.to(roomId).emit('user-left', { userId });

      console.log(`User ${userId} left room ${roomId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running on path: /api/socket`);
    });
});

// Made with Bob
