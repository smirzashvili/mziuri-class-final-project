import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { IconButton } from '../components'
import ThreeDot from '../assets/icons/threeDot.svg';
import SendMessage from '../assets/icons/sendMessage.svg';
import Emoji from '../assets/icons/emoji.svg';
import MessageSend from '../assets/icons/messageSend.svg';
// import MessageReceive from '../assets/icons/messageReceive.svg';
import io from 'socket.io-client';
import { useUserData } from '../context/UserContext';
import { formatTime } from '../utils/textFormat';
import { useSocket } from '../context/SocketContext';
const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

function Chat() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const { userData } = useUserData()
  const { socket } = useSocket();
  const chatBoxRef = useRef(null);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0)
  const [currentChatRoomId, setCurrentChatRoomId] = useState(null);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    setMessage(prev => prev + emoji);
  };

   useEffect(() => {
    if (!socket || !userData || !userData.matches?.length) return;

    const selectedMatch = userData.matches[activeMatchIndex];
    if (!selectedMatch) return;

    // Emit event to select chat room between current user and selected match
    socket.emit('select_match', {
      userId: userData._id,
      matchId: selectedMatch._id
    });

    // Handler for chat history (includes chatRoomId)
    const historyHandler = ({ chatRoomId, messages }) => {
      console.log(chatRoomId, messages)
      setCurrentChatRoomId(chatRoomId);
      setChat(messages);
    };

    // Handler for receiving new messages in this chat room
    const receiveHandler = (newMessage) => {
      // Make sure the message is for the current chatRoom
      if (newMessage.chatRoom === currentChatRoomId) {
        setChat(prev => [...prev, newMessage]);
      }
    };

    socket.on('chat_history', historyHandler);
    socket.on('receive_message', receiveHandler);

    return () => {
      socket.off('chat_history', historyHandler);
      socket.off('receive_message', receiveHandler);
    };
  }, [socket, currentChatRoomId]);
  
  const sendMessage = () => {
    const data = {
      chatRoomId: currentChatRoomId,
      sender: userData._id,
      message
    };
    socket.emit("send_message", data);
  };
  
  useEffect(() => {
    setMessage('')
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className='chat'>
      <div className='leftBar'>
        <div className='upperContainer'>
          <input placeholder='Search conversations...' />
        </div>
        <div className='matchesList'>
          {userData?.matches.map((item, index) => {
            return (
              <div 
                className={`item ${activeMatchIndex === index ? 'active' : ''}`}
                onClick={() => activeMatchIndex !== index && setActiveMatchIndex(index)}
              >
                <div>
                  <div className='userImage'>

                  </div>
                  <div className='nameAndMessageContainer'>
                    <p>{item.fullName}</p>
                    <p>
                      <img
                        className='icon'
                        src={MessageSend}
                        alt="icon"
                      />
                      {activeMatchIndex === index && chat.length > 0 ? chat[chat.length - 1]?.message : ''}
                      <span className='greenCircle'></span>
                    </p>
                  </div>
                </div>
                <span className='messageTime'>2m</span>
              </div>     
            )
          })}
        </div>
      </div>
      <div className='rightBar'>
        <div className='upperContainer'>
          <div>
            <div className='userImage'>

            </div>
            <p>You matched with {userData?.matches[activeMatchIndex].fullName} at </p>
          </div>
           <IconButton
              icon={ThreeDot}
              size={16}
            />
        </div>
        <div className='chatContainer'>
          <div className='chatBox' ref={chatBoxRef}>
            {chat.map((item, index) => {
              let isYou = item.sender === userData?._id
              return (
                <div key={index} className={`item ${isYou ? 'send' : 'receive'}`}>
                  {!isYou && 
                    <div className='userImage'>

                    </div>
                  }
                  <div className='messageAndTime'>
                    <p>
                      {item.message}
                    </p>
                    <span className='time'>{formatTime(item.createdAt)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className='bottomContainer'>
            <input 
              name='message'
              value={message || ''}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type a message...'
              onFocus={() => setEmojiPickerVisible(false)}
            />
            <div className='emojiContainer'> 
              <IconButton
                icon={Emoji}
                size={16}
                onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
              />
                {/* <EmojiPicker 
                className={`emojiPicker ${emojiPickerVisible ? 'visible' : ''}`} 
                onEmojiClick={handleEmojiClick}
              /> */}

              <Suspense fallback={null}>
                {emojiPickerVisible && (
                  <LazyEmojiPicker 
                    className='emojiPicker visible' 
                    onEmojiClick={handleEmojiClick} 
                  />
                )}
              </Suspense>
            </div>
            <IconButton
              icon={SendMessage}
              size={16}
              additionalClassnames={'green'}
              onFocus={() => setEmojiPickerVisible(false)}
              onClick={sendMessage}
            />
        </div>
      </div>
    </div>
  );
}

export default Chat;
