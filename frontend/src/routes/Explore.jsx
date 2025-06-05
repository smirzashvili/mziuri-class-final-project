import React, { useEffect, useState } from 'react';
import { Button, IconButton, MusicianCard } from '../components';
import * as api from '../api/api';
import { useUserData } from '../context/UserContext';
import Heart from '../assets/icons/heart.svg';
import Close from '../assets/icons/close.svg';
import Refresh from '../assets/icons/refresh.svg';

function Explore() {
  const [musicianData, setMusicianData] = useState();
  const { userData } = useUserData();

  const getUserToShow = async () => {
    try {
      const { data } = await api.discover(userData._id);
      setMusicianData(data);
    } catch (error) {
      console.error('Error fetching musician:', error);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      getUserToShow();
    }
  }, [userData]);

  const handleLike = async () => {
    try {
      await api.like(userData._id, musicianData._id);
      getUserToShow(); // fetch next
    } catch (error) {
      console.error('Error liking:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await api.dislike(userData._id, musicianData._id);
      getUserToShow(); // fetch next
    } catch (error) {
      console.error('Error disliking:', error);
    }
  };

  return (
    <div className="explore">
      <div className='docs'>
          <IconButton
            icon={Heart}
            size={12}
          />
          or swipe right to Like,
          <IconButton
            icon={Close}
            size={12}
          />
          or swipe left to Dislike,
          <IconButton
            icon={Refresh}
            size={12}
          />
          to Refresh Content
      </div>
      {musicianData && (
        <MusicianCard 
          musicianData={musicianData} 
          onLike={handleLike}
          onDislike={handleDislike}
        />
      )}
    </div>
  );
}

export default Explore;
