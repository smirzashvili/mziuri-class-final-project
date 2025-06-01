import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { ChatRoom } from '../components'
import MessageSend from '../assets/icons/messageSend.svg';
import MessageReceive from '../assets/icons/messageReceive.svg';
// import MessageReceive from '../assets/icons/messageReceive.svg';
import { useUserData } from '../context/UserContext';
import { useSocket } from '../context/SocketContext';
import { formatTimeAgo } from '../utils/textFormat';

function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [activeChatRoomIndex, setActiveChatRoomIndex] = useState(0)
  const activeChatRoom = chatRooms[activeChatRoomIndex]
  
  const { userData } = useUserData()
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !userData || !userData.matches?.length) return;

    socket.emit('get_all_chatrooms', userData._id);

    // Handler for receiving new messages in chat room
    const receiveHandler = (newMessage) => {
      console.log(chatRooms)
      setChatRooms(prev => 
        prev.map(chatRoom => {
          if (chatRoom.chatRoomId === newMessage.chatRoom) {
            return {
              ...chatRoom,
              messages: [...chatRoom.messages, newMessage]
            };
          }
          return chatRoom;
        })
      );
    };
    socket.on('receive_message', receiveHandler);

    const allChatRoomsHandler = (chatRoomsWithMessages) => {
      setChatRooms(chatRoomsWithMessages); 
    };
    socket.on('all_chatrooms_data', allChatRoomsHandler);

    return () => {
      socket.off('receive_message', receiveHandler);
      socket.off('all_chatrooms_data', allChatRoomsHandler);
    };
  }, [socket, activeChatRoomIndex]);
  
  const sendMessage = (message) => {
    const data = {
      chatRoomId: activeChatRoom._id,
      sender: userData._id,
      message
    };
    socket.emit("send_message", data);
  };

  return (
    <div className='chat'>
      <div className='leftBar'>
        <div className='upperContainer'>
          <input placeholder='Search conversations...' />
        </div>
        <div className='matchesList'>
          {chatRooms?.map((item, index) => {
            const lastMessage = item.messages[item.messages.length - 1]
            const matchName = item.participants.find(item => item._id !== userData._id).fullName
            return (
              <div 
                key={index}
                className={`item ${activeChatRoomIndex === index ? 'active' : ''}`}
                onClick={() => activeChatRoomIndex !== index && setActiveChatRoomIndex(index)}
              >
                <div>
                  <div className='userImage'>

                  </div>
                  <div className='nameAndMessageContainer'>
                    <p>{matchName}</p>
                    {
                      lastMessage && 
                      <p>
                        <img
                          className='icon'
                          src={lastMessage.sender === userData._id ? MessageSend : MessageReceive}
                          alt="icon"
                        />
                        {lastMessage.message}
                        {/* <span className='greenCircle'></span> */}
                      </p>
                    }
                  </div>
                </div>
                {
                  lastMessage && 
                  <span className='messageTime'>{formatTimeAgo(lastMessage.createdAt)}</span>
                }
              </div>     
            )
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
