import React from 'react'

function Button({variant, ...props}) {
  return (
    <button
      className={`button ${variant ? variant : ''}`}
      {...props}
    >
      <div class="cut-left"></div>
      <div class="cut-right"></div>
      <span>{props.children}</span>
    </button>
  )
}

export default Button