import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  const showNotification = (msg, duration = 3000) => {
    setNotification(msg);
    
    setTimeout(() => {
      setVisible(true);
    }, 10);

    // Set a timeout to trigger the fade-out
    const timer = setTimeout(() => {
      setVisible(false); // Trigger fade out
    }, duration);

    // Clear any existing timeout if a new notification comes in quickly
    return () => clearTimeout(timer);
  };

  // Effect to handle the actual removal from the DOM after fade-out
  useEffect(() => {
    if (notification && !visible) {
      const timer = setTimeout(() => {
        setNotification(null); // trigger deletion
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [notification, visible]);

  return (
    <NotificationContext.Provider value={{ showNotification, notification, visible }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);