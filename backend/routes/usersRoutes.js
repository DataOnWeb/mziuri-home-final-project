import express from "express";
import { loginUser, logoutUser, getToken, getUser, registerUser, forgotPasswordUser, resetPasswordUser } from "../controllers/users.js";
import { auth } from '../middlewares/auth.js'

const UsersRouter = express.Router()

UsersRouter.post('/register', registerUser)
UsersRouter.post('/login', loginUser)
UsersRouter.post('/get-token', getToken)
UsersRouter.get('/get-user', getUser)
UsersRouter.put('/forgot-password', forgotPasswordUser)
UsersRouter.put('/reset-password', resetPasswordUser)

export default UsersRouter

