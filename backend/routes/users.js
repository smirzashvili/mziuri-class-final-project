import express from "express";
import { loginUser, logoutUser, getToken, getUser, registerUser, forgotPasswordUser, resetPasswordUser, contact, updateUser } from "../controllers/users.js";
import { auth } from '../middlewares/auth.js'

const UsersRouter = express.Router()

UsersRouter.post('/register', registerUser)
UsersRouter.post('/login', loginUser)
UsersRouter.post('/logout', logoutUser)
UsersRouter.post('/get-token', getToken)
UsersRouter.get('/get', getUser)
UsersRouter.put('/forgot-password', forgotPasswordUser)
UsersRouter.put('/reset-password', resetPasswordUser)
UsersRouter.post('/contact', contact)
UsersRouter.put('/update', auth, updateUser)

export default UsersRouter