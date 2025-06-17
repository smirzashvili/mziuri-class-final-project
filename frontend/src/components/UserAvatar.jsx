import React from 'react'
import male1 from '../assets/icons/user/male1.svg';
import male2 from '../assets/icons/user/male2.svg';
import male3 from '../assets/icons/user/male3.svg';
import male4 from '../assets/icons/user/male4.svg';
import female1 from '../assets/icons/user/female1.svg';
import female2 from '../assets/icons/user/female2.svg';
import female3 from '../assets/icons/user/female3.svg';
import female4 from '../assets/icons/user/female4.svg';

const avatars = {
  male: [male1, male2, male3, male4],
  female: [female1, female2, female3, female4],
};

function UserAvatar({gender, avatarIndex}) {
  const avatarSrc = avatars[gender]?.[avatarIndex - 1] || male1; // fallback

  return (
     <div className='userAvatar'>
        <img
          className="image"
          src={avatarSrc}
        />
    </div>
  )
}

export default UserAvatar