import React from 'react'

function UserAvatar({path}) {
  return (
     <div className='userAvatar'>
        <img
          className="image"
          src={path}
        />
    </div>
  )
}

export default UserAvatar