const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log(' Seeding database...');

    // Clear existing records if any
    await Admin.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});

    // 1. Create Default Admin
    const admin = await Admin.create({
      name: 'Kadalai Mittai Admin',
      email: 'admin@kadalaicandy.com',
      password: 'Admin@123456',
      role: 'admin',
    });
    console.log(` Admin account created: ${admin.email}`);

    // 2. Create Demo Customer
    const demoUser = await User.create({
      name: 'Rajesh Kumar',
      email: 'customer@gmail.com',
      phone: '9876543210',
      password: 'Customer@123',
    });
    console.log(` Demo customer created: ${demoUser.email}`);

    // 3. Create Sample Products
    const products = await Product.create([
      {
        name: 'Classic Groundnut Candy',
        description: 'Authentic Kovilpatti style crunchy Kadalai Mittai handcrafted using premium golden roasted peanuts and clarified organic jaggery syrup. Traditional crunch in every bite.',
        ingredients: 'Selected Roasted Peanuts (Groundnuts), Organic Sugarcane Jaggery, Liquid Glucose, Cardamom, Pure Ghee',
        weight: '100g',
        price: 50,
        stock: 100,
        image: '/images/products/classic_groundnut_candy.jpg',
        isActive: true,
        rating: 4.9,
        reviewCount: 124,
      },
      {
        name: 'Premium Groundnut Candy',
        description: 'Specially hand-sorted bold groundnuts roasted to perfection and combined with rich dark palm jaggery (Karupatti) for an exquisite melt-in-mouth aroma and royal crunch.',
        ingredients: 'Grade-A Bold Roasted Peanuts, Dark Palm Jaggery (Karupatti), Organic Jaggery, Dried Ginger (Sukku), Cardamom',
        weight: '250g',
        price: 110,
        stock: 80,
        image: '/images/products/premium_groundnut_candy.jpg',
        isActive: true,
        rating: 5.0,
        reviewCount: 96,
      },
      {
        name: 'Family Pack Groundnut Candy',
        description: 'Wholesome sharing box packed with individually wrapped squares of freshly prepared Kadalai Mittai. Perfect for festive celebrations, healthy evening snacks, and family bonding.',
        ingredients: 'Farm-Fresh Roasted Groundnuts, Traditional Natural Jaggery, Pure Cow Ghee, Nutmeg, Cardamom Powder',
        weight: '500g',
        price: 200,
        stock: 50,
        image: '/images/products/family_pack_candy.jpg',
        isActive: true,
        rating: 4.8,
        reviewCount: 78,
      },
      {
        name: 'Special Pack Groundnut Candy',
        description: 'Grand master pack for true Kadalai Mittai connoisseurs. Contains our finest heritage recipe candy with extra roasted peanut ratio, zero refined sugar, and pure festive sweetness.',
        ingredients: 'Double Roasted Peanuts, Pure Country Palm & Sugarcane Jaggery, Cardamom, Ghee, Dry Ginger',
        weight: '1kg',
        price: 380,
        stock: 30,
        image: '/images/products/special_pack_candy.jpg',
        isActive: true,
        rating: 4.9,
        reviewCount: 154,
      },
    ]);
    console.log(` Created ${products.length} products`);

    // 4. Create Initial Sample Orders for Rich Dashboard Experience
    const sampleOrder1 = await Order.create({
      orderId: 'GNC-20260920-A1B2',
      customer: {
        userId: demoUser._id,
        name: 'Raj Kumar',
        email: 'customer@gmail.com',
        phone: '9876543210',
      },
      shippingAddress: {
        houseNumber: '12/45',
        street: 'Main Road',
        area: 'Gandhipuram',
        city: 'Coimbatore',
        district: 'Coimbatore',
        state: 'Tamil Nadu',
        pincode: '641012',
        landmark: 'Opposite Cross Cut Signal',
      },
      items: [
        {
          productId: products[0]._id,
          productName: products[0].name,
          weight: products[0].weight,
          price: products[0].price,
          quantity: 3,
          subtotal: 150,
          image: products[0].image,
        },
        {
          productId: products[1]._id,
          productName: products[1].name,
          weight: products[1].weight,
          price: products[1].price,
          quantity: 2,
          subtotal: 220,
          image: products[1].image,
        },
      ],
      pricing: {
        subtotal: 370,
        deliveryCharge: 0,
        totalAmount: 370,
      },
      payment: {
        razorpayOrderId: 'order_seed_demo_01',
        razorpayPaymentId: 'pay_seed_demo_01',
        razorpaySignature: 'sig_seed_demo_01',
        paymentStatus: 'Paid',
        paymentMethod: 'Razorpay',
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      orderStatus: 'Delivered',
      expectedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    const sampleOrder2 = await Order.create({
      orderId: 'GNC-20260922-C3D4',
      customer: {
        name: 'Priya Sundaram',
        email: 'priya.s@outlook.com',
        phone: '9443210987',
      },
      shippingAddress: {
        houseNumber: '4B',
        street: 'Temple View Avenue',
        area: 'Anna Nagar',
        city: 'Madurai',
        district: 'Madurai',
        state: 'Tamil Nadu',
        pincode: '625020',
        landmark: 'Near Meenakshi Amman Arch',
      },
      items: [
        {
          productId: products[2]._id,
          productName: products[2].name,
          weight: products[2].weight,
          price: products[2].price,
          quantity: 1,
          subtotal: 200,
          image: products[2].image,
        },
        {
          productId: products[0]._id,
          productName: products[0].name,
          weight: products[0].weight,
          price: products[0].price,
          quantity: 2,
          subtotal: 100,
          image: products[0].image,
        },
      ],
      pricing: {
        subtotal: 300,
        deliveryCharge: 0,
        totalAmount: 300,
      },
      payment: {
        razorpayOrderId: 'order_seed_demo_02',
        razorpayPaymentId: 'pay_seed_demo_02',
        razorpaySignature: 'sig_seed_demo_02',
        paymentStatus: 'Paid',
        paymentMethod: 'Razorpay',
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      orderStatus: 'Processing',
      expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    console.log(` Created sample orders: ${sampleOrder1.orderId}, ${sampleOrder2.orderId}`);
    console.log(' Database seed complete!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
