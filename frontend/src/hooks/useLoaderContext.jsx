import { useContext } from "react"
import { LoaderContext } from "../context/LoaderContext"

const useLoader = () => useContext(LoaderContext)

export default useLoader
