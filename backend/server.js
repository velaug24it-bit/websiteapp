const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to Database
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/local
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Helper to get normalized frontend URL
const getFrontendUrl = () => {
  const url = (process.env.FRONTEND_URL || 'https://sweatapp.netlify.app').trim().replace(/\/+$/, '');
  return url.startsWith('http') ? url : `https://${url}`;
};

// Auto-redirect browser requests for /admin, /admin/login to Netlify frontend app
app.get(['/admin/login', '/admin', '/admin/*'], (req, res) => {
  const frontendUrl = getFrontendUrl();
  return res.redirect(`${frontendUrl}${req.originalUrl}`);
});

// Root endpoint: returns friendly landing page in browser, JSON for APIs/Render health check
app.get('/', (req, res) => {
  const frontendUrl = getFrontendUrl();
  if (req.accepts('html')) {
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kadalai Mittai API Server</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FAF7F2; color: #261108; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: white; border: 1px solid #E5D5C5; border-radius: 24px; padding: 32px; max-width: 440px; width: 100%; text-align: center; box-shadow: 0 10px 30px rgba(38,17,8,0.08); }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #ECFDF5; color: #047857; border-radius: 999px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
    .badge-dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; }
    h1 { margin: 0 0 8px 0; font-size: 24px; color: #4A2A17; }
    p { font-size: 13px; color: #785A48; margin: 0 0 24px 0; line-height: 1.5; }
    .btn-group { display: flex; flex-direction: column; gap: 10px; }
    .btn { display: block; padding: 14px 20px; border-radius: 14px; font-weight: 700; font-size: 14px; text-decoration: none; transition: transform 0.15s, opacity 0.15s; }
    .btn-admin { background: #0F172A; color: #FCD34D; }
    .btn-primary { background: linear-gradient(135deg, #C27803, #4A2A17); color: white; }
    .btn-secondary { background: #F4ECE1; color: #4A2A17; }
    .btn:active { transform: scale(0.98); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge"><span class="badge-dot"></span> Backend API Live & Healthy</div>
    <h1>🥜 Kadalai Mittai API</h1>
    <p>You have reached the Express REST API backend on Render. Click below to access the website or the admin portal:</p>
    <div class="btn-group">
      <a href="${frontendUrl}/admin/login" class="btn btn-admin">🛡️ Open Admin Portal Login</a>
      <a href="${frontendUrl}" class="btn btn-primary">🛒 Open Customer Store</a>
      <a href="/api/health" class="btn btn-secondary">📡 Check API Health (JSON)</a>
    </div>
  </div>
</body>
</html>
    `);
  }
  return res.status(200).json({
    status: 'online',
    service: 'Groundnut Candy (Kadalai Mittai) API',
    version: '1.0.0',
    frontend: frontendUrl,
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Groundnut Candy (Kadalai Mittai) E-Commerce API',
  });
});

// API Routes (mounted with /api prefix and also root fallback for deployment resilience)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/payment', paymentRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(` Groundnut Candy API Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = { app, server };
