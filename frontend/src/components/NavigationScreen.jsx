import React from 'react';
import { Link } from 'react-router-dom';
import { capitalize } from '../utils/textFormat';
import { navigationRoutes } from '../data/data';
import { IconButton } from '../components'
import Close from '../assets/icons/close.svg'

const NavigationScreen = ({setVisible}) => {

  return (
    <nav className='navigationScreen'>
        <IconButton icon={Close} onClick={() => setVisible(false)} size={24} />                    
        <div className='links'>
            <ul>
                {
                    navigationRoutes.map((item, index) => (
                        <li key={index}>
                            <Link to={item.link} onClick={() => setVisible(false)}>{item.text}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    </nav>
  )
};

export default NavigationScreen;
