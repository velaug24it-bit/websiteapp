import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    grandTotal,
    totalCount,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-cream-200 text-jaggery-400 flex items-center justify-center text-4xl mx-auto shadow-inner">
          🛒
        </div>
        <h1 className="font-serif text-3xl font-bold text-jaggery-900">Your Shopping Cart is Empty</h1>
        <p className="text-sm text-jaggery-600 max-w-sm mx-auto">
          You haven't added any crunchy Kadalai Mittai to your cart yet. Explore our handcrafted packs!
        </p>
        <div>
          <Link
            to="/products"
            id="cart-explore-btn"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-jaggery-800 hover:bg-jaggery-900 text-white font-bold text-sm shadow-warm transition-all"
          >
            <span>Explore Groundnut Candies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-jaggery-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-jaggery-900">Shopping Cart</h1>
          <p className="text-xs text-jaggery-600 mt-1">Review your selected Kadalai Mittai packs and quantities.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors self-start"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => {
            const itemSubtotal = item.price * item.quantity;
            return (
              <div
                key={item.productId}
                className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-soft border border-jaggery-100 flex flex-row items-center gap-3 sm:gap-4 transition-all"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.productId}`}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-cream-200 shrink-0 border border-jaggery-100"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-serif text-sm sm:text-base font-bold text-jaggery-900 hover:text-brand-700 transition-colors truncate block"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[10px] sm:text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full shrink-0">
                      {item.weight}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-jaggery-500">₹{item.price} each</p>

                  {/* Quantity Modifier */}
                  <div className="pt-1 flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                    <div className="inline-flex items-center border border-jaggery-200 rounded-lg sm:rounded-xl bg-cream-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center text-jaggery-800 hover:bg-white active:scale-95"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="w-6 sm:w-8 text-center text-xs font-bold text-jaggery-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 999)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center text-jaggery-800 hover:bg-white active:scale-95 disabled:opacity-30"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] sm:text-xs text-jaggery-600 font-mono hidden sm:inline">
                      ₹{item.price} × {item.quantity} = <strong className="text-jaggery-900">₹{itemSubtotal}</strong>
                    </span>
                  </div>
                </div>

                {/* Subtotal & Delete */}
                <div className="flex flex-col items-end justify-between self-stretch shrink-0 pl-1">
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1 sm:p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <div className="text-right">
                    <span className="text-sm sm:text-lg font-black text-jaggery-900 font-mono">₹{itemSubtotal}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex items-center justify-between">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-jaggery-800 hover:text-brand-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-jaggery-100 sticky top-28 space-y-6">
            <h2 className="font-serif text-xl font-bold text-jaggery-900 pb-3 border-b border-jaggery-100">
              Order Summary
            </h2>

            {/* Calculations breakdown */}
            <div className="space-y-3 text-sm text-jaggery-700">
              <div className="flex justify-between">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-bold text-jaggery-900 font-mono">₹{subtotal}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span>Delivery Charge</span>
                  {deliveryCharge === 0 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                <span className="font-bold text-jaggery-900 font-mono">
                  {deliveryCharge === 0 ? '₹0' : `₹${deliveryCharge}`}
                </span>
              </div>

              {subtotal < 150 && (
                <div className="p-2.5 rounded-xl bg-amber-50 text-[11px] text-amber-800 font-medium">
                  Add ₹{150 - subtotal} more of Kadalai Mittai to unlock <strong>FREE Delivery</strong>! (Nominal delivery is only ₹15)
                </div>
              )}

              <div className="pt-3 border-t border-jaggery-100 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-jaggery-900">Grand Total</span>
                <span className="text-2xl font-black text-brand-700 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <div className="space-y-3">
              <button
                type="button"
                id="cart-proceed-checkout-btn"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-600 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 text-white font-bold text-sm shadow-warm transition-all duration-300 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-jaggery-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe 256-Bit SSL Checkout with Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
