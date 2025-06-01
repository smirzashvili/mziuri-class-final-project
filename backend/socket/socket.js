// src/sockets/chatSocket.js
import Messages from '../models/messages.js';
import ChatRoom from '../models/chatRooms.js'; // Import your new ChatRoom model

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    // Get all chat rooms and messages for current user
    socket.on('get_all_chatrooms', async (userId) => {
      try {
        // Get all chat rooms the user is in
        const chatRooms = await ChatRoom.find({ participants: userId })
          .populate('participants', 'fullName _id') // select specific fields
          .lean(); // convert to plain JS objects

        // For each chat room, get its messages
        const chatRoomsWithMessages = await Promise.all(chatRooms.map(async (room) => {
          const messages = await Messages.find({ chatRoom: room._id }).sort({ createdAt: 1 });

          return {
            ...room,
            messages,
          };
        }));

        // Send back to client
        socket.emit('all_chatrooms_data', chatRoomsWithMessages);
      } catch (err) {
        console.error('Failed to get all chatrooms:', err);
        socket.emit('error', 'Failed to load chatrooms.');
      }
    });


    // Handle incoming message in a chatRoom
    socket.on('send_message', async (data) => {
      // data = { chatRoomId, sender, message }
      try {
        const newMessage = new Messages({
          chatRoom: data.chatRoomId,
          sender: data.sender,
          message: data.message,
          createdAt: new Date()
        });
        await newMessage.save();

        // Broadcast to all clients in this chatRoom
        io.in(data.chatRoomId).emit('receive_message', newMessage);
      } catch (error) {
        console.error('Error saving/broadcasting message:', error);
        socket.emit('error', 'Failed to send message.');
      }
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });
  });
};

export default initializeSocket;