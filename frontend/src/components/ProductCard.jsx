import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Zap, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const result = addToCart(product, 1);
    setAdded(true);
    setFeedback(result.message);
    setTimeout(() => {
      setAdded(false);
      setFeedback(null);
    }, 2200);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-soft hover:shadow-warm transition-all duration-300 border border-jaggery-100 flex flex-col justify-between overflow-hidden">
      {/* Top badges */}
      <div className="relative">
        <Link to={`/product/${product._id}`} className="block overflow-hidden rounded-xl sm:rounded-2xl bg-cream-200 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Floating Weight Pill */}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-jaggery-900/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
          {product.weight}
        </span>

        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          {isOutOfStock ? (
            <span className="bg-rose-500 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Out
            </span>
          ) : product.stock <= 10 ? (
            <span className="bg-amber-500 text-white text-[9px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md animate-pulse">
              {product.stock} left
            </span>
          ) : (
            <span className="bg-emerald-600/90 text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-2 sm:pt-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-500 mb-1">
            <div className="flex items-center">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </div>
            <span className="font-bold text-jaggery-800">{product.rating || 4.9}</span>
            <span className="text-jaggery-400 text-[10px] sm:text-xs">({product.reviewCount || 48})</span>
          </div>

          <Link to={`/product/${product._id}`} className="block group-hover:text-brand-700 transition-colors">
            <h3 className="font-serif text-xs sm:text-lg font-bold text-jaggery-900 line-clamp-1 leading-snug">{product.name}</h3>
          </Link>

          <p className="hidden sm:block text-xs text-jaggery-600 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-jaggery-50">
          <div className="flex items-baseline justify-between mb-2 sm:mb-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-2xl font-black text-jaggery-900 tracking-tight">₹{product.price}</span>
                <span className="text-[10px] sm:text-xs text-jaggery-400 line-through">₹{Math.round(product.price * 1.25)}</span>
              </div>
            </div>
            <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              20% off
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              id={`add-cart-${product._id}`}
              className={`w-full py-2 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-cream-200 text-jaggery-800 hover:bg-brand-100 hover:text-brand-900 active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Add</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              id={`buy-now-${product._id}`}
              className={`w-full py-2 sm:py-2.5 px-1 sm:px-3 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-all duration-200 shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-600 to-jaggery-800 text-white hover:opacity-95 active:scale-95'
              }`}
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> Buy
            </button>
          </div>

          {feedback && (
            <p className="text-[10px] font-semibold text-center text-brand-700 mt-1.5 animate-fadeIn truncate">
              {feedback}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
