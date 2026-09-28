import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getUserCartApi, updateUserCartApi } from '../services/api';

const CartContext = createContext();

// Generate isolated storage key for each email or guest
const getStorageKey = (email) => {
  if (email) {
    return `kadalai_cart_${email.toLowerCase().trim()}`;
  }
  return 'kadalai_cart_guest';
};

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const currentEmail = user?.email ? user.email.toLowerCase().trim() : null;

  // Active storage key ref to prevent race condition saves across user switches
  const activeKeyRef = useRef(getStorageKey(currentEmail));
  const isLoadedRef = useRef(false);

  // Initialize from current user's local key
  const [cartItems, setCartItems] = useState(() => {
    // Purge old un-namespaced shared cart key if it still exists
    try {
      if (localStorage.getItem('kadalai_cart')) {
        localStorage.removeItem('kadalai_cart');
      }
    } catch {}

    try {
      const key = getStorageKey(currentEmail);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Whenever the logged-in email changes (e.g., login, switch account, logout)
  useEffect(() => {
    const newKey = getStorageKey(currentEmail);
    activeKeyRef.current = newKey;
    isLoadedRef.current = false;

    // Load cart specific to this user from local storage
    let localItems = [];
    try {
      const saved = localStorage.getItem(newKey);
      if (saved) localItems = JSON.parse(saved);
    } catch (err) {
      console.error('Error reading cart from localStorage for', newKey, err);
      localItems = [];
    }

    setCartItems(localItems);
    isLoadedRef.current = true;

    // If logged in, also sync with remote MongoDB user document
    if (currentEmail && token) {
      getUserCartApi()
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.cart)) {
            const dbCart = res.data.cart;
            // If local storage is empty for this user but DB has saved cart, restore it
            if (localItems.length === 0 && dbCart.length > 0) {
              setCartItems(dbCart);
              localStorage.setItem(newKey, JSON.stringify(dbCart));
            } else if (localItems.length > 0) {
              // Sync local items to server
              updateUserCartApi(localItems).catch(() => {});
            }
          }
        })
        .catch((err) => {
          console.warn('Could not sync user cart from server:', err.message);
        });
    }
  }, [currentEmail, token]);

  // Persist cartItems to the current user's key whenever cartItems changes
  useEffect(() => {
    if (!isLoadedRef.current) return;
    const key = activeKeyRef.current;
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(cartItems));
      } catch (err) {
        console.error('Failed to save cart to localStorage:', err);
      }

      // If user is authenticated, sync with server (debounced)
      if (currentEmail && token) {
        const timeoutId = setTimeout(() => {
          updateUserCartApi(cartItems).catch((err) => {
            console.warn('Failed to sync cart to server:', err.message);
          });
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [cartItems, currentEmail, token]);

  const addToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, Number(quantity));

    if (product.stock <= 0) {
      return { success: false, message: 'Product is currently out of stock.' };
    }

    let message = '';
    let success = true;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === product._id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + qtyToAdd;

        if (newQty > product.stock) {
          message = `Only ${product.stock} items are available in stock.`;
          const adjustedItems = [...prevItems];
          adjustedItems[existingIndex].quantity = product.stock;
          return adjustedItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          price: product.price, // ensure updated price
          stock: product.stock,
        };
        message = `Updated quantity to ${newQty} in cart.`;
        return updated;
      } else {
        if (qtyToAdd > product.stock) {
          message = `Only ${product.stock} items are available in stock.`;
          return [
            ...prevItems,
            {
              productId: product._id,
              name: product.name,
              weight: product.weight,
              price: product.price,
              stock: product.stock,
              image: product.image,
              quantity: product.stock,
            },
          ];
        }

        message = `Added ${product.name} to cart.`;
        return [
          ...prevItems,
          {
            productId: product._id,
            name: product.name,
            weight: product.weight,
            price: product.price,
            stock: product.stock,
            image: product.image,
            quantity: qtyToAdd,
          },
        ];
      }
    });

    return { success, message: message || 'Added to cart successfully.' };
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = Number(newQuantity);
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            if (qty <= 0) return null;
            const boundedQty = Math.min(qty, item.stock || 999);
            return { ...item, quantity: boundedQty };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    const key = activeKeyRef.current;
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
    if (currentEmail && token) {
      updateUserCartApi([]).catch(() => {});
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal >= 150 || subtotal === 0 ? 0 : 15;
  const grandTotal = subtotal + deliveryCharge;
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryCharge,
        grandTotal,
        totalCount,
        cartUserEmail: currentEmail,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
