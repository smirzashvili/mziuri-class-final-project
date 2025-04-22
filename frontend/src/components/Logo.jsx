import React from 'react'
import LogoImg from '../assets/images/logo.png'

function Logo({hasAnimation}) {
  return (
    <img 
        id='logo' 
        src={LogoImg} 
        className={`${hasAnimation ? 'animated' : ''}`}
    />
  )
}

export default Logo