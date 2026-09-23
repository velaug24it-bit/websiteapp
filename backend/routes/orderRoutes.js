const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  getOrderById,
} = require('../controllers/orderController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/my-orders', optionalAuth, getMyOrders);
router.get('/:id', optionalAuth, getOrderById);

module.exports = router;
