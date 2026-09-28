const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUserCart,
  updateUserCart,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protectCustomer } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protectCustomer, getUserProfile);

// Customer User-Specific Cart Routes
router.get('/cart', protectCustomer, getUserCart);
router.put('/cart', protectCustomer, updateUserCart);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
