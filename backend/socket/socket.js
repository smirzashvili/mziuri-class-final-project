import Messages from '../models/messages.js';
import ChatRoom from '../models/chatRooms.js'; 

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('get_all_chatrooms', async (userId) => {
      try {
        const chatRooms = await ChatRoom.find({ participants: userId })
          .populate('participants', 'fullName _id')
          .lean();

        const chatRoomsWithMessages = await Promise.all(chatRooms.map(async (room) => {
          const messages = await Messages.find({ chatRoom: room._id })
            .sort({ createdAt: 1 })
            .lean(); // Ensure messages are also lean objects
          return {
            ...room,
            messages,
          };
        }));
        socket.emit('all_chatrooms_data', chatRoomsWithMessages);
      } catch (err) {
        console.error('Failed to get all chatrooms:', err);
        socket.emit('error', 'Failed to load chatrooms.');
      }
    });

    // Handler for client joining multiple rooms
    socket.on('join_rooms', (roomIds) => {
      if (Array.isArray(roomIds)) {
        roomIds.forEach(roomId => {
          socket.join(roomId);
          console.log(`Socket ${socket.id} joined room ${roomId}`);
        });
      } else {
        console.error('join_rooms expected an array of room IDs, received:', roomIds);
      }
    });

    socket.on('send_message', async (data) => {
      try {
        const newMessage = new Messages({
          chatRoom: data.chatRoomId,
          sender: data.sender,
          message: data.message,
          createdAt: new Date()
        });
        await newMessage.save();

        const savedMessageObject = newMessage.toObject(); // Convert to plain object

        // Broadcast to all clients in this chatRoom
        io.in(data.chatRoomId).emit('receive_message', savedMessageObject); // Emit the plain object
      } catch (error) {
        console.error('Error saving/broadcasting message:', error);
        socket.emit('error', 'Failed to send message.');
      }
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
      // Socket.IO automatically handles leaving rooms the socket was in upon disconnect.
    });
  });
};

export default initializeSocket;