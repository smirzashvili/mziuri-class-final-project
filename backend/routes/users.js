import express from "express";
import { loginUser, logoutUser, getToken, getUser, registerUser, forgotPasswordUser, resetPasswordUser, contact, updateUser, discover, like, dislike, getGuestUser } from "../controllers/users.js";
import { auth } from '../middlewares/auth.js'

const UsersRouter = express.Router()

UsersRouter.post('/register', registerUser)
UsersRouter.post('/login', loginUser)
UsersRouter.post('/logout', logoutUser)
UsersRouter.post('/get-token', getToken)
UsersRouter.get('/get', getUser)
UsersRouter.post('/get-guest', getGuestUser)
UsersRouter.put('/forgot-password', forgotPasswordUser)
UsersRouter.put('/reset-password', resetPasswordUser)
UsersRouter.post('/contact', contact)
UsersRouter.put('/update', auth, updateUser)
UsersRouter.get('/discover/:userId', auth, discover)
UsersRouter.post('/:targetId/like', auth, like)
UsersRouter.post('/:targetId/dislike', auth, dislike)

export default UsersRouter