import express from "express";
import { loginUser } from "../controllers/users.js";
import { auth } from '../middlewares/auth.js'

const UsersRouter = express.Router()

UsersRouter.post('/login', loginUser)

export default UsersRouter