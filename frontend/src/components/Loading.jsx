import React from 'react'
import { useLoader } from '../hooks/useLoader'

function Loading() {

  const {loading} = useLoader()
  
  return (
    <div className={`loading ${!loading ? 'fade-out' : ''}`}>
      <div className='half'></div>
      <div className='half'></div>
      <span className="spinner"></span>
    </div>
  )
}

export default Loading