import React from 'react';
import { useNotification } from '../context/NotificationContext';

const Notification = () => {
  const { notification, visible } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification ${visible ? 'fade-in' : 'fade-out'}`}>
      {notification}
    </div>
  );
};

export default Notification;
