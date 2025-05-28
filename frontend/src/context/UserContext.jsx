import { createContext, useState, useContext } from 'react';

const UserContext = createContext({
  userData: null,
});

export const useUserData = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async (userData) => {
    setUserData(userData);
    setLoggedIn(true);
  }  

  const logout = () => {
    setUserData(null);
    setLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ loggedIn, userData, login, logout  }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
