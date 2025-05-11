import React, { useState } from 'react';
import UserImage from '../assets/temp/userImage.jpg';
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

  // const handlePrevAsset = () => {
  //   setCurrentAssetIndex((prevIndex) => prevIndex - 1);
  // };

  // const handleNextAsset = () => {
  //   setCurrentAssetIndex((prevIndex) => prevIndex + 1);
  // };

  return (
    <div className="musicianCard">
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
    </div>
  );
}

export default MusicianCard;
