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
        console.log(data)
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
  
  return (
    <div className="explore">
      {musicianData && <MusicianCard musicianData={musicianData} />}
    </div>
  );
}

export default Explore;
