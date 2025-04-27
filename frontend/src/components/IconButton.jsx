import React from 'react';

function IconButton({ icon, size, additionalClassnames, ...props }) {
  return (
    <button 
      className={`iconButton ${additionalClassnames ? additionalClassnames : ''}`}
      {...props}
    >
      <img 
        src={icon} 
        alt="icon" 
        style={{ width: size, height: size}}
      />
    </button>
  );
}

export default IconButton;
