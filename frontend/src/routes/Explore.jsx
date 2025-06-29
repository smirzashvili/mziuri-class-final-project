import React, { useEffect, useState } from 'react';
import { Button, IconButton, MusicianCard } from '../components';
import * as api from '../api/api';
import { useUserData } from '../context/UserContext';
import Heart from '../assets/icons/heart.svg';
import Close from '../assets/icons/close.svg';
import Refresh from '../assets/icons/refresh.svg';
import NewMatchModal from '../modals/NewMatchModal';

function Explore() {
  const [musicianData, setMusicianData] = useState();
  const [noUsersText, setNoUsersText] = useState();
  const { userData } = useUserData();
  const [newMatchModalOpen, setNewMatchModalOpen] = useState(false)

  const getUserToShow = async () => {
    try {
      setNoUsersText(null)
      const { data } = await api.discover(userData._id);
      setMusicianData(data);
      if(!data) {
        setNoUsersText('no users to show')
      } 
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
      const { data } = await api.like(userData._id, musicianData._id);
      if(data.isMatch) {
        setNewMatchModalOpen(true)
      } else {
        getUserToShow(); // fetch next
      }
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
      {musicianData ? 
        <>
          <div className='docs'>
              <IconButton
                icon={Heart}
                size={"calc(12px * var(--app-scale))"}
              />
              or swipe right to Like,
              <IconButton
                icon={Close}
                size={"calc(12px * var(--app-scale))"}
              />
              or swipe left to Dislike,
              <IconButton
                icon={Refresh}
                size={"calc(12px * var(--app-scale))"}
              />
              to Refresh Content
          </div>
          <MusicianCard 
            musicianData={musicianData} 
            onLike={handleLike}
            onDislike={handleDislike}
          />
        </>
        : noUsersText ? 'no users to show' : ''
      }

      {/* MODAL */}
      <NewMatchModal 
        isModalOpen={newMatchModalOpen} 
        setIsModalOpen={setNewMatchModalOpen}
        userData={userData} 
        musicianData={musicianData}
        onClose={getUserToShow}
      />
    </div>
  );
}

export default Explore;
