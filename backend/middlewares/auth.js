import jwt from 'jsonwebtoken'
import Users from '../models/Users.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ err: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await Users.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ err: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ err: 'Invalid token' });
  }
};

export const auth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ err: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Users.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ err: 'User not found' });
        }

        req.user = user; 
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ err: 'Token expired. Please login again.' });
        }
        return res.status(401).json({ err: 'Invalid token' });
    }   
}


export const optionalAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Users.findById(decoded.id).select('-password');
        req.user = user || null;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
}


export const adminAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ err: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Users.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ err: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ err: 'Access denied. Admin privileges required.' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ err: 'Invalid token' });
    }
}