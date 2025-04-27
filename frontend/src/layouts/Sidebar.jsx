import React, { useState } from 'react'
import { Button, Logo, NavigationScreen, IconButton } from '../components'
import { Link, useNavigate } from 'react-router-dom'
import Navigation from '../assets/icons/navigation.svg'

function Sidebar() {

  const navigate = useNavigate()
  const [isNavbarVisible, setIsNavbarVisible] = useState(false)

  return (
    <>
      <aside className='sidebar'>
        <Link to="/explore" className='logoContainer'>
          <Logo hasAnimation={false}/>
        </Link>

        <IconButton icon={Navigation} onClick={() => setIsNavbarVisible(true)} size={20} />

        <div className='buttonsContainer'>
          <Button onClick={() => navigate("/login")}>Login</Button>
        </div>
      </aside>
      {isNavbarVisible && <NavigationScreen setVisible={setIsNavbarVisible} />}   
    </>
  )
}

export default Sidebar