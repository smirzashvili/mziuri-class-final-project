import { createContext, useState, useContext } from "react";

const UserContext = createContext({
    userData: null
})

export const useUserData = () => useContext(UserContext)

const UserProvider = ({children}) => {
    const [userData, setUserData] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)

    return (
        <UserContext.Provider value={{loggedIn, setLoggedIn, userData, setUserData}}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContext, UserProvider}