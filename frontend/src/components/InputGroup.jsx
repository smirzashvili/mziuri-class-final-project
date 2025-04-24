import React from 'react'

function InputGroup({ type = "text", label, name, value, onChange, error, children }) {
  return (
    <div className="inputGroup">
      <label className='label' htmlFor={name}>{label}</label>
      <div className='inputBox'>
        <input
          className='input'
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
        />
        {/* icons */}
        {children}
      </div>
      <span className={`error ${error ? 'visible' : ''}`}>{error || '.hghhj'}</span>
    </div>
  )
}

export default InputGroup