import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '../components'
import ThreeDot from '../assets/icons/threeDot.svg';
import SendMessage from '../assets/icons/sendMessage.svg';
import Emoji from '../assets/icons/emoji.svg';
import MessageSend from '../assets/icons/messageSend.svg';
// import MessageReceive from '../assets/icons/messageReceive.svg';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
import { useUserData } from '../context/UserContext';
import { formatTime } from '../utils/textFormat';
import { useSocket } from '../context/SocketContext';

function Chat() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const { userData } = useUserData()
  const { socket } = useSocket();

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    setMessage(prev => prev + emoji);
  };

  useEffect(() => {
    console.log(socket)
    if (!socket) return;

    socket.on("receive_message", (data) => {
      setChat(prev => [...prev, data]);
    });

    socket.on("chat_history", (data) => {
      setChat(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("chat_history");
    };
  }, [socket]);

  const sendMessage = () => {
    const data = {
      sender: userData._id,
      message
    };
    socket.emit("send_message", data);
  };

  if (!socket) {
    return <div>Connecting to chat...</div>; // Or some other loading/connection state UI
  }

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
          <div className='chatBox'>
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
              <EmojiPicker 
                className={`emojiPicker ${emojiPickerVisible ? 'visible' : ''}`} 
                onEmojiClick={handleEmojiClick}
              />
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
