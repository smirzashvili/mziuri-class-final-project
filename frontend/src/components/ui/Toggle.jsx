import React, { useState } from 'react';

function Toggle({ additionalClassnames = '', onToggle, defaultOn = false }) {
  const [isOn, setIsOn] = useState(defaultOn);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <button
      className={`toggle ${isOn ? 'on' : 'off'} ${additionalClassnames}`}
      onClick={handleClick}
    >
      <span className="toggle-slider" />
    </button>
  );
}

export default Toggle;
