const Product = require('../models/Product');

// Get all products (Public & Admin)
// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, stock, active, sort } = req.query;
    const query = {};

    // For public storefront: by default show active products unless admin specifies active=all or false
    if (active === 'all') {
      // no filter on isActive
    } else if (active === 'false') {
      query.isActive = false;
    } else {
      query.isActive = true;
    }

    // Search by product name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by stock
    if (stock === 'in_stock') {
      query.stock = { $gt: 0 };
    } else if (stock === 'out_of_stock') {
      query.stock = 0;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(query).sort(sortOption);
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product (Admin)
// POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const { name, description, ingredients, weight, price, stock, image, isActive } = req.body;

    if (!name || !description || !weight || price === undefined || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required product details' });
    }

    const product = await Product.create({
      name,
      description,
      ingredients: ingredients || 'Roasted Peanuts (Groundnuts), Pure Organic Jaggery, Cardamom, Ghee',
      weight,
      price: Number(price),
      stock: Number(stock),
      image: image || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product (Admin)
// PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, description, ingredients, weight, price, stock, image, isActive } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (ingredients !== undefined) product.ingredients = ingredients;
    if (weight !== undefined) product.weight = weight;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (image !== undefined) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product (Admin)
// DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
