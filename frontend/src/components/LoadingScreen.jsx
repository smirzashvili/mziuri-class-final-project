import React from 'react'
import { useLoader } from '../hooks/useLoader'
import Logo from './Logo'

function Loading() {

  const {loading} = useLoader()
  
  return (
    <div className={`loadingScreen ${loading ? 'fade-in' : 'fade-out'}`}>
      <Logo hasAnimation={false}/>
      <div className="progress">
        <div></div>
      </div>
    </div>
  )
}

export default Loading