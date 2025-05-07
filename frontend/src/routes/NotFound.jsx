import React, { useEffect } from 'react'
import { useLoader }  from '../context/LoaderContext'

function NotFound() {

  const { useFakeLoader } = useLoader()
  
  useEffect(() => useFakeLoader(), [])

  return (
    <div>NotFound</div>
  )
}

export default NotFound