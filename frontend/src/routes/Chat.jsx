import React, { useState, useEffect } from 'react';
import { ChatRoom, UserAvatar } from '../components';
import MessageSend from '../assets/icons/messageSend.svg';
import MessageReceive from '../assets/icons/messageReceive.svg';
import { useUserData } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { formatTimeAgo } from '../utils/textFormat';
import Male1 from '../assets/icons/user/male1.svg';

function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChatRoomIndex, setActiveChatRoomIndex] = useState(0);
  const activeChatRoom = chatRooms[activeChatRoomIndex];
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatRoomVisible, setIsChatRoomVisible] = useState(true);

  const { userData } = useUserData();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !userData?._id) return;

    // Request all chatrooms for the user
    socket.emit('get_all_chatrooms', userData._id);

    // Handler for receiving all chatroom data
    const allChatRoomsHandler = (chatRoomsWithMessages) => {
      setChatRooms(chatRoomsWithMessages);
      if (chatRoomsWithMessages.length > 0) {
        const roomIds = chatRoomsWithMessages.map(cr => cr._id);
        socket.emit('join_rooms', roomIds);
      }
    };
    socket.on('all_chatrooms_data', allChatRoomsHandler);

    // Handler for receiving new messages
    const receiveMessageHandler = (newMessage) => {
      setChatRooms(prevChatRooms =>
        prevChatRooms.map(chatRoom => {
          if (chatRoom._id === newMessage.chatRoom) {
            return {
              ...chatRoom,
              messages: [...chatRoom.messages, newMessage]
            };
          }
          return chatRoom;
        })
      );
    };
    socket.on('receive_message', receiveMessageHandler);

    // Handler for delete chat
    const chatDeletedHandler = (deletedChatRoomId) => {
      setChatRooms(prev =>
        prev.map(cr => {
          if (cr._id === deletedChatRoomId) {
            return { ...cr, messages: [] };
          }
          return cr;
        })
      );    
    };
    socket.on("chat_deleted", chatDeletedHandler);

    return () => {
      socket.off('all_chatrooms_data', allChatRoomsHandler);
      socket.off('receive_message', receiveMessageHandler);
      socket.off("chat_deleted", chatDeletedHandler);
    };
  }, [socket, userData]);

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
  }, [activeChatRoomIndex])

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
            const lastMessage = item.messages[item.messages.length - 1]
            const matchName = item.participants.find(item => item._id !== userData._id).fullName
            
            return (
              <div
                key={item._id || index}
                className={`item ${activeChatRoomIndex === index ? 'active' : ''}`}
                onClick={() => activeChatRoomIndex !== index && setActiveChatRoomIndex(index)}
              >
                <div>
                  <UserAvatar 
                    path={Male1}
                  />
                  <div className='nameAndMessageContainer'>
                    <p>{matchName}</p>
                    <p>
                      {lastMessage && (
                        <img
                          className='icon'
                          src={lastMessage.sender === userData?._id ? MessageSend : MessageReceive}
                          alt="icon"
                        />
                      )}
                      {lastMessage?.message || 'no messages yet'}
                    </p>
                  </div>
                </div>
                {lastMessage && (
                  <span className='messageTime'>{formatTimeAgo(lastMessage.createdAt)}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
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