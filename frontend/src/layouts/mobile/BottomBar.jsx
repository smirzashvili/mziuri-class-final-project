import React from 'react'
import { Button, Logo, IconButton, Toggle } from '../../components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Discover from '../../assets/icons/discover.svg';
import Messages from '../../assets/icons/messages.svg';
import Profile from '../../assets/icons/profile.svg';
import { useChatData } from '../../context/ChatNotificationsContext.jsx';

function BottomBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { unreadMessagesCount } = useChatData();

  return (
    <div className='bottomBar'>
      <nav className="linksContainer">
        <Link
          to="/explore"
          className={`item ${currentPath === '/explore' ? 'active' : ''}`}
        >
          <IconButton
            icon={Discover}
            size={"calc(16px * var(--app-scale))"}
          />
          <p>Discover</p>
        </Link>
        <Link
          to="/chat"
          className={`item ${currentPath === '/chat' ? 'active' : ''}`}
        >
          <IconButton
            icon={Messages}
            size={"calc(16px * var(--app-scale))"}
          />
          <p>Messages</p>
          {
            unreadMessagesCount > 0 &&
            <p className={`unreadMessagesCount`}>{unreadMessagesCount}</p>
          }
        </Link>
        <Link
          to="/profile"
          className={`item ${currentPath === '/profile' ? 'active' : ''}`}
        >
          <IconButton
            icon={Profile}
            size={"calc(16px * var(--app-scale))"}
          />
          <p>Profile</p>
        </Link>
      </nav>
    </div>
  )
}

export default BottomBar