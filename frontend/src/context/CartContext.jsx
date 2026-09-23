import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kadalai_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kadalai_cart', JSON.stringify(cartItems));
  }, [cartItems]);

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
    localStorage.removeItem('kadalai_cart');
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
