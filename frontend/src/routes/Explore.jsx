import React, { useEffect, useState } from 'react';
import { Button, IconButton, MusicianCard } from '../components';
import * as api from '../api/api';
import { useUserData } from '../context/UserContext';

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
