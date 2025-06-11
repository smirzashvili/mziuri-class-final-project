import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom';
import Close from '../../assets/icons/close.svg';
import IconButton from './IconButton';

function Modal({children, isModalOpen, setIsModalOpen, onClose}) {

  const [fadeClass, setFadeClass] = useState('')

  useEffect(() => {
    setFadeClass(isModalOpen ? 'fade-in' : '')
  }, [isModalOpen])

  if(!isModalOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className={`modal ${fadeClass}`} onClick={() => {setIsModalOpen(false); onClose()}}>
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