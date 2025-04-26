import React from 'react'

function Button({variant, ...props}) {
  return (
    <button
      className={`button ${variant ? variant : ''}`}
      {...props}
    >
      {/* <svg viewBox="0 0 200 60" preserveAspectRatio="none">
        <path 
          d="M0,0 
            H300 
            Q270,50 300,100 
            H0 
            Q30,50 0,0 
            Z" 
          stroke="black" 
          strokeWidth="2" // React uses camelCase, not stroke-width
          fill="white" // default fill
        /> 
      </svg>*/}
      {props.children}
    </button>
  )
}

export default Button