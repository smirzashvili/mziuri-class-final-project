import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { useUserData } from './UserContext';

const ChatNotificationsContext = createContext();

export const ChatNotificationsProvider = ({ children }) => {
  const { socket } = useSocket();
  const { userData } = useUserData();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const refreshUnreadCount = () => {
    if (socket && userData?._id) {
      socket.emit('get_unread_counts', userData._id);
    }
  };

  useEffect(() => {
    if (!socket || !userData?._id) return;

    refreshUnreadCount();

    const unreadHandler = (totalUnread) => {
      setUnreadMessagesCount(totalUnread);
    };

    socket.on('unread_counts_data', unreadHandler);

    // 🔄 When message received, trigger refresh
    const onMessage = () => refreshUnreadCount();
    socket.on('receive_message', onMessage);

    return () => {
      socket.off('unread_counts_data', unreadHandler);
      socket.off('receive_message', onMessage);
    };
  }, [socket, userData]);

  return (
    <ChatNotificationsContext.Provider value={{ unreadMessagesCount, refreshUnreadCount }}>
      {children}
    </ChatNotificationsContext.Provider>
  );
};

export const useChatData = () => useContext(ChatNotificationsContext);
