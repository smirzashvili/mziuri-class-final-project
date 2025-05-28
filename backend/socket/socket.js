// src/sockets/chatSocket.js
import Messages from '../models/messages.js'; // Import your Messages model

const initializeSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('get_chat_history', async () => {
        try {
            const messages = await Messages.find().sort({ createdAt: 1 }).limit(100);
            socket.emit('chat_history', messages);
        } catch (error) {
            console.error('Error fetching chat history:', error);
            socket.emit('error', 'Failed to load chat history.');
        }
    });

    // Handle incoming messages from clients
    socket.on('send_message', async (data) => {
      console.log('Received message from client:', data);
      try {
        // Create a new message instance using the Mongoose model
        const newMessage = new Messages({
          sender: data.sender,
          message: data.message,
          // Add createdAt if your schema doesn't auto-generate it
          createdAt: new Date(),
        });
        await newMessage.save(); // Save the message to the database
        console.log('Message saved to DB:', newMessage);

        // Broadcast the new message to all connected clients
        io.emit('receive_message', newMessage); // Send the saved message, which includes createdAt
        console.log('Message broadcasted to all clients.');
      } catch (error) {
        console.error('Error saving or broadcasting message:', error);
        // Optionally, emit an error back to the sender
        socket.emit('error', 'Failed to send message.');
      }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });
  });
};

export default initializeSocket;