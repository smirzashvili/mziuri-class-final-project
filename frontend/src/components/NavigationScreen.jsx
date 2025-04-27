import React from 'react';
import { Link } from 'react-router-dom';
import { capitalize } from '../utils/textFormat';

const NavigationScreen = ({setVisible}) => {

  const routes = ['profile', 'about', 'contact', '404']

  return (
    <nav className='navigationScreen'>
        <button onClick={() => setVisible(false)}>
            close
        </button>
        <div className='links'>
            <ul>
                {
                    routes.map((item, index) => (
                        <li key={index}>
                            <Link to={`/${item}`} onClick={() => setVisible(false)}>{capitalize(item)}</Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    </nav>
  )
};

export default NavigationScreen;
