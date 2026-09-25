const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  pushOrderToPosTerminal,
  getPosOrderStatus,
  handlePosWebhook,
} = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/create-order', optionalAuth, createPaymentOrder);
router.post('/verify', optionalAuth, verifyPaymentAndCreateOrder);

// Razorpay Physical POS Machine Endpoints (Option A)
router.post('/pos/push', optionalAuth, pushOrderToPosTerminal);
router.get('/pos/status/:orderId', optionalAuth, getPosOrderStatus);
router.post('/pos/webhook', handlePosWebhook);

module.exports = router;
