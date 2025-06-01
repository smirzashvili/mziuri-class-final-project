import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import ThreeDot from '../assets/icons/threeDot.svg';
import SendMessage from '../assets/icons/sendMessage.svg';
import Emoji from '../assets/icons/emoji.svg';
import { IconButton } from '../components'
import { formatTime, formatDate } from '../utils/textFormat';
import { useUserData } from '../context/UserContext';
const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

function ChatRoom({chatRoom, onSendMessage}) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const [message, setMessage] = useState('');
  const { userData } = useUserData()
  const chatBoxRef = useRef(null);

  const matchName = chatRoom?.participants.find(item => item._id !== userData._id).fullName
  const matchTime = formatDate(chatRoom?.createdAt)

  useEffect(() => {
    setMessage('')
    if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatRoom?.messages]);

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    setMessage(prev => prev + emoji);
  };
  
  return (
    <div className='chatRoom'>
        <div className='upperContainer'>
            <div>
            <div className='userImage'>

            </div>
            <p>You matched with {matchName} on {matchTime}</p>
            </div>
            <IconButton
                icon={ThreeDot}
                size={16}
            />
        </div>
        <div className='chatContainer'>
            <div className='chatBox' ref={chatBoxRef}>
            {chatRoom?.messages.map((item, index) => {
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
                onClick={() => onSendMessage(message)}
            />
        </div>
    </div>
  )
}

export default ChatRoom