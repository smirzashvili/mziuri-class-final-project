import React from 'react'
import { Logo } from '../components'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className='sidebar'>
       <Link to="/explore" className='logoContainer'>
          <Logo hasAnimation={false}/>
        </Link>
    </aside>
  )
}

export default Sidebar