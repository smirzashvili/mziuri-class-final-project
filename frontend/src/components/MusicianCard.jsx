import React, { useState, useRef, useEffect } from 'react';
import IconButton from './ui/IconButton';
import Info from '../assets/icons/info.svg';
import Close from '../assets/icons/close.svg';
import Heart from '../assets/icons/heart.svg';
import Refresh from '../assets/icons/refresh.svg';
import { formatAge } from '../utils/textFormat';
import MediaIndicator from './MediaIndicator';
import { useSound } from '../context/SoundContext'; // 👈

function MusicianCard({ musicianData, onLike, onDislike }) {
  const [media, setMedia] = useState([
    'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    'https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
  ]);
  const [infoActive, setInfoActive] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const currentMediaRef = useRef()
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);

  const [rotation, setRotation] = useState(0);
  const positionX = useRef(0);
  const startPositionX = useRef(0);
  const [watermarkState, setWatermarkState] = useState('');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0);

  const { soundOn } = useSound(); // 👈

  useEffect(() => {
    setMediaLoaded(false);
  }, [currentMediaIndex]);

  useEffect(() => {
    //TEST
    setMedia([
      media[0] === 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' ? 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      'https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg',
    ])
    //
    setCurrentMediaIndex(0);
    setInfoActive(false);   
    setRotation(0);              
    positionX.current = 0;     
    setWatermarkState('');       
    setWatermarkOpacity(0);      
  }, [musicianData]);

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
    if (positionX.current > 200) {
      onLike();
    } else if (positionX.current < -200) {
      onDislike();
    }

    positionX.current = 0;
    setRotation(0);
  };

  const handleTouchStart = (e) => {
    startPositionX.current = e.touches[0].clientX;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    const dx = e.touches[0].clientX - startPositionX.current;
    positionX.current = dx;
    setRotation(dx / 20);
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
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
    setCurrentMediaIndex((prevIndex) => prevIndex !== media.length - 1 ? prevIndex + 1 : prevIndex);
  };

  const handleRefresh = () => {
    setCurrentMediaIndex(0)
    setRefreshKey(p => p + 1)
    if (currentMediaRef.current instanceof HTMLVideoElement && currentMediaRef.current) {
      currentMediaRef.current.pause();
      currentMediaRef.current.currentTime = 0;
      currentMediaRef.current.load(); // Optional: forces reload if needed
      currentMediaRef.current.play(); // Optional: restart playback
    } else {
      // currentMediaRef.current.pause();
    }
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
        onTouchStart={handleTouchStart}
        style={{transform: `translateX(${positionX.current}px) rotate(${rotation}deg)`}}
      >
        <MediaIndicator 
          key={refreshKey}
          medias={media} 
          currentMediaIndex={currentMediaIndex} 
          currentMediaRef={currentMediaRef}
          onHandleNextMedia={handleNextMedia}
          musicianData={musicianData}
          mediaLoaded={mediaLoaded}
        />
        <div
          className={`media`}
        >
          <>
            {media[currentMediaIndex].match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={media[currentMediaIndex]}
                autoPlay
                preload="metadata" // or "auto" or "none"
                muted={!soundOn}
                // onEnded={handleNextMedia}
                ref={currentMediaRef}
                onLoad={() => setMediaLoaded(true)}
              />
            ) : (
              <img
                src={media[currentMediaIndex]}
                ref={currentMediaRef}
                onLoad={() => setMediaLoaded(true)}
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
            size={"calc(16px * var(--app-scale))"}
          />
          <div className='section'>
            <h2>{musicianData.fullName}</h2>
            <p>Lives in {musicianData.city}</p>
          </div>
          {infoActive && <div className='additional'>
            <div className='section'>
              <h3>Age</h3>
              <p> {formatAge(musicianData.date)} years old</p>
            </div>
            {
              musicianData.bio &&
              <div className='section'>
                <h3>Bio</h3>
                <p>{musicianData.bio}</p>
              </div>
            }
            <div className='section'>
              <h3>Favorite Genre</h3>
              <p>{musicianData.favoriteGenre}</p>
            </div>
            <div className='section'>
              <h3>Favorite Instruemnt</h3>
              <p>{musicianData.favoriteInstrument}</p>
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
          size={"calc(14px * var(--app-scale))"}
        />
        <IconButton
          icon={Heart}
          onClick={handleLike}
          size={"calc(16px * var(--app-scale))"}
        />
        <IconButton
          icon={Close}
          onClick={handleDislike}
          size={"calc(14px * var(--app-scale))"}
        />
      </div>
    </div>
  );
}

export default MusicianCard;
