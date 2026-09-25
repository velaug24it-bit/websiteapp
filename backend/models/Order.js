const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  houseNumber: {
    type: String,
    required: [true, 'House/Door number is required'],
    trim: true,
  },
  street: {
    type: String,
    required: [true, 'Street is required'],
    trim: true,
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    default: 'Tamil Nadu',
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
    default: '',
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      name: {
        type: String,
        required: [true, 'Customer name is required'],
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
      },
      phone: {
        type: String,
        required: [true, 'Customer phone number is required'],
      },
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      deliveryCharge: {
        type: Number,
        required: true,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
    },
    payment: {
      razorpayOrderId: {
        type: String,
        default: '',
      },
      razorpayPaymentId: {
        type: String,
        default: '',
      },
      razorpaySignature: {
        type: String,
        default: '',
      },
      paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending',
      },
      paymentMethod: {
        type: String,
        default: 'Razorpay',
      },
      paidAt: {
        type: Date,
      },
      posInfo: {
        cardBrand: { type: String, default: '' },
        last4: { type: String, default: '' },
        authCode: { type: String, default: '' },
        rrn: { type: String, default: '' },
        invoiceNo: { type: String, default: '' },
      },
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Confirmed',
    },
    expectedDelivery: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
