import express from "express";
import { 
    loginUser, 
    logoutUser, 
    getToken, 
    getUser, 
    registerUser, 
    forgotPasswordUser, 
    resetPasswordUser,
    updateUser,
    addToCart,
    removeFromCart,
    updateCartItem,
    addToWishlist,
    removeFromWishlist,
    getCart,
    getWishlist
} from "../controllers/users.js";
import { auth } from '../middlewares/auth.js';

const UsersRouter = express.Router();


UsersRouter.post('/register', registerUser);
UsersRouter.post('/login', loginUser);
UsersRouter.put('/forgot-password', forgotPasswordUser);
UsersRouter.put('/reset-password', resetPasswordUser);
UsersRouter.put('/update', auth, updateUser);

UsersRouter.post('/logout', auth, logoutUser);
UsersRouter.post('/get-token', auth, getToken);
UsersRouter.get('/get-user', auth, getUser);

UsersRouter.get('/profile', auth, getUser);
UsersRouter.post('/auth/logout', auth, logoutUser);
UsersRouter.get('/auth/verify', auth, getToken);


UsersRouter.post('/cart', auth, addToCart);
UsersRouter.delete('/cart/:productId', auth, removeFromCart);
UsersRouter.put('/cart/:productId', auth, updateCartItem);
UsersRouter.get('/cart', auth, getCart);


UsersRouter.post('/wishlist', auth, addToWishlist);
UsersRouter.delete('/wishlist/:productId', auth, removeFromWishlist);
UsersRouter.get('/wishlist', auth, getWishlist);

export default UsersRouter;