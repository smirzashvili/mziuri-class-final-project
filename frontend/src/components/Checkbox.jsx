import React from 'react';

function Checkbox({ additionalClassnames, ...props }) {
  return (
    <div className={`checkbox`}>
      <input {...props} />
      <span className={`checkmark ${additionalClassnames ? additionalClassnames : ''}`}></span>
    </div>
  );
}

export default Checkbox;
