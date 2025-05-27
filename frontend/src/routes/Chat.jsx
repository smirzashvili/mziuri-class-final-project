import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '../components'
import ThreeDot from '../assets/icons/threeDot.svg';
import SendMessage from '../assets/icons/sendMessage.svg';
import Emoji from '../assets/icons/emoji.svg';
import MessageSend from '../assets/icons/messageSend.svg';
// import MessageReceive from '../assets/icons/messageReceive.svg';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';

function Chat() {
  const [chat, setChat] = useState([
    {
      sender: 'Sarah', //userId
      message: "Hey, how's it going?"
    },
    {
      sender: 'Saba', //userId
      message: "Hey, how's it going? sssssssssssssssss dasd asda ssssssssssssssssssssssssssss sssssssssssssssssssss ssssssssssssssssssssssssssssssssssssss"
    },
  ]);
  const [message, setMessage] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const socketRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    handleChange('message', (message || '') + emoji);
  };

  useEffect(() => {
    socketRef.current = io('http://localhost:3003', {
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.on("receive_message", (data) => {
      setChat(prev => [...prev, data]);
    });

    socket.on("chat_history", (data) => {
      setChat(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("chat_history");
      socket.disconnect(); //clean up on unmount
    };
  }, []);

  const sendMessage = () => {
    const msgData = {
      message,
      sender: 'bla',
      time: new Date().toLocaleTimeString()
    };
    socketRef.current.emit("send_message", msgData);
  };


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
            {chat.map(item => 
              <p>{item.message}</p>
            )}
            <div className='item receive'>
              <div className='userImage'>

              </div>
              <div className='messageAndTime'>
                <p>
                  Hey, how's it going? sssssssssssssssss dasd asda ssssssssssssssssssssssssssss sssssssssssssssssssss ssssssssssssssssssssssssssssssssssssss
                </p>
                <span className='time'>10:25 AM</span>
              </div>
            </div>
            <div className='item send'>
              <div className='messageAndTime'>
                <p>
                  Hey, how's it going? 
                </p>
                <span className='time'>10:25 AM</span>
              </div>
            </div>
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
