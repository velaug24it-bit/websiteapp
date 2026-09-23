# 🥜 Kadalai Mittai - Traditional Groundnut Candy E-Commerce Platform

A production-ready, modern, responsive full-stack e-commerce web application for authentic South Indian Groundnut Candy (Kadalai Mittai), featuring two complete interfaces: **Customer Storefront** and **Admin Dashboard**.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Authentic Culinary Aesthetic**: Warm brown, golden peanut, organic jaggery, and cream tones inspired by Tamil Nadu heritage.
- **Hero & Story Sections**: Traditional Kovilpatti heritage highlights, GI tag story, and quality guarantees.
- **Dynamic Product Catalog**: Dynamic product cards powered by MongoDB with live prices, weight variations, ratings, and stock indicators.
- **Product Details Page**: High-resolution gallery, ingredients list, and real-time stock-bounded quantity selector `[-] 1 [+]` (prevents selecting more than available stock; auto disables when out of stock).
- **Interactive Shopping Cart**: Line item subtotal formulas (e.g., `₹50 × 2 = ₹100`), free shipping unlock threshold calculator (Free above ₹300), and persistent local storage.
- **Secure Multi-Field Checkout**: Customer information and comprehensive Tamil Nadu shipping address validation.
- **Razorpay Payment Integration**: Integrated with Razorpay Test Mode and interactive payment simulation dialog for end-to-end checkout verification.
- **Order Success Experience**: Celebratory confetti animation, unique sequential order ID (`GNC-YYYYMMDD-XXXX`), and detailed receipt.
- **Order Tracking & History**: Track order stages in real time with status badges and full itemized modal inspection.

### 🛡️ Admin Dashboard
- **Secure Authentication**: Dedicated admin login with JWT verification and protected route middleware.
- **Performance Overview Dashboard**:
  - 6 Key Performance Metric cards: Total Products, Total Stock, Total Orders, Total Sales (₹), Pending Orders, and Delivered Orders.
  - Interactive Recharts charts: Daily Sales Revenue Trend, Orders by Status Distribution, and Top Best-Selling Candies.
  - Quick recent transactions feed.
- **Live Inventory Management**:
  - Products table with thumbnail, live price, available stock counter, active/inactive pill, and quick toggle.
  - Add product form with presets and instant MongoDB persistence.
  - Edit product form to modify price or restock inventory (e.g., 100 → 150 units), immediately reflecting on the storefront.
- **Comprehensive Order Fulfillment**:
  - Filter orders by payment status, order status, or date range.
  - Search orders by Order ID, customer name, phone number, or email.
  - Order details view with complete customer address and line items.
  - Status updater: `Pending` → `Confirmed` → `Processing` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered` → `Cancelled`.
  - **Stock Restoration Logic**: Cancelling an order automatically restocks the reserved products back to the database.
- **Customer Directory**:
  - Aggregated analytics table showing total orders placed and cumulative spend per customer.
  - Inspect any customer's complete purchase history in a single click.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js (v18), Vite |
| **Styling** | Tailwind CSS (Custom culinary palette), Vanilla CSS |
| **Icons & Visuals** | Lucide React, Canvas Confetti |
| **Data Visualization** | Recharts |
| **HTTP Client** | Axios (configured with dynamic JWT interceptors) |
| **Backend Framework** | Node.js, Express.js REST API |
| **Database** | MongoDB Atlas & Local MongoDB with Mongoose |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Payment Gateway** | Razorpay SDK (Test Mode / Sandbox) |

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas account OR local MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Configure Backend Environment
Navigate to `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.uxiis7h.mongodb.net/startupapp?retryWrites=true&w=majority
JWT_SECRET=kadalai_mittai_super_secret_jwt_key_2026_groundnut_store
RAZORPAY_KEY_ID=rzp_test_groundnut_store_demo
RAZORPAY_KEY_SECRET=groundnut_secret_demo_key_2026
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

### 2. Install Dependencies & Seed Initial Data
```bash
# In the backend directory:
cd backend
npm install
node scripts/seed.js
```
The seed script will populate:
- 4 authentic Kadalai Mittai packs (100g, 250g, 500g, 1kg)
- Default Admin account
- Demo Customer account
- Sample orders to populate dashboard charts

### 3. Install Frontend Dependencies
```bash
# In the frontend directory:
cd ../frontend
npm install
```

---

## 🏃 Running the Application

### Start Backend API Server
```bash
cd backend
npm start
# Server runs on: http://localhost:5000
```

### Start Frontend Vite Dev Server
```bash
cd frontend
npm run dev
# Frontend runs on: http://localhost:5173
```

---

## 🔑 Default Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@kadalaicandy.com` | `Admin@123456` |
| **Demo Customer** | `customer@gmail.com` | `Customer@123` |

*(One-click "Auto Fill" buttons are provided on both customer and admin login screens for swift testing!)*

---

## 💳 Razorpay Test Mode Setup

1. Sign up or log into [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Toggle to **Test Mode** (top banner).
3. Go to **Settings → API Keys** and generate Key ID & Key Secret.
4. Paste the keys into `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
   ```
5. **Interactive Simulator Fallback**: If using demo keys, the application automatically launches the integrated **Razorpay Sandbox Simulator** modal, allowing instant end-to-end checkout, payment simulation, and signature verification without blocking.

---

## 📡 Backend API Reference

### Authentication
- `POST /api/auth/register` - Register a customer account
- `POST /api/auth/login` - Authenticate customer & generate JWT
- `GET /api/auth/profile` - Get logged-in customer profile [Protected]

### Products
- `GET /api/products` - Public product listing with search & filters
- `GET /api/products/:id` - Single product details

### Payment & Checkout
- `POST /api/payment/create-order` - Validates stock, calculates DB prices, creates Razorpay order
- `POST /api/payment/verify` - Verifies signature, decrements stock atomically, creates Order

### Orders
- `GET /api/orders/my-orders` - Customer orders history
- `GET /api/orders/:id` - Order details by ID

### Admin Endpoints [Admin JWT Protected]
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - KPI metrics and chart aggregation data
- `GET /api/admin/products` - View all products (including disabled)
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product details, price, or stock
- `DELETE /api/admin/products/:id` - Remove product
- `GET /api/admin/orders` - View all customer orders with search & filters
- `GET /api/admin/orders/:id` - Single order full shipping details
- `PUT /api/admin/orders/:id/status` - Transition status (auto stock restock if cancelled)
- `GET /api/admin/customers` - Customer directory & spend aggregation
- `GET /api/admin/customers/:email` - Customer complete order history

---

## 🌐 Deployment Guide

This full-stack project is pre-configured for seamless deployment on **Netlify** (Frontend) and any Node.js hosting like **Render** or **Railway** (Backend API).
### 1. Deploy Frontend to Netlify
1. Log in to [Netlify](https://app.netlify.com) and click **"Add new site" → "Import an existing project"**.
2. Connect your GitHub account and select your repository: `velaug24it-bit/websiteapp`.
3. Configure the Build & Deploy settings:
   - **Base directory**: `frontend` *(already configured via `netlify.toml`)*
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. In **Environment variables**, add:
   - `VITE_API_URL`: Your deployed backend URL + `/api` (e.g. `https://kadalai-candy-api.onrender.com/api` or `http://localhost:5000/api` for testing).
5. Click **"Deploy site"**. Netlify will build and deploy your store with automatic SPA routing (no 404s on page refresh).

### 2. Deploy Backend to Render (Free Web Service)
1. Log in to [Render](https://render.com) and select **"New +" → "Web Service"**.
2. Connect the repository `velaug24it-bit/websiteapp`.
3. Configure service details:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables** in Render:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://...` (your Atlas connection string)
   - `JWT_SECRET`: your secret key
   - `RAZORPAY_KEY_ID`: your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: your Razorpay secret
   - `FRONTEND_URL`: your Netlify URL (e.g. `https://your-site.netlify.app`)
5. Click **"Create Web Service"**. Once deployed, copy your Render URL and set it as `VITE_API_URL` in Netlify!

---

## 🧪 Verified End-to-End Customer Flow
1. **Customer opens store** at `http://localhost:5173/` → explores heritage hero and authentic candies.
2. **Navigates to `/products`** → selects pack (e.g., 250g Premium Groundnut Candy).
3. **Inspects `/product/:id`** → tests stock counter `[-] 1 [+]` and adds to cart.
4. **Visits `/cart`** → reviews formula calculations and proceeds to checkout.
5. **Fills delivery address** in Tamil Nadu and clicks **Pay Securely**.
6. **Razorpay Checkout** processes payment → backend verifies signature and deducts stock in MongoDB.
7. **Redirects to `/order-success/:orderId`** with confetti celebration and order ID.
8. **Admin logs into `/admin/dashboard`** → sees incremented orders and sales revenue.
9. **Admin updates order status** in `/admin/orders/:id` to `Packed` → `Shipped`.
10. **Customer immediately sees updated status** in `/my-orders`.
