const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
} = require('../controllers/productController');

// Public Product Routes
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
