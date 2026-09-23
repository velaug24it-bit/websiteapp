const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kadalai_mittai_jwt_secret_groundnut_store');

      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Not authorized as admin' });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired admin session. Please login again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }
};

const protectCustomer = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kadalai_mittai_jwt_secret_groundnut_store');

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Customer login required' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kadalai_mittai_jwt_secret_groundnut_store');
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Continue unauthenticated
    }
  }
  next();
};

module.exports = { protectAdmin, protectCustomer, optionalAuth };
