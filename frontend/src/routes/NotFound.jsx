import React, { useEffect } from 'react'
import { useLoader } from '../hooks/useLoader'

function NotFound() {

  const { useFakeLoader } = useLoader()
  
  useEffect(() => useFakeLoader(), [])

  return (
    <div>NotFound</div>
  )
}

export default NotFound