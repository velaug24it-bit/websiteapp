const Order = require('../models/Order');
const Product = require('../models/Product');

// Get customer orders
// GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const query = {};

    if (req.user) {
      // Authenticated customer: match either userId or email
      query.$or = [{ 'customer.userId': req.user._id }, { 'customer.email': req.user.email }];
    } else if (req.query.email) {
      query['customer.email'] = req.query.email.toLowerCase().trim();
    } else if (req.query.phone) {
      query['customer.phone'] = req.query.phone.trim();
    } else {
      return res.status(400).json({ success: false, message: 'Customer identifier required' });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by ID (orderId or _id)
// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    // Check if valid ObjectId or custom orderId format
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all orders with search and filtering
// GET /api/admin/orders
const getAllOrdersAdmin = async (req, res) => {
  try {
    const { search, paymentStatus, orderStatus, startDate, endDate } = req.query;
    const query = {};

    // Search by Order ID, customer name, phone, email
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { orderId: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.phone': searchRegex },
        { 'customer.email': searchRegex },
      ];
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query['payment.paymentStatus'] = paymentStatus;
    }

    if (orderStatus && orderStatus !== 'all') {
      query.orderStatus = orderStatus;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update order status (with stock restoration on cancellation)
// PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      'Pending',
      'Confirmed',
      'Processing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = orderStatus;

    // Proper stock-restoration logic: If transitioning TO Cancelled from a non-cancelled status, restore stock!
    if (orderStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // If un-cancelling a cancelled order, re-deduct stock
    if (previousStatus === 'Cancelled' && orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatus,
};
