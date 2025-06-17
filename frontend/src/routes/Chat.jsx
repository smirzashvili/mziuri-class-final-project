import React, { useState, useEffect } from 'react';
import { ChatRoom, UserAvatar } from '../components';
import MessageSend from '../assets/icons/messageSend.svg';
import MessageReceive from '../assets/icons/messageReceive.svg';
import { useUserData } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { formatTimeAgo } from '../utils/textFormat';
import Male1 from '../assets/icons/user/male1.svg';
import { useLocation } from 'react-router-dom';

function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  const activeChatRoom = chatRooms.find(room => room._id === activeChatRoomId);

  const [searchTerm, setSearchTerm] = useState('');
  const [isChatRoomVisible, setIsChatRoomVisible] = useState(true);


  const { userData } = useUserData();
  const { socket } = useSocket();
  const location = useLocation();
  const openWithUserId = location.state?.openWithUserId;

  useEffect(() => {
    if (!socket || !userData?._id) return;

    // Request all chatrooms for the user
    socket.emit('get_all_chatrooms', userData._id);

    // Handler for receiving all chatroom data
    const allChatRoomsHandler = (roomsWithLastMessages) => {
      const sortedRooms = [...roomsWithLastMessages].sort((a, b) => {
        const aTime = new Date(a.lastMessage?.createdAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.lastMessage?.createdAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      });
      
      setChatRooms(prevRooms => {
        const updatedRooms = sortedRooms.map(incomingRoom => {
          const existingRoom = prevRooms.find(r => r._id === incomingRoom._id);

          return {
            ...incomingRoom,
            messages: existingRoom?.messages || [], // Preserve previously loaded messages
          };
        });

        return updatedRooms;
      })

      if (sortedRooms.length > 0) {
        const roomIds = sortedRooms.map(room => room._id);
        socket.emit('join_rooms', roomIds);
      }
    };
    socket.on('all_chatrooms_data', allChatRoomsHandler);

    // Handler for delete chat
    const chatDeletedHandler = (deletedRoomId) => {
      setChatRooms(prev =>
        prev.map(room =>
          room._id === deletedRoomId
            ? { ...room, messages: [], lastMessage: null, unreadCount: 0 }
            : room
        )
      );
    };
    socket.on("chat_deleted", chatDeletedHandler);

    return () => {
      socket.off('all_chatrooms_data', allChatRoomsHandler);
      socket.off("chat_deleted", chatDeletedHandler);
    };
  }, [socket, userData]);

  useEffect(() => {
    if (!socket) return;

    const receiveMessageHandler = (newMessage) => {
      setChatRooms(prev => {
        const updatedRooms = prev.map(room => {
          if (room._id === newMessage.chatRoom) {
            const isActive = room._id === activeChatRoomId;
            const updatedRoom = { ...room };

            if (isActive) {
              updatedRoom.messages = [...(room.messages || []), newMessage];
            } else {
              updatedRoom.unreadCount = (room.unreadCount || 0) + 1;
            }

            updatedRoom.lastMessage = newMessage;
            return updatedRoom;
          }
          return room;
        });

        return updatedRooms.sort((a, b) => {
          const aTime = new Date(a.lastMessage?.createdAt || a.createdAt || 0).getTime();
          const bTime = new Date(b.lastMessage?.createdAt || b.createdAt || 0).getTime();
          return bTime - aTime;
        });
      });
    };

    socket.on('receive_message', receiveMessageHandler);

    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [socket, activeChatRoomId]);

  useEffect(() => {
    if (!chatRooms.length) return;

    // If navigating from "Send Message" button
    if (openWithUserId) {
      const roomWithThatUser = chatRooms.find(room =>
        room.participants.some(p => p._id === openWithUserId)
      );

      if (roomWithThatUser) {
        setActiveChatRoomId(roomWithThatUser._id);
      } else {
        // fallback to first room
        setActiveChatRoomId(chatRooms[0]._id);
      }
    } else if (!activeChatRoomId) {
      setActiveChatRoomId(chatRooms[0]._id);
    }
  }, [chatRooms, activeChatRoomId, openWithUserId]);

  // Fetch messages when user selects a chat
  useEffect(() => {
    if (!activeChatRoomId) return;

    socket.emit('get_chat_messages', activeChatRoomId);

    const handler = ({ chatRoomId, messages }) => {
      setChatRooms(prev =>
        prev.map(room =>
          room._id === chatRoomId ? { ...room, messages } : room
        )
      );
    };

    socket.on('chat_messages_data', handler);

    return () => {
      socket.off('chat_messages_data', handler);
    };
  }, [activeChatRoomId, socket]);

  // When a user opens a chat room, tell the server to mark it as read.
  useEffect(() => {
    if (activeChatRoomId && socket && userData?._id) {
      socket.emit('mark_room_as_read', { 
        chatRoomId: activeChatRoomId, 
        userId: userData._id 
      });
    }
  }, [activeChatRoomId, socket, userData]);

  const sendMessage = (messageContent) => {
    if (!activeChatRoom?._id || !userData?._id) {
        console.error("Cannot send message: Active chat room or user data is missing.");
        return;
    }
    const data = {
      chatRoomId: activeChatRoom._id,
      sender: userData._id,
      message: messageContent
    };
    socket.emit("send_message", data);
  };

  const deleteMessages = () => {
     if (!activeChatRoom?._id) return;

    socket.emit("delete_chat", {
      chatRoomId: activeChatRoom._id,
      userId: userData._id
    });
  }

  const filteredChatRooms = chatRooms.filter(chatRoom => {
    const matchUser = chatRoom.participants.find(item => item._id !== userData._id);
    return matchUser?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    setIsChatRoomVisible(true)
  }, [activeChatRoomId])

  return (
    <div className='chat'>
      <div className={`leftBar ${isChatRoomVisible ? 'mob-hidden' : 'mob-visible'}`}>
        <div className='upperContainer'>
          <input
            placeholder='Search matches...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='matchesList'>
          {filteredChatRooms?.map((item, index) => {
            const matchName = item.participants.find(item => item._id !== userData._id).fullName
            
            return (
              <div
                key={item._id || index}
                className={`item ${activeChatRoomId  === item._id ? 'active' : ''}`}
                onClick={() => activeChatRoomId  !== item._id && setActiveChatRoomId(item._id)}
              >
                <div>
                  <UserAvatar 
                    avatarIndex={item.participants.find(item => item._id !== userData._id)?.avatarIndex}
                    gender={item.participants.find(item => item._id !== userData._id)?.gender}
                  />
                  <div className='nameAndMessageContainer'>
                    <p>{matchName}</p>
                    <p>
                      {item.lastMessage && (
                        <img
                          className='icon'
                          src={item.lastMessage.sender === userData?._id ? MessageSend : MessageReceive}
                          alt="icon"
                        />
                      )}
                      {item.lastMessage?.message || 'no messages yet'}
                    </p>
                  </div>
                </div>
                {item.lastMessage && (
                  <span className='messageTime'>{formatTimeAgo(item.lastMessage.createdAt)}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {console.log(activeChatRoom)}
      <ChatRoom
        chatRoom={activeChatRoom}
        onSendMessage={sendMessage}
        onDeleteMessages={deleteMessages}
        isChatRoomVisible={isChatRoomVisible}
        setIsChatRoomVisible={setIsChatRoomVisible}
      />
    </div>
  );
}

export default Chat;