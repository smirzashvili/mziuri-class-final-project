import React, { useState, useEffect } from 'react';
import { Button, Logo, NavigationScreen, IconButton, Toggle } from '../../components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../../assets/icons/navigation.svg';
import Sidebar from '../../assets/icons/sidebar.svg';

function TopBar({setIsNavigationScreenVisible, setIsSidebarVisible}) {
  return (
    <div className='topBar'>

        <IconButton
          icon={Sidebar}
        //   onClick={() => setIsNavigationScreenVisible(true)}
          size={24}
          onClick={() => setIsSidebarVisible(p => !p)}
        />

        <Link
          to="/"
          className="logoContainer"
        >
          <Logo hasAnimation={false} />
        </Link>

        <IconButton
          icon={Navigation}
          onClick={() => setIsNavigationScreenVisible(true)}
          size={16}
        />

    </div>
  )
}

export default TopBar