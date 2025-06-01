import React, {useEffect,useState} from 'react';
import { Button, IconButton, MusicianCard } from '../components';
import * as api from '../api/api'
import { useUserData } from '../context/UserContext';

function Explore() {
  const [musicianData, setMusicianData] = useState();

  const { userData } = useUserData()

  useEffect(() => {
    const getUserToShow = async () => {
      try {
        const { data } = await api.discover(userData._id);
        setMusicianData(data)
        // setErrorMessages({})
        // login(data)
        // navigate('/explore');
      } catch (error) {
        // setErrorMessages({ error: error?.message });
      } 
    }

    getUserToShow()
  }, []);

  const handleLike = async () => {
    try {
      const { data } = await api.like(userData._id, musicianData._id);
      console.log(data)
    } catch (error) {

    }
  }

  const handleDislike = async () => {
    try {
      const { data } = await api.dislike(userData._id, musicianData._id);
      console.log(data)
    } catch (error) {

    }
  }
  
  return (
    <div className="explore">
      {
      musicianData && 
        <MusicianCard 
          musicianData={musicianData} 
          onLike={handleLike}
          onDislike={handleDislike}
        />
      }
    </div>
  );
}

export default Explore;
