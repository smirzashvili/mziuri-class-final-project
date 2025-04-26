import React from 'react';

function InputGroup({ label, name, error, children }) {
  return (
    <div className="inputGroup">
      <label className="label" htmlFor={name}>{label}</label>
      <div className="inputBox">
        {children}
      </div>
      <span className={`error ${error ? 'visible' : ''}`}>{error || '.'}</span>
    </div>
  );
}

export default InputGroup;
