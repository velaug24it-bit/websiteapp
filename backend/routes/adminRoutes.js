const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
} = require('../controllers/authController');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} = require('../controllers/productController');
const {
  getAllOrdersAdmin,
  updateOrderStatus,
  getOrderById,
} = require('../controllers/orderController');
const {
  getDashboardStats,
  getCustomers,
  getCustomerDetail,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// Public Admin Auth
router.post('/login', adminLogin);

// Protected Admin Routes
router.use(protectAdmin);

router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Products Management
router.get('/products', (req, res, next) => {
  // By default, admin sees all products (active and inactive)
  if (!req.query.active) req.query.active = 'all';
  next();
}, getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Orders Management
router.get('/orders', getAllOrdersAdmin);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', updateOrderStatus);

// Customers Management
router.get('/customers', getCustomers);
router.get('/customers/:email', getCustomerDetail);

module.exports = router;
