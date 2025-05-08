import React, { useState } from 'react';
import { Button, Logo, NavigationScreen, IconButton } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../assets/icons/navigation.svg';
import * as api from '../api/api.js';
import { useUserData } from '../context/UserContext.jsx';
import Discover from '../assets/icons/discover.svg';
import Messages from '../assets/icons/messages.svg';
import Profile from '../assets/icons/profile.svg';

function Sidebar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const { loggedIn, setLoggedIn } = useUserData();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await api.logoutUser();

      if (response.data) {
        setLoggedIn(false);
        navigate('/login');
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      <aside className="sidebar">
        <div className="upperContainer">
          <Link
            to="/explore"
            className="logoContainer"
          >
            <Logo hasAnimation={false} />
          </Link>
          <nav className="linksContainer">
            <div className="item">
              <Link to="/explore">
                <IconButton
                  icon={Discover}
                  size={20}
                />
                <p>Discover</p>
              </Link>
            </div>
            <div className="item">
              <Link to="/chat">
                <IconButton
                  icon={Messages}
                  size={20}
                />
                <p>Messages</p>
              </Link>
            </div>
            <div className="item">
              <Link to="/profile">
                <IconButton
                  icon={Profile}
                  size={20}
                />
                <p>Profile</p>
              </Link>
            </div>
          </nav>
        </div>

        <IconButton
          icon={Navigation}
          onClick={() => setIsNavbarVisible(true)}
          size={20}
        />

        <div className="buttonsContainer">
          <Button onClick={() => navigate(`/${!loggedIn ? 'login' : 'profile'}`)}>
            {!loggedIn ? 'Log in' : 'Profile'}
          </Button>
          {loggedIn && (
            <Button
              onClick={handleLogout}
              additionalClassnames="secondary"
            >
              Logout
            </Button>
          )}
        </div>
      </aside>
      <NavigationScreen
        visible={isNavbarVisible}
        setVisible={setIsNavbarVisible}
      />
    </>
  );
}

export default Sidebar;
