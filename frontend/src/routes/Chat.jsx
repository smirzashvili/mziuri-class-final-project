import React, { useState, useEffect } from 'react';
import { ChatRoom } from '../components';
import MessageSend from '../assets/icons/messageSend.svg';
import MessageReceive from '../assets/icons/messageReceive.svg';
import { useUserData } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { formatTimeAgo } from '../utils/textFormat';

function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChatRoomIndex, setActiveChatRoomIndex] = useState(0);
  const activeChatRoom = chatRooms[activeChatRoomIndex];
  const [searchTerm, setSearchTerm] = useState('');

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

    return () => {
      socket.off('all_chatrooms_data', allChatRoomsHandler);
      socket.off('receive_message', receiveMessageHandler);
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

  const filteredChatRooms = chatRooms.filter(chatRoom => {
    const matchUser = chatRoom.participants.find(item => item._id !== userData._id);
    return matchUser?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className='chat'>
      <div className='leftBar'>
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
                  <div className='userImage'>
                    {/* Placeholder for user image */}
                  </div>
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
      />
    </div>
  );
}

export default Chat;