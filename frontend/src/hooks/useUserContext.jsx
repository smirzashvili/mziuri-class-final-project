import { useContext } from "react"
import { UserContext } from "../context/UserContext"

const useUserData = () => useContext(UserContext)

export default useUserData