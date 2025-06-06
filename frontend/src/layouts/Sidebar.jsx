import React, { useState } from 'react';
import { Button, Logo, NavigationScreen, IconButton, Toggle } from '../components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../assets/icons/navigation.svg';
import * as api from '../api/api.js';
import { useUserData } from '../context/UserContext.jsx';
import Discover from '../assets/icons/discover.svg';
import Messages from '../assets/icons/messages.svg';
import Profile from '../assets/icons/profile.svg';
import Sun from '../assets/icons/sun.svg';
import Moon from '../assets/icons/moon.svg';
import Volume from '../assets/icons/volume.svg';
import VolumeMute from '../assets/icons/volumeMute.svg';

function Sidebar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(false);

  const { loggedIn, logout } = useUserData();
  
  const navigate = useNavigate();

  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = async () => {
    try {
      const { data } = await api.logoutUser();
      logout()
      navigate('/login');
    } catch (error) {

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
            <div className='line'></div>
            <div className='line'></div>
            <Link
              to="/explore"
              className={`item ${currentPath === '/explore' ? 'active' : ''}`}
            >
              <IconButton
                icon={Discover}
                size={16}
              />
              <p>Discover</p>
            </Link>
            <Link
              to="/chat"
              className={`item ${currentPath === '/chat' ? 'active' : ''}`}
            >
              <IconButton
                icon={Messages}
                size={16}
              />
              <p>Messages</p>
            </Link>
            <Link
              to="/profile"
              className={`item ${currentPath === '/profile' ? 'active' : ''}`}
            >
              <IconButton
                icon={Profile}
                size={16}
              />
              <p>Profile</p>
            </Link>
          </nav>
          <div className='darkmodeAndVolumeContainer'>
            <div className='item'>
              <div>
                <IconButton
                  icon={soundOn ? Volume : VolumeMute}
                  size={16}
                />
                <p>Sound</p>
              </div>
              <Toggle 
                onToggle={(isOn) => setSoundOn(isOn)} 
                defaultOn={soundOn}
              />
            </div>
            <div className='item'>
              <div>
                <IconButton
                  icon={darkModeOn ? Moon : Sun}
                  size={16}
                />
                <p>Dark Mode</p>
              </div>
              <Toggle 
                onToggle={(isOn) => setDarkModeOn(isOn)} 
                defaultOn={darkModeOn}
              />
            </div>
          </div>
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
