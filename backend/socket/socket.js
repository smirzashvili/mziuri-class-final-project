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

          const unreadCount = await Messages.countDocuments({
            chatRoom: room._id,
            sender: { $ne: userId }, // Not sent by the current user
            readBy: { $ne: userId }, // Not yet read by this user
          });

          return {
            ...room,
            lastMessage: lastMessage || null, 
            unreadCount
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

    socket.on('mark_room_as_read', async ({ chatRoomId, userId }) => {
      try {
        await Messages.updateMany(
          { chatRoom: chatRoomId, readBy: { $ne: userId } },
          { $addToSet: { readBy: userId } }
        );
      } catch (err) {
        console.error("Failed to mark messages as read:", err);
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

        // Check if the other participant is a bot
        const chatRoom = await ChatRoom.findById(data.chatRoomId).populate('participants');
        const botUser = chatRoom.participants.find(p => p.isBot);

        if (botUser && botUser._id.toString() !== data.sender) {
          // Delay response to feel like a real bot
          setTimeout(async () => {
            const botReply = new Messages({
              chatRoom: data.chatRoomId,
              sender: botUser._id,
              message: generateBotReply(data.message),
              createdAt: new Date()
            });
            await botReply.save();

            const botReplyObject = botReply.toObject();
            io.in(data.chatRoomId).emit('receive_message', botReplyObject);
          }, 1000); // 1 second delay
        }

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

    socket.on('get_unread_counts', async (userId) => {
      try {
        const chatRooms = await ChatRoom.find({ participants: userId }).lean();

        const counts = await Promise.all(chatRooms.map(async (room) => {
          const unreadCount = await Messages.countDocuments({
            chatRoom: room._id,
            sender: { $ne: userId },
            readBy: { $ne: userId }
          });

          return unreadCount;
        }));

        const totalUnread = counts.reduce((acc, count) => acc + count, 0);
        socket.emit('unread_counts_data', totalUnread);
      } catch (err) {
        console.error('Failed to get unread counts:', err);
        socket.emit('error', 'Failed to load unread counts.');
      }
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected:', socket.id);
    });
  });
};

const generateBotReply = (userMessage) => {
  const msg = userMessage.toLowerCase();

  if (/^(hi|hello|hey|yo|sup)\b/.test(msg)) {
    return "Hey there! 👋 Ready to chat about music?";
  }

  if (/how are you|how’s it going|what’s up/.test(msg)) {
    return "I'm just tuning my circuits 🎛️ — how can I help you today?";
  }

  if (/genre|style|music type/.test(msg)) {
    return "🎧 I'm into everything from techno to jazz! What's your jam?";
  }

  if (/instrument|gear|setup|equipment/.test(msg)) {
    return "🎸 Gear talk? Count me in! Do you use analog synths or digital setups?";
  }

  if (/recommend|suggest|advise/.test(msg)) {
    return "🎵 Sure! Tell me what kind of vibe you're looking for and I’ll suggest something.";
  }

  if (/favorite|best|top.*song|track|artist/.test(msg)) {
    return "🎤 I don’t play favorites, but I hear Tame Impala and Aphex Twin are quite the legends!";
  }

  if (/beat|loop|tempo|bpm/.test(msg)) {
    return "⏱️ Tempo control is key! Do you prefer chill grooves or fast-paced rhythms?";
  }

  if (/ai|bot|who.*you|what.*you/.test(msg)) {
    return "🤖 I’m MelodyMatch Bot – your AI buddy for all things music. Ask me anything!";
  }

  // Fallback replies – randomize a bit
  const defaultReplies = [
    "🎶 I’m always down to chat music. What’s on your mind?",
    "🎹 Curious about something? I’ve got ideas!",
    "💬 Music talk? Let’s go! Ask me anything.",
    "📀 I live for sound. Got questions about genres, gear, or production?",
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
};


export default initializeSocket;