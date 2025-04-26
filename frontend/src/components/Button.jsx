import React from 'react'

function Button({variant, ...props}) {
  return (
    <button
      className={`button ${variant ? variant : ''}`}
      {...props}
    >
      {props.children}
    </button>
  )
}

export default Button