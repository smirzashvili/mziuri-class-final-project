import React, { useState, useEffect } from 'react';
import { Button, Logo, NavigationScreen, IconButton, Toggle } from '../../components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navigation from '../../assets/icons/navigation.svg';
import Sidebar from '../../assets/icons/sidebar.svg';

function TopBar({setIsNavbarVisible}) {
  return (
    <div className='topBar'>

        <IconButton
          icon={Sidebar}
        //   onClick={() => setIsNavbarVisible(true)}
          size={24}
        />

        <Link
            to="/explore"
            className="logoContainer"
        >
            <Logo hasAnimation={false} />
        </Link>

        <IconButton
          icon={Navigation}
          onClick={() => setIsNavbarVisible(true)}
          size={16}
        />

    </div>
  )
}

export default TopBar