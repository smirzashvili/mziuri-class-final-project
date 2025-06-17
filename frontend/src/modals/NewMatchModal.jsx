import React, { useEffect, useState } from 'react'
import Modal from '../components/ui/Modal'
import { Button, UserAvatar } from '../components'
import { useNavigate } from 'react-router-dom'
import { formatAge } from '../utils/textFormat'
import Male1 from '../assets/icons/user/male1.svg';
import Female1 from '../assets/icons/user/female2.svg';
import Heart from '../assets/icons/heart.svg';

function NewMatchModal({isModalOpen, setIsModalOpen, userData, musicianData, onClose}) {

  const navigate = useNavigate()

  const handleSendMessageClick = () => {
    setIsModalOpen(false)
    navigate('/chat')
  }

  return (
    <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onClose={onClose}>     
        <div className='newMatchModal'>
            <div className='upperContainer'>
                <h1 className='title'>It's a Match!</h1>
                <p>You and {musicianData?.fullName} liked each other</p>
            </div>
            <div className='bottomContainer'>
                 <div className='photosContainer'>
                    <UserAvatar 
                        avatarIndex={userData?.avatarIndex}
                        gender={userData?.gender}
                    />
                    <UserAvatar 
                        avatarIndex={musicianData?.avatarIndex}
                        gender={musicianData?.gender}
                    />
                </div>
                <h3>{musicianData?.fullName},  {formatAge(musicianData?.date)} years old</h3>
                <p>{userData?.favoriteGenre} admirer and {musicianData?.favoriteGenre} lover with a passion for {userData?.favoriteInstrument} and {musicianData?.favoriteInstrument} has been matched!</p>
                <div className='buttonsContainer'>
                    <Button                 
                        additionalClassnames="secondary"
                        onClick={() => {setIsModalOpen(false); onClose()}}
                    >
                        Keep Swiping
                    </Button>
                    <Button                 
                        onClick={handleSendMessageClick}
                    >
                        Send Message
                    </Button>
                </div>
            </div>
        </div>
    </Modal>
  )
}

export default NewMatchModal