const crypto = require('crypto');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { getRazorpayInstance } = require('../config/razorpay');
const generateOrderId = require('../utils/orderIdGenerator');

// Calculate delivery charge: Free above 150, otherwise nominal 15 INR
const calculateDeliveryCharge = (subtotal) => {
  if (subtotal === 0) return 0;
  return subtotal >= 150 ? 0 : 15;
};

// Create Razorpay Payment Order
// POST /api/payment/create-order
const createPaymentOrder = async (req, res) => {
  try {
    const { items, customer, shippingAddress, isDemo } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    let calculatedSubtotal = 0;
    const validatedItems = [];

    // Verify each product and current stock from DB directly
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productName || ''} not found`,
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently unavailable`,
        });
      }

      if (product.stock <= 0) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently out of stock`,
        });
      }

      const requestedQty = Number(item.quantity);
      if (requestedQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items are available for "${product.name}". Please reduce quantity.`,
        });
      }

      const itemPrice = product.price; // ALWAYS use DB price
      const itemSubtotal = itemPrice * requestedQty;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        weight: product.weight,
        price: itemPrice,
        quantity: requestedQty,
        subtotal: itemSubtotal,
        image: product.image,
      });
    }

    const deliveryCharge = calculateDeliveryCharge(calculatedSubtotal);
    const totalAmount = calculatedSubtotal + deliveryCharge;
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpay = getRazorpayInstance();
    let razorpayOrderId = null;

    // If live payment requested and Razorpay instance configured:
    if (!isDemo && razorpay && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('demo')) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customerName: customer ? customer.name : '',
            customerPhone: customer ? customer.phone : '',
          },
        });
        razorpayOrderId = rzpOrder.id;
        console.log(` Created real live Razorpay order: ${razorpayOrderId} for amount: ₹${totalAmount}`);
      } catch (err) {
        console.error('Razorpay live order creation error:', err.message);
        return res.status(500).json({
          success: false,
          message: `Razorpay Live Gateway Error: ${err.message}. You can also use the Demo Test Pay option below.`,
        });
      }
    }

    // If demo mode requested or fallback needed
    if (!razorpayOrderId) {
      razorpayOrderId = `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    res.json({
      success: true,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_T386KFxcoIDeU5',
      isLive: !isDemo && razorpayOrderId.startsWith('order_') && !razorpayOrderId.startsWith('order_demo_'),
      pricing: {
        subtotal: calculatedSubtotal,
        deliveryCharge,
        totalAmount,
      },
      validatedItems,
    });
  } catch (error) {
    console.error('Error in createPaymentOrder:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to process your order.' });
  }
};

// Verify Payment and finalize order
// POST /api/payment/verify
const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      customer,
      shippingAddress,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ success: false, message: 'Missing payment identifiers' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing order items' });
    }

    if (!customer || !customer.name || !customer.phone || !customer.email) {
      return res.status(400).json({ success: false, message: 'Complete customer details required' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.houseNumber ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({ success: false, message: 'Complete delivery address required' });
    }

    // Verify signature if not test simulation
    const isTestOrder = razorpayOrderId.startsWith('order_test_');
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!isTestOrder && keySecret && !keySecret.includes('demo')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed. Invalid signature. Please contact support.',
        });
      }
    }

    // Re-verify stock before finalizing order (protecting against race conditions)
    for (const item of items) {
      const prod = await Product.findById(item.productId);
      if (!prod) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.productName}" is no longer available`,
        });
      }
      if (prod.stock < Number(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Stock insufficient for "${prod.name}". Available: ${prod.stock}`,
        });
      }
    }

    // Atomically reduce stock for all items
    const finalItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const prod = await Product.findById(item.productId);
      const qty = Number(item.quantity);
      prod.stock = Math.max(0, prod.stock - qty);
      await prod.save();

      const itemSubtotal = prod.price * qty;
      calculatedSubtotal += itemSubtotal;

      finalItems.push({
        productId: prod._id,
        productName: prod.name,
        weight: prod.weight,
        price: prod.price,
        quantity: qty,
        subtotal: itemSubtotal,
        image: prod.image,
      });
    }

    const deliveryCharge = calculateDeliveryCharge(calculatedSubtotal);
    const totalAmount = calculatedSubtotal + deliveryCharge;

    // Generate unique order ID
    const orderId = generateOrderId();
    const expectedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // 4 days delivery

    // Determine user account to link order and purchased products to
    let linkedUser = req.user ? req.user : null;
    if (!linkedUser && customer.email) {
      linkedUser = await User.findOne({ email: customer.email.toLowerCase().trim() });
    }

    const newOrder = await Order.create({
      orderId,
      customer: {
        userId: linkedUser ? linkedUser._id : null,
        name: customer.name.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        houseNumber: shippingAddress.houseNumber.trim(),
        street: shippingAddress.street.trim(),
        area: shippingAddress.area.trim(),
        city: shippingAddress.city.trim(),
        district: shippingAddress.district.trim(),
        state: shippingAddress.state || 'Tamil Nadu',
        pincode: shippingAddress.pincode.trim(),
        landmark: shippingAddress.landmark ? shippingAddress.landmark.trim() : '',
      },
      items: finalItems,
      pricing: {
        subtotal: calculatedSubtotal,
        deliveryCharge,
        totalAmount,
      },
      payment: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'simulated_test_sig',
        paymentStatus: 'Paid',
        paymentMethod: 'Razorpay',
        paidAt: new Date(),
      },
      orderStatus: 'Confirmed',
      expectedDelivery,
    });

    // Store details of products bought directly into the user's account
    if (linkedUser) {
      if (!linkedUser.orders) linkedUser.orders = [];
      if (!linkedUser.purchasedProducts) linkedUser.purchasedProducts = [];

      linkedUser.orders.push(newOrder._id);

      for (const it of finalItems) {
        linkedUser.purchasedProducts.push({
          productId: it.productId,
          productName: it.productName,
          weight: it.weight,
          price: it.price,
          quantity: it.quantity,
          orderId: newOrder.orderId,
          purchasedAt: new Date(),
        });
      }

      await linkedUser.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error in verifyPaymentAndCreateOrder:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment failed. Please try again.' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
};
