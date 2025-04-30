import React from 'react'
import Button from './Button'
import reactDom from 'react-dom';

function Modal({children, isModalOpen, setIsModalOpen}) {

  if(!isModalOpen) {
    return null;
  }

  return reactDom.createPortal(
    <div className='modal'>
      <div className='modal__content'>
        {children}
        
        <Button onClick={() => setIsModalOpen(false)}>X</Button>
      </div>
    </div>,
    document.getElementById('modal-root')
  )
}

export default Modal