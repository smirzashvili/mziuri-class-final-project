import React, { useState, useRef, useEffect } from 'react';
import UserImage from '../assets/icons/eye-closed.svg';
import IconButton from './ui/IconButton';
import Info from '../assets/icons/info.svg';
import Close from '../assets/icons/close.svg';
import Heart from '../assets/icons/heart.svg';
import Refresh from '../assets/icons/refresh.svg';
import { formatAge } from '../utils/textFormat';
import MediaIndicator from './MediaIndicator';

function MusicianCard({ musicianData, onLike, onDislike }) {
  const [state, setState] = useState({
    ...musicianData,
    media: [
      'https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
    ]
  })
  const [infoActive, setInfoActive] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const currentMediaRef = useRef()

  const [rotation, setRotation] = useState(0);
  const positionX = useRef(0);
  const startPositionX = useRef(0);
  const [watermarkState, setWatermarkState] = useState('');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0);

  useEffect(() => {
    if (positionX.current > 150) {
      setWatermarkState('like');
      setWatermarkOpacity(Math.min((positionX.current - 150) / 50, 1));
    } else if (positionX.current < -150) {
      setWatermarkState('nope');
      setWatermarkOpacity(Math.min((Math.abs(positionX.current) - 150) / 50, 1));
    } else {
      setWatermarkState('');
      setWatermarkOpacity(0);
    }
  }, [rotation]); 

  const handleMouseDown = (e) => {
    startPositionX.current = e.clientX;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const dx = e.clientX - startPositionX.current
    positionX.current = dx;
    setRotation(dx / 20);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    console.log(positionX.current)
    if (positionX.current > 200) {
      onLike();
    } else if (positionX.current < -200) {
      onDislike();
    }

    positionX.current = 0;
    setRotation(0);
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prevIndex) => prevIndex !== 0 ? prevIndex - 1 : prevIndex);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prevIndex) => prevIndex !== state.media.length - 1 ? prevIndex + 1 : prevIndex);
  };

  const handleRefresh = () => {
    setCurrentMediaIndex(0)
  }

  const handleLike = () => {
    setWatermarkState('like');
    setWatermarkOpacity(1);
    onLike()
  }

  const handleDislike = () => {
    setWatermarkState('nope');
    setWatermarkOpacity(1);
    onDislike()
  }

  return (
    <div className="musicianCard">
      <div 
        className='card'
        onMouseDown={handleMouseDown} 
        style={{transform: `translateX(${positionX.current}px) rotate(${rotation}deg)`}}
      >
        <MediaIndicator 
          medias={state.media} 
          currentMediaIndex={currentMediaIndex} 
          currentMediaRef={currentMediaRef}
          onHandleNextMedia={handleNextMedia}
        />
        <div
          className={`media`}
        >
          <>
            {state.media[currentMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={state.media[currentMediaIndex]}
                autoPlay
                // onEnded={handleNextMedia}
                ref={currentMediaRef}
              />
            ) : (
              <img
                src={state.media[currentMediaIndex]}
                ref={currentMediaRef}
                // onLoadedMetadata={handleMediaLoadedMetadata}
              />
            )}
          </>
          <div className='half' onMouseUp={handlePrevMedia}></div>
          <div className='half second' onMouseUp={handleNextMedia}></div>
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
            <h2>{state.fullName}, {formatAge(state.date)}</h2>
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

      <div className="controlPanel">
        <IconButton
          icon={Refresh}
          onClick={handleRefresh}
          size={14}
        />
        <IconButton
          icon={Heart}
          onClick={handleLike}
          size={16}
        />
        <IconButton
          icon={Close}
          onClick={handleDislike}
          size={14}
        />
      </div>
    </div>
  );
}

export default MusicianCard;
