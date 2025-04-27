import React from 'react'

function Button({variant, ...props}) {
  return (
    <button
      className={`button ${variant ? variant : ''}`}
      {...props}
    >
      <div className="cut-left"></div>
      <div className="cut-right"></div>
      <span>{props.children}</span>
    </button>
  )
}

export default Button