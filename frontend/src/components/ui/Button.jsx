import React from 'react';

function Button({ additionalClassnames, ...props }) {
  return (
    <button
      className={`button ${additionalClassnames ? additionalClassnames : ''}`}
      {...props}
    >
      {props.children}
    </button>
  );
}

export default Button;
