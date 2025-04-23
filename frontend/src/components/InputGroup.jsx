import React from 'react'

function InputGroup({ type = "text", label, name, value, onChange, error }) {
  return (
    <div className="inputGroup">
      <label className='label' htmlFor={name}>{label}</label>
      <input
        className='input'
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
      {error && <span className='error'>{error}</span>}
    </div>
  )
}

export default InputGroup