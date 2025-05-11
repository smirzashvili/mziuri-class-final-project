import React from 'react';
import { Button, IconButton, MusicianCard } from '../components';
import Close from '../assets/icons/close.svg';
import Heart from '../assets/icons/heart.svg';
import Refresh from '../assets/icons/refresh.svg';

function Explore() {
  return (
    <div className="explore">
      <MusicianCard />
      <div className="controlPanel">
        <IconButton
          icon={Close}
          // onClick={() => setVisible(false)}
          size={14}
        />
        <IconButton
          icon={Heart}
          // onClick={() => setVisible(false)}
          size={16}
        />
        <IconButton
          icon={Refresh}
          // onClick={() => setVisible(false)}
          size={14}
        />
      </div>
    </div>
  );
}

export default Explore;
