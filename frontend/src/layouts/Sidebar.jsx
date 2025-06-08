import React, { useState, useEffect } from 'react';
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
import { useSound } from '../context/SoundContext';

function Sidebar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [darkModeOn, setDarkModeOn] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const { soundOn, setSoundOn } = useSound();
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

  useEffect(() => {
    if (darkModeOn) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', true)
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', false)
    }
  }, [darkModeOn]);

  useEffect(() => {
    if (soundOn) {
      localStorage.setItem('sound', true)
    } else {
      localStorage.setItem('sound', false)
    }
  }, [soundOn]);

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
          <div className='darkmodeAndVolumeContainer'>
            <div className='item'>
              <div>
                <IconButton
                  icon={soundOn ? Volume : VolumeMute}
                  size={"calc(16px * var(--app-scale))"}
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
                  size={"calc(16px * var(--app-scale))"}
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
          size={"calc(20px * var(--app-scale))"}
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
