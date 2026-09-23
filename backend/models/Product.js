const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    ingredients: {
      type: String,
      default: 'Roasted Peanuts (Groundnuts), Pure Organic Jaggery, Cardamom Powder, Clarified Butter (Ghee)',
    },
    weight: {
      type: String,
      required: [true, 'Weight is required (e.g., 100g, 250g, 500g, 1kg)'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be non-negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock must be non-negative'],
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 48,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
