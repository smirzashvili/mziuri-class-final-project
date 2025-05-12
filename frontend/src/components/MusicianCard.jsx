import React, { useState, useRef } from 'react';
import UserImage from '../assets/icons/eye-closed.svg';
import IconButton from './IconButton';
import Info from '../assets/icons/info.svg';

function MusicianCard() {
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const [infoActive, setInfoActive] = useState(false);
  const [state, setState] = useState({
    fullName: 'Emma Brown',
    age: '24',
    city: 'Tbilisi',
    bio: 'Foodie and yoga instructor. Looking for someone to try new restaurants with.',
    favoriteGenre: 'Rock',
    favoriteInstrument: 'Doli'
  })

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const start = useRef({ x: 0, y: 0 });
  const watermarkState = position.x > 150 ? 'like' : position.x < -150 ? 'nope' : ''
  const watermarkOpacity = Math.min(Math.abs(watermarkState === 'like' ? (position.x - 150)/50 : watermarkState === 'nope' ? (position.x + 150)/50 : 0), 1)

  const handleMouseDown = (e) => {
    start.current = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setPosition({ x: dx, y: dy });
    setRotation(dx / 20);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (position.x > 200) {
      console.log('like');
    } else if (position.x < -200) {
      console.log('dislike');
    } else {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  // const handlePrevAsset = () => {
  //   setCurrentAssetIndex((prevIndex) => prevIndex - 1);
  // };

  // const handleNextAsset = () => {
  //   setCurrentAssetIndex((prevIndex) => prevIndex + 1);
  // };

  return (
    <div 
      className="musicianCard"
      onMouseDown={handleMouseDown}
      style={{transform: `translateX(${position.x}px) rotate(${rotation}deg)`}}
    >
      <div className="indicators">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentAssetIndex ? 'active' : ''}`}
            // onClick={() => setCurrentIndex(index)}
            // data-tooltip={`${t("index")} ${index + 1}`}
          />
        ))}
      </div>
      <img
        className="image"
        src={UserImage}
      />
      <div
        className={`infoContainer ${infoActive ? 'active' : ''}`}
      >
        <IconButton
          icon={Info}
          onClick={() => setInfoActive(!infoActive)}
          size={16}
        />
        <div className='section'>
          <h2>{state.fullName}, {state.age}</h2>
          <p>{state.city}</p>
        </div>
        {infoActive && <div className='additional'>
          <div className='section'>
            <h3>Bio</h3>
            <p>{state.bio}</p>
          </div>
          <div className='section'>
            <h3>Favorite Genre</h3>
            <p>{state.favoriteGenre}</p>
          </div>
          <div className='section'>
            <h3>Favorite Instruemnt</h3>
            <p>{state.favoriteInstrument}</p>
          </div>
        </div>}
      </div>

      <div 
        className={`watermark ${watermarkState}`}
        style={{opacity: watermarkOpacity}}
      >
        {watermarkState}      
      </div>
    </div>
  );
}

export default MusicianCard;
