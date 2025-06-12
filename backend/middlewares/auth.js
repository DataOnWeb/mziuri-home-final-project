import jwt from 'jsonwebtoken'

// Enhanced auth middleware with better error handling
export const auth = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ err: 'Access denied. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded // Attach user info to request object
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ err: 'Token expired. Please login again.' })
        }
        return res.status(401).json({ err: 'Invalid token' })
    }   
}

// Optional auth middleware (doesn't block if no token)
export const optionalAuth = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        req.user = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        req.user = null
        next()
    }
}

// Admin auth middleware (requires admin role)
export const adminAuth = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ err: 'Access denied. No token provided.' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        
        // You'll need to add role field to your user model
        if (decoded.role !== 'admin') {
            return res.status(403).json({ err: 'Access denied. Admin privileges required.' })
        }
        
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ err: 'Invalid token' })
    }
}

export default auth