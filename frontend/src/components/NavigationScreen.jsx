import React from 'react';
import { Link } from 'react-router-dom';
import { navigationRoutes } from '../data/data';
import { IconButton } from '../components';
import Close from '../assets/icons/close.svg';

const NavigationScreen = ({ visible, setVisible }) => {
  return (
    <nav className={`navigationScreen ${visible ? 'fade-in' : ''}`}>
      <IconButton
        icon={Close}
        onClick={() => setVisible(false)}
        size={"calc(24px * var(--app-scale))"}
      />
      <div className="links">
        <ul>
          {navigationRoutes.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link}
                onClick={() => setVisible(false)}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationScreen;
