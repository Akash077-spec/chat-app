const socketIO = require('socket.io');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // User connection
    socket.on('user-connect', async (userId) => {
      socket.join(userId);
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit('user-status', { userId, status: 'online' });
    });

    // Join chat room
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
    });

    // New message
    socket.on('new-message', async (message) => {
      const savedMessage = await Message.create(message);
      await Chat.findByIdAndUpdate(message.chat, { lastMessage: savedMessage._id });
      io.to(message.chat).emit('message-received', savedMessage);
    });

    // Typing indicator
    socket.on('typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('typing', { userId });
    });

    socket.on('stop-typing', ({ chatId, userId }) => {
      socket.to(chatId).emit('stop-typing', { userId });
    });

    // Message seen
    socket.on('message-seen', async ({ messageId, chatId }) => {
      await Message.findByIdAndUpdate(messageId, { status: 'seen' });
      io.to(chatId).emit('message-status', { messageId, status: 'seen' });
    });

    // User disconnection
    socket.on('disconnect', async () => {
      const userId = socket.userId; // Assume stored during connection
      if (userId) {
        await User.findByIdAndUpdate(userId, { 
          isOnline: false,
          lastSeen: new Date()
        });
        io.emit('user-status', { userId, status: 'offline' });
      }
    });
  });

  return io;
};

module.exports = setupSocket;