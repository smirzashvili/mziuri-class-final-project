import React, { createContext, useContext, useState, useEffect } from 'react';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [soundOn, setSoundOn] = useState(() => {
    return localStorage.getItem('sound') ? localStorage.getItem('sound') === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('sound', soundOn);
  }, [soundOn]);

  return (
    <SoundContext.Provider value={{ soundOn, setSoundOn }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
