import React, { useState } from 'react'
import UserImage from '../assets/temp/userImage.jpg'

function MusicianCard() {

  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  const handlePrevAsset = () => {
    setCurrentAssetIndex((prevIndex) =>
      prevIndex - 1
    );
  };

  const handleNextAsset = () => {
    setCurrentAssetIndex((prevIndex) =>
      prevIndex + 1
    );
  };

  return (
    <div className='musicianCard'>
        <div className="indicators">
            {Array.from({ length: 3 }).map((_, index) => (
            <div
                key={index}
                className={`indicator ${index === currentAssetIndex ? "active" : ""}`}
                // onClick={() => setCurrentIndex(index)}
                // data-tooltip={`${t("index")} ${index + 1}`}
            />
            ))}

        </div>
        <img className='image' src={UserImage} />

    </div>
  )
}

export default MusicianCard