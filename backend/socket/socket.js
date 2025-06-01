// src/sockets/chatSocket.js
import Messages from '../models/messages.js';
import ChatRoom from '../models/chatRooms.js'; // Import your new ChatRoom model

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    // When client selects a match to chat with
    socket.on('select_match', async ({ userId, matchId }) => {
      try {
        // Find or create chat room between the two users
        let chatRoom = await ChatRoom.findOne({
          participants: { $all: [userId, matchId] }
        });

        console.log(chatRoom)

        if (!chatRoom) {
          chatRoom = new ChatRoom({ participants: [userId, matchId] });
          await chatRoom.save();
        }

        // Join socket room for that chatRoom
        socket.join(chatRoom._id.toString());

        // Fetch last 100 messages for this chatRoom
        const messages = await Messages.find({ chatRoom: chatRoom._id })
          .sort({ createdAt: 1 })
          // .limit(100);

        // Send chat history only to this client
        socket.emit('chat_history', { chatRoomId: chatRoom._id, messages });

      } catch (error) {
        console.error('Error selecting match/chatRoom:', error);
        socket.emit('error', 'Failed to load chat room.');
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
        io.to(data.chatRoomId).emit('receive_message', newMessage);
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