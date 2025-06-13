import React, { useState, useRef } from 'react';
import UserImage from '../assets/icons/user/placeholder.svg';
import IconButton from './ui/IconButton';

function FakeCard() {

  return (
    <div className="fakeCard">
      <div className="">
        <div className='cornerBlur'></div>
        <div className='cornerBlur'></div>
        <img
          className="image"
          src={UserImage}
        />
        <div
          className={`infoContainer`}
        >
          <h2>Start your musical journey</h2>
          <p>Join MelodyMatch to connect with fellow musicians and showcase your talent.</p>
          <div className='newConnections'>
            <div className='userImages'>
              <div className="item"></div>
              <div className="item"></div>
              <div className="item"></div>
              <div className="item"></div>
            </div>
            <p><span>200+</span> new connections today</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FakeCard;
