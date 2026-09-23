const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
} = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/create-order', optionalAuth, createPaymentOrder);
router.post('/verify', optionalAuth, verifyPaymentAndCreateOrder);

module.exports = router;
