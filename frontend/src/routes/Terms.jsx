import React, { useEffect } from 'react'
import { useLoader } from '../hooks/useLoader'

function Terms() {

  const { useFakeLoader } = useLoader()
  
  useEffect(() => useFakeLoader(), [])

  return (
    <div>Terms</div>
  )
}

export default Terms