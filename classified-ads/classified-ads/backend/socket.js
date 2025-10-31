const Message = require('./models/Message');
const mongoose = require('mongoose');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a chat room
    socket.on('joinRoom', ({ room }) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    // Handle sending message
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, receiver, content, room } = data;

        // Validate required fields
        if (!sender || !receiver || !content || !room) {
          console.error('Missing required fields:', { sender, receiver, content, room });
          socket.emit('error', { message: 'Missing required fields' });
          return;
        }

        // Convert sender and receiver to ObjectId if they're strings
        const senderId = typeof sender === 'string' ? new mongoose.Types.ObjectId(sender) : sender;
        const receiverId = typeof receiver === 'string' ? new mongoose.Types.ObjectId(receiver) : receiver;

        // Save message to database
        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content,
          room,
        });

        // Populate sender and receiver info for display
        await message.populate('sender', 'name');
        await message.populate('receiver', 'name');

        // Emit to room with complete message object
        io.to(room).emit('receiveMessage', {
          _id: message._id,
          sender: message.sender,
          receiver: message.receiver,
          content: message.content,
          timestamp: message.timestamp,
          room: message.room,
        });

        console.log('Message sent successfully:', message._id);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message', error: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
