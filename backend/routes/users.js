import express from "express";
import { loginUser, logoutUser, getToken, getUser, registerUser, forgotPasswordUser, resetPasswordUser, contact } from "../controllers/users.js";
import { auth } from '../middlewares/auth.js'

const UsersRouter = express.Router()

UsersRouter.post('/register', registerUser)
UsersRouter.post('/login', loginUser)
UsersRouter.post('/logout', logoutUser)
UsersRouter.post('/get-token', getToken)
UsersRouter.get('/get-user', getUser)
UsersRouter.put('/forgot-password', forgotPasswordUser)
UsersRouter.put('/reset-password', resetPasswordUser)
UsersRouter.post('/contact', contact)
// UsersRouter.put('/updateUser', auth, updateUser)
// UsersRouter.get('/leaderboard', UsersLeaderBoard);

export default UsersRouter