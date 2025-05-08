import React from 'react';

function FancyButton({ ...props }) {
  return (
    <button
      className={`fancyButton`}
      {...props}
    >
      <div className="cut-left"></div>
      <div className="cut-right"></div>
      <span>{props.children}</span>
    </button>
  );
}

export default FancyButton;
