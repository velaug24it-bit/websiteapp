const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Get Dashboard Statistics & Chart Data
// GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    // Total Stock across products
    const stockAggregation = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: '$stock' } } },
    ]);
    const totalStock = stockAggregation.length > 0 ? stockAggregation[0].totalStock : 0;

    // Total Orders count
    const totalOrders = await Order.countDocuments();

    // Total Sales (Paid orders)
    const salesAggregation = await Order.aggregate([
      { $match: { 'payment.paymentStatus': 'Paid' } },
      { $group: { _id: null, totalSales: { $sum: '$pricing.totalAmount' } } },
    ]);
    const totalSales = salesAggregation.length > 0 ? salesAggregation[0].totalSales : 0;

    // Pending Orders count (Pending, Confirmed, Processing, Packed)
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['Pending', 'Confirmed', 'Processing', 'Packed'] },
    });

    // Delivered Orders count
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

    // Orders by Status Breakdown
    const ordersByStatusRaw = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);
    const ordersByStatus = ordersByStatusRaw.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    // Recent 7 Days Sales Trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          'payment.paymentStatus': 'Paid',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          sales: { $sum: '$pricing.totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top Selling Products
    const bestSellingRaw = await Order.aggregate([
      { $match: { 'payment.paymentStatus': 'Paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.productName' },
          weight: { $first: '$items.weight' },
          totalUnitsSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { totalUnitsSold: -1 } },
      { $limit: 5 },
    ]);

    // Recent Orders preview
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        totalStock,
        totalOrders,
        totalSales,
        pendingOrders,
        deliveredOrders,
      },
      charts: {
        ordersByStatus,
        dailySales: dailyOrders,
        bestSellers: bestSellingRaw,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Customer Directory (Customers with orders)
// GET /api/admin/customers
const getCustomers = async (req, res) => {
  try {
    const customersAggregate = await Order.aggregate([
      {
        $group: {
          _id: '$customer.email',
          name: { $last: '$customer.name' },
          email: { $last: '$customer.email' },
          phone: { $last: '$customer.phone' },
          totalOrders: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$payment.paymentStatus', 'Paid'] }, '$pricing.totalAmount', 0],
            },
          },
          lastOrderDate: { $max: '$createdAt' },
        },
      },
      { $sort: { lastOrderDate: -1 } },
    ]);

    res.json({
      success: true,
      count: customersAggregate.length,
      customers: customersAggregate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single customer and order history
// GET /api/admin/customers/:email
const getCustomerDetail = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ 'customer.email': email.toLowerCase().trim() }).sort({
      createdAt: -1,
    });

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this customer' });
    }

    const customerInfo = orders[0].customer;
    const totalSpent = orders.reduce((sum, ord) => {
      return ord.payment.paymentStatus === 'Paid' ? sum + ord.pricing.totalAmount : sum;
    }, 0);

    res.json({
      success: true,
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        totalOrders: orders.length,
        totalSpent,
      },
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getCustomers,
  getCustomerDetail,
};
