import React from 'react';
import { IconButton, MusicianCard } from '../components';
import Close from '../assets/icons/close.svg';

function Explore() {
  return (
    <div className="explore">
      <MusicianCard />
      <div className="controlPanel">
        <IconButton
          icon={Close}
          onClick={() => setVisible(false)}
          size={12}
        />
        <IconButton
          icon={Close}
          onClick={() => setVisible(false)}
          size={12}
        />
        <IconButton
          icon={Close}
          onClick={() => setVisible(false)}
          size={12}
        />
      </div>
    </div>
  );
}

export default Explore;
