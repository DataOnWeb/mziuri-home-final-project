import express from "express";
import { 
    loginUser, 
    logoutUser, 
    getToken, 
    getUser, 
    registerUser, 
    forgotPasswordUser, 
    resetPasswordUser 
} from "../controllers/users.js";
import { auth } from '../middlewares/auth.js';

const UsersRouter = express.Router();


UsersRouter.post('/register', registerUser);
UsersRouter.post('/login', loginUser);
UsersRouter.put('/forgot-password', forgotPasswordUser);
UsersRouter.put('/reset-password', resetPasswordUser);


UsersRouter.post('/logout', auth, logoutUser);
UsersRouter.post('/get-token', auth, getToken);
UsersRouter.get('/get-user', auth, getUser);


UsersRouter.get('/profile', auth, getUser);
UsersRouter.post('/auth/logout', auth, logoutUser);
UsersRouter.get('/auth/verify', auth, getToken);

export default UsersRouter;