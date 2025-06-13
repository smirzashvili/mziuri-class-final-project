import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom';
import Close from '../../assets/icons/close.svg';
import IconButton from './IconButton';
import Confetti from "react-confetti"

function Modal({children, isModalOpen, setIsModalOpen, onClose}) {
  
  const [fadeClass, setFadeClass] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      setFadeClass(isModalOpen ? 'fade-in' : '')
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000) // Stop confetti after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  if(!isModalOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={`modal ${fadeClass}`} onClick={() => {setIsModalOpen(false); onClose()}}>
      {
          showConfetti && 
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
      }
      <div className='box' onClick={(e) => e.stopPropagation()}>
        {children}
        
        <IconButton
          icon={Close}
          onClick={() => {setIsModalOpen(false); onClose()}}
          size={"calc(16px * var(--app-scale))"}
          additionalClassnames={'closeButton'}
        />
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default Modal