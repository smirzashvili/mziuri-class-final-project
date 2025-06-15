import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import ThreeDot from '../assets/icons/threeDot.svg';
import SendMessage from '../assets/icons/sendMessage.svg';
import Emoji from '../assets/icons/emoji.svg';
import ArrowLeft from '../assets/icons/arrowLeft.svg';
import { IconButton, Button, UserAvatar } from '../components'
import { formatTime, formatDate } from '../utils/textFormat';
import { useUserData } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Male1 from '../assets/icons/user/male1.svg';
const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

function ChatRoom({chatRoom, onSendMessage, onDeleteMessages, isChatRoomVisible, setIsChatRoomVisible}) {
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false);
  const [message, setMessage] = useState('');
  const { userData } = useUserData()
  const navigate = useNavigate()
  const chatBoxRef = useRef(null);

  const menuRef = useRef(null);
  const threeDotButtonRef = useRef(null);

  const emojiPickerRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        // if (threeDotButtonRef.current && threeDotButtonRef.current.contains(e.target)) {
        //     return; 
        // }
        setMenuVisible(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setEmojiPickerVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReportUserClick = () => {
    navigate('/contact', {
      state: {
        name: userData.fullName,
        email: userData.email,
        subject: `Reporting User: ${matchName}`,
      },
    });
  };
  
  return (
    <div className={`chatRoom ${isChatRoomVisible ? 'mob-visible' : 'mob-hidden'}`}>
        <div className='upperContainer'>
            <div>
                <IconButton
                    icon={ArrowLeft}
                    size={16}
                    additionalClassnames={'backToMatchListButton'}
                    onClick={() => setIsChatRoomVisible(false)}
                />
                <UserAvatar 
                    avatarIndex={chatRoom?.participants.find(item => item._id !== userData._id)?.avatarIndex}
                    gender={chatRoom?.participants.find(item => item._id !== userData._id)?.gender}
                />
                <p>You matched with {matchName} on {matchTime}</p>
            </div>
            <IconButton
                icon={ThreeDot}
                size={"calc(16px * var(--app-scale))"}
                onClick={() => setMenuVisible(prev => !prev)}
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
            />
            <div className='emojiContainer' ref={emojiPickerRef}>
                <IconButton
                    ref={threeDotButtonRef}
                    icon={Emoji}
                    size={"calc(16px * var(--app-scale))"}
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
                size={"calc(16px * var(--app-scale))"}
                additionalClassnames={'green'}
                onClick={() => onSendMessage(message)}
            />
        </div>

        {menuVisible && (
            <div className='threeDotMenu' ref={menuRef}>
                <Button                 
                    additionalClassnames="secondary"
                    onClick={handleReportUserClick}
                >
                    Report User
                </Button>
                <Button                 
                    additionalClassnames="secondary"
                    onClick={onDeleteMessages}
                >
                    Delete Messages
                </Button>
            </div>
        )}
    </div>
  )
}

export default ChatRoom