import React from 'react'
import LogoImg from '../assets/images/logo.png'

function Logo({hasAnimation}) {
  return (
    <img 
      className={`logo ${hasAnimation ? 'animated' : ''}`}
      src={LogoImg} 
    />
  )
}

export default Logo