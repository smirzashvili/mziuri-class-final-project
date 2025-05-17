import React, { useState, useRef, useEffect } from 'react';
import UserImage from '../assets/icons/eye-closed.svg';
import IconButton from './IconButton';
import Info from '../assets/icons/info.svg';

function MusicianCard() {
  const [state, setState] = useState({
    fullName: 'Emma Brown',
    age: '24',
    city: 'Tbilisi',
    bio: 'Foodie and yoga instructor. Looking for someone to try new restaurants with.',
    favoriteGenre: 'Rock',
    favoriteInstrument: 'Doli',
    media: [
      'https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
    ]
  })
  const [infoActive, setInfoActive] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMediaDuration, setCurrentMediaDuration] = useState()

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

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prevIndex) => prevIndex !== 0 ? prevIndex - 1 : prevIndex);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => prevIndex !== state.media.length - 1 ? prevIndex + 1 : prevIndex);
  };

  const handleMediaLoadedMetadata = (e) => {
    console.log(e.target.duration)
    setCurrentMediaDuration(e.target.duration)
  }

  useEffect(() => {
    requestAnimationFrame(updateIndicatorProgress);
  }, [currentMediaDuration])

  const updateIndicatorProgress = () => {
    const duration = videoRef.current.duration;
    const currentTime = videoRef.current.currentTime;
    if (duration) {
      setIndicatorProgress(currentTime / duration);
    }
    requestAnimationFrame(updateIndicatorProgress);
  };

  return (
    <div 
      className="musicianCard"
      onMouseDown={handleMouseDown}
      style={{transform: `translateX(${position.x}px) rotate(${rotation}deg)`}}
    >
      <div className="indicators">
        {state.media.map((_, index) => (
          <div
            key={index}
            className={`indicator ${index === currentMediaIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <div
        className={`media`}
      >
        <>
          {state.media[currentMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={state.media[currentMediaIndex]}
              autoPlay
              onLoadedMetadata={handleMediaLoadedMetadata}
              onEnded={handleNextMedia}
            />
          ) : (
            <img
              src={state.media[currentMediaIndex]}
              // onLoadedMetadata={handleMediaLoadedMetadata}
            />
          )}
        </>
        <div className='half' onClick={handlePrevMedia}></div>
        <div className='half second' onClick={handleNextMedia}></div>
      </div>

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
