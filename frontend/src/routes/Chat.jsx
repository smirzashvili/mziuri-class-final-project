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

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    setMessage(prev => prev + emoji);
  };

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_chat_history");

    const historyHandler = (data) => {
      setChat(data);
    };

    const receiveHandler = (data) => {
      setChat(prev => [...prev, data]);
    };

    socket.on("chat_history", historyHandler);
    socket.on("receive_message", receiveHandler);

    return () => {
      socket.off("chat_history", historyHandler);
      socket.off("receive_message", receiveHandler);
    };
  }, [socket]);

  
  const sendMessage = () => {
    const data = {
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
          <div className='item active'>
            <div>
              <div className='userImage'>

              </div>
              <div className='nameAndMessageContainer'>
                <p>Sarah</p>
                <p>
                  <img
                    className='icon'
                    src={MessageSend}
                    alt="icon"
                  />
                  Hey, how's it going? 
                  <span className='greenCircle'></span>
                </p>
              </div>
            </div>
            <span className='messageTime'>2m</span>
          </div>     
        </div>
      </div>
      <div className='rightBar'>
        <div className='upperContainer'>
          <div>
            <div className='userImage'>

            </div>
            <p>You matched with Sarah at </p>
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
