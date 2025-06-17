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

        const chatRoomsWithLastMessage = await Promise.all(chatRooms.map(async (room) => {
          const lastMessage = await Messages.findOne({ chatRoom: room._id })
            .sort({ createdAt: -1 }) // Most recent first
            .lean();

          return {
            ...room,
            lastMessage: lastMessage || null, // Optional fallback
          };
        }));

        socket.emit('all_chatrooms_data', chatRoomsWithLastMessage);
      } catch (err) {
        console.error('Failed to get chatrooms:', err);
        socket.emit('error', 'Failed to load chatrooms.');
      }
    });

    // Fetch full messages for a specific chat room
    socket.on('get_chat_messages', async (chatRoomId) => {
      try {
        const messages = await Messages.find({ chatRoom: chatRoomId })
          .sort({ createdAt: 1 })
          .lean();

        socket.emit('chat_messages_data', { chatRoomId, messages });
      } catch (err) {
        console.error("Failed to get chat messages:", err);
        socket.emit("error", "Failed to load messages.");
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

    socket.on("delete_chat", async ({ chatRoomId, userId }) => {
      try {
        await Messages.deleteMany({ chatRoom: chatRoomId });
        
        socket.emit("chat_deleted", chatRoomId);
      } catch (err) {
        console.error("Failed to delete chat:", err);
        socket.emit("error", { message: "Failed to delete chat." });
      }
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });
  });
};

export default initializeSocket;