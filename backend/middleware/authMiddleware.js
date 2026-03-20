const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies the JWT token from the Authorization header.
 * Attaches the authenticated user to req.user.
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - Token invalid',
    });
  }
};

/**
 * Role Authorization Middleware Factory
 * Restricts access to specific roles.
 * Usage: roleMiddleware('admin', 'instructor')
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
