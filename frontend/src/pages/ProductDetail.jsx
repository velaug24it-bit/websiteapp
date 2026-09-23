import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
} from 'lucide-react';
import { getProductByIdApi } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id);
        if (res.data.success) {
          setProduct(res.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Unable to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-jaggery-600 font-medium">Loading delicious candy details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="font-serif text-2xl font-bold text-jaggery-900">{error || 'Product Not Found'}</h2>
        <p className="text-xs text-jaggery-600">This product might have been restocked or removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-jaggery-800 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, quantity);
    setAddedMessage(res.message);
    setTimeout(() => setAddedMessage(null), 3000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-jaggery-500">
        <Link to="/" className="hover:text-jaggery-800">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-jaggery-800">Products</Link>
        <span>/</span>
        <span className="font-bold text-jaggery-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Detail Layout */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-jaggery-100 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Large Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-cream-200 aspect-square shadow-inner border border-jaggery-100 group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            {/* Weight Badge */}
            <span className="absolute top-4 left-4 bg-jaggery-900/90 backdrop-blur-md text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-md">
              {product.weight} Pack
            </span>

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-rose-600 text-white font-bold px-6 py-2 rounded-2xl shadow-xl text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-jaggery-500 px-2">
            <span>✨ Small Batch Roasted</span>
            <span>🌿 Unrefined Natural Jaggery</span>
            <span>📦 Food-Grade Vacuum Sealed</span>
          </div>
        </div>

        {/* Right: Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Rating */}
            <div className="flex items-center gap-2 text-amber-500 text-sm mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-jaggery-800">{product.rating || 4.9}</span>
              <span className="text-jaggery-400">({product.reviewCount || 48} authentic customer reviews)</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-jaggery-900 leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-jaggery-900">
                ₹{product.price}
              </span>
              <span className="text-base text-jaggery-400 line-through">
                ₹{Math.round(product.price * 1.25)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Special Introductory Price
              </span>
            </div>
            <p className="text-xs text-jaggery-500 mt-1">Inclusive of all local taxes. Free shipping above ₹300.</p>
          </div>

          {/* Stock Availability Indicator */}
          <div className="p-3.5 rounded-2xl bg-cream-100 border border-jaggery-100 flex items-center justify-between">
            <span className="text-xs font-bold text-jaggery-700">Stock Availability:</span>
            {isOutOfStock ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Out of Stock
              </span>
            ) : product.stock <= 10 ? (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
                Hurry! Only {product.stock} items left in stock
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                In Stock ({product.stock} units available)
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-jaggery-700 uppercase tracking-wider mb-2">
              Select Quantity:
            </label>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center border border-jaggery-200 rounded-2xl bg-cream-50 p-1">
                <button
                  type="button"
                  id="qty-decrease-btn"
                  onClick={handleDecreaseQty}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-jaggery-800 hover:bg-white active:scale-95 disabled:opacity-40 transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span id="qty-value" className="w-12 text-center font-bold text-base text-jaggery-900 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="qty-increase-btn"
                  onClick={handleIncreaseQty}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-jaggery-800 hover:bg-white active:scale-95 disabled:opacity-40 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {!isOutOfStock && quantity >= product.stock && (
                <span className="text-xs font-medium text-amber-700">
                  Maximum available stock reached ({product.stock})
                </span>
              )}
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                id="detail-add-cart-btn"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-cream-200 hover:bg-brand-100 text-jaggery-900 border border-jaggery-200 active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-brand-700" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                id="detail-buy-now-btn"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-brand-600 to-jaggery-800 hover:opacity-95 text-white active:scale-98'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>

            {addedMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{addedMessage}</span>
                <Link to="/cart" className="underline ml-auto font-extrabold hover:text-emerald-900">
                  View Cart →
                </Link>
              </div>
            )}
          </div>

          {/* Description & Ingredients accordion style */}
          <div className="space-y-4 pt-4 border-t border-jaggery-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-jaggery-500 mb-1">
                Description
              </h3>
              <p className="text-sm text-jaggery-700 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-jaggery-500 mb-1">
                Ingredients & Recipe
              </h3>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-jaggery-800 font-medium">
                {product.ingredients}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Purchase Bar */}
      <div className="md:hidden fixed bottom-12 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-jaggery-200 px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-jaggery-500 font-medium block">Total Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-jaggery-900">₹{product.price * quantity}</span>
            <span className="text-[10px] text-jaggery-400">({quantity} pack)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="py-2.5 px-3.5 rounded-xl bg-cream-200 text-jaggery-900 font-bold text-xs flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-jaggery-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
