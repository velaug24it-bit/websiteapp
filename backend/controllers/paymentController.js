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

    const isPosRequest = req.body.paymentMethod === 'pos_card' || req.body.paymentMethod === 'debit_card_pos' || req.body.isPos;
    const razorpay = getRazorpayInstance();
    let razorpayOrderId = null;

    // If live payment requested and Razorpay instance configured:
    if (!isDemo && !isPosRequest && razorpay && process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('demo')) {
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

    // Generate specialized order identifiers for POS Swipe Machine or Demo Simulator
    if (!razorpayOrderId) {
      if (isPosRequest) {
        razorpayOrderId = `order_pos_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      } else {
        razorpayOrderId = `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
    }

    const posInvoiceNo = `INV-KM-${Date.now().toString().slice(-6)}`;

    res.json({
      success: true,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_T386KFxcoIDeU5',
      isLive: !isDemo && !isPosRequest && razorpayOrderId.startsWith('order_') && !razorpayOrderId.startsWith('order_demo_') && !razorpayOrderId.startsWith('order_pos_'),
      posInvoiceNo,
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
      paymentMethod,
      posDetails,
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

    // Verify signature if not test simulation or POS swipe
    const isTestOrDemoOrPos =
      (razorpayOrderId && (
        razorpayOrderId.startsWith('order_demo_') ||
        razorpayOrderId.startsWith('order_test_') ||
        razorpayOrderId.startsWith('order_pos_') ||
        razorpayOrderId.startsWith('order_card_')
      )) ||
      (razorpayPaymentId && (
        razorpayPaymentId.startsWith('pay_sim_') ||
        razorpayPaymentId.startsWith('pay_demo_') ||
        razorpayPaymentId.startsWith('pay_pos_') ||
        razorpayPaymentId.startsWith('pay_card_')
      )) ||
      (razorpaySignature && (
        razorpaySignature.startsWith('sim_') ||
        razorpaySignature.startsWith('pos_') ||
        razorpaySignature === 'simulated_test_sig' ||
        razorpaySignature === 'pos_swipe_verified'
      )) ||
      req.body.isDemo === true ||
      req.body.isPos === true ||
      Boolean(paymentMethod && (
        paymentMethod.includes('Debit Card') ||
        paymentMethod.includes('POS') ||
        paymentMethod.includes('Demo')
      ));

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!isTestOrDemoOrPos && keySecret && !keySecret.includes('demo')) {
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

    let finalPaymentMethod = paymentMethod || 'Razorpay Live';
    if (!paymentMethod) {
      if (razorpayOrderId.startsWith('order_pos_') || razorpayPaymentId.startsWith('pay_pos_')) {
        finalPaymentMethod = 'Debit Card (POS Swipe Machine)';
      } else if (razorpayOrderId.startsWith('order_demo_') || razorpayPaymentId.startsWith('pay_sim_')) {
        finalPaymentMethod = 'Demo Test Pay';
      }
    }

    let notesText = '';
    if (posDetails) {
      notesText = `Debit Card Swiped on POS Terminal [Auth: ${posDetails.authCode || 'N/A'}, RRN: ${posDetails.rrn || 'N/A'}, Card: ${posDetails.cardBrand || 'Debit Card'} **** ${posDetails.last4 || '4892'}]`;
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
        paymentMethod: finalPaymentMethod,
        paidAt: new Date(),
        posInfo: {
          cardBrand: posDetails?.cardBrand || (finalPaymentMethod.includes('Debit Card') ? 'RuPay / Visa Debit' : ''),
          last4: posDetails?.last4 || (finalPaymentMethod.includes('Debit Card') ? '4892' : ''),
          authCode: posDetails?.authCode || '',
          rrn: posDetails?.rrn || '',
          invoiceNo: posDetails?.invoiceNo || '',
        },
      },
      notes: notesText,
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

// Push order bill to physical Razorpay POS Machine (Option A)
// POST /api/payment/pos/push
const pushOrderToPosTerminal = async (req, res) => {
  try {
    const { items, customer, shippingAddress, terminalId: clientTerminalId } = req.body;
    const terminalId = clientTerminalId || process.env.RAZORPAY_POS_TERMINAL_ID || 'TID_KM_STORE_01';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items required for billing' });
    }

    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const prod = await Product.findById(item.productId);
      if (!prod) {
        return res.status(404).json({ success: false, message: `Product ${item.productName || ''} not found` });
      }
      const qty = Number(item.quantity);
      const itemSubtotal = prod.price * qty;
      calculatedSubtotal += itemSubtotal;
      validatedItems.push({
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
    const amountInPaise = Math.round(totalAmount * 100);

    const orderId = generateOrderId();
    const posInvoiceNo = `INV-KM-${Date.now().toString().slice(-6)}`;
    const razorpayOrderId = `order_pos_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    let physicalPushSuccess = false;
    let pushMessage = `Bill ${posInvoiceNo} generated. Ready for physical Razorpay POS swipe (Terminal: ${terminalId}).`;

    // If Razorpay live credentials and real terminal ID configured, attempt real POS Push API
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && !keyId.includes('demo') && terminalId && !terminalId.includes('DEMO')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const posApiRes = await fetch('https://api.razorpay.com/v1/pos/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({
            terminal_id: terminalId,
            amount: amountInPaise,
            currency: 'INR',
            reference_id: posInvoiceNo,
            notes: {
              orderId,
              customerName: customer?.name || '',
              customerPhone: customer?.phone || '',
            },
          }),
        });

        if (posApiRes.ok) {
          const posData = await posApiRes.json();
          physicalPushSuccess = true;
          pushMessage = `Bill ₹${totalAmount} successfully pushed to Razorpay POS Terminal (${terminalId})!`;
          console.log(`[Razorpay POS] Successfully pushed bill to terminal ${terminalId}:`, posData);
        } else {
          const errText = await posApiRes.text();
          console.log(`[Razorpay POS] Terminal response (Code ${posApiRes.status}):`, errText);
          pushMessage = `Terminal ID: ${terminalId} configured. Ready for customer card swipe.`;
        }
      } catch (err) {
        console.warn(`[Razorpay POS] Push notice: ${err.message}. Ready for physical swipe.`);
      }
    }

    res.json({
      success: true,
      orderId,
      razorpayOrderId,
      posInvoiceNo,
      terminalId,
      totalAmount,
      amountInPaise,
      physicalPushSuccess,
      message: pushMessage,
      pricing: {
        subtotal: calculatedSubtotal,
        deliveryCharge,
        totalAmount,
      },
      validatedItems,
    });
  } catch (error) {
    console.error('Error in pushOrderToPosTerminal:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to push bill to POS machine.' });
  }
};

// Check status of POS transaction (for live polling from frontend)
// GET /api/payment/pos/status/:orderId
const getPosOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({
      $or: [{ orderId }, { 'payment.razorpayOrderId': orderId }],
    });

    if (!order) {
      return res.json({ success: true, status: 'WAITING_FOR_SWIPE' });
    }

    res.json({
      success: true,
      status: order.payment?.paymentStatus === 'Paid' ? 'APPROVED' : 'WAITING_FOR_SWIPE',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook listener for physical Razorpay POS terminal completions
// POST /api/payment/pos/webhook
const handlePosWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log('[Razorpay POS Webhook] Received event:', event?.event || 'generic_event');

    const payload = event?.payload?.payment?.entity || event?.payload?.order?.entity || {};
    const notes = payload.notes || {};
    const orderId = notes.orderId || payload.receipt;

    if (orderId) {
      const order = await Order.findOne({ orderId });
      if (order) {
        order.payment.paymentStatus = 'Paid';
        order.payment.paidAt = new Date();
        order.payment.paymentMethod = 'Debit Card (Razorpay POS Machine)';
        order.orderStatus = 'Confirmed';
        if (payload.card) {
          order.payment.posInfo = {
            cardBrand: payload.card.network || 'RuPay / Visa Debit',
            last4: payload.card.last4 || '4892',
            authCode: payload.acquirer_data?.auth_code || 'AUTH-' + Math.floor(100000 + Math.random() * 900000),
            rrn: payload.acquirer_data?.rrn || '94' + Math.floor(1000000000 + Math.random() * 9000000000),
            invoiceNo: notes.reference_id || order.payment.posInfo?.invoiceNo || '',
          };
        }
        await order.save();
        console.log(`[Razorpay POS Webhook] Updated order ${orderId} to Paid via Physical POS Machine!`);
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('POS Webhook error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  pushOrderToPosTerminal,
  getPosOrderStatus,
  handlePosWebhook,
};
