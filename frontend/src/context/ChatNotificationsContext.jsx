import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { useUserData } from './UserContext';

const ChatNotificationsContext = createContext();

export const ChatNotificationsProvider = ({ children }) => {
  const { socket } = useSocket();
  const { userData } = useUserData();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const refreshChatRooms = () => {
    if (socket && userData?._id) {
      socket.emit('get_all_chatrooms', userData._id);
    }
  };

  useEffect(() => {
    if (!socket || !userData?._id) return;

    refreshChatRooms();

    const allChatRoomsHandler = (chatRooms) => {
      const totalUnread = chatRooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0);
      setUnreadMessagesCount(totalUnread);
    };

    socket.on('all_chatrooms_data', allChatRoomsHandler);

    // 👇 Real-time: update unread count when new message arrives
    const onMessage = () => {
      refreshChatRooms();
    };

    socket.on('receive_message', onMessage);

    return () => {
      socket.off('all_chatrooms_data', allChatRoomsHandler);
      socket.off('receive_message', onMessage);
    };
  }, [socket, userData]);

  return (
    <ChatNotificationsContext.Provider value={{ unreadMessagesCount, refreshChatRooms }}>
      {children}
    </ChatNotificationsContext.Provider>
  );
};

export const useChatData = () => useContext(ChatNotificationsContext);
