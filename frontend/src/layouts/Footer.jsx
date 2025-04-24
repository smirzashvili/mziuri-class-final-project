import React from 'react'

function Footer() {
  return (
    <footer className='footer'>
      <p>© {new Date().getFullYear()} MelodyMatch LLC</p>
      <p>All rights reserved.</p>
    </footer>
  )
}

export default Footer