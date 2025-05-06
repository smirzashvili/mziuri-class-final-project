import React, { useState } from 'react'
import { Button, Logo, NavigationScreen, IconButton } from '../components'
import { Link, useNavigate } from 'react-router-dom'
import Navigation from '../assets/icons/navigation.svg'
import * as api from '../api/api.js'

function Sidebar({loggedIn, setLoggedIn}) {

  const navigate = useNavigate()
  const [isNavbarVisible, setIsNavbarVisible] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await api.logoutUser();
  
      if (response.data) {
        setLoggedIn(false)
        navigate('/login');
      }
    } catch (err) {

    }
  }

  return (
    <>
      <aside className='sidebar'>
        <Link to="/explore" className='logoContainer'>
          <Logo hasAnimation={false}/>
        </Link>

        <IconButton icon={Navigation} onClick={() => setIsNavbarVisible(true)} size={20} />

        <div className='buttonsContainer'>
          <Button onClick={() => navigate("/login")}>Login</Button>
          {loggedIn && <Button onClick={handleLogout} additionalClassnames="secondary">Logout</Button>}
        </div>
      </aside>
      <NavigationScreen visible={isNavbarVisible} setVisible={setIsNavbarVisible} />  
    </>
  )
}

export default Sidebar