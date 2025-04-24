import React from 'react'
import { Button, Logo } from '../components'
import { Link, useNavigate } from 'react-router-dom'

function Sidebar() {

  const navigate = useNavigate()

  return (
    <aside className='sidebar'>
      <Link to="/explore" className='logoContainer'>
        <Logo hasAnimation={false}/>
      </Link>
      <div className='buttonsContainer'>
        <Button onClick={() => navigate("/login")}>Login</Button>
      </div>
    </aside>
  )
}

export default Sidebar