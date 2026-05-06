import { useEffect, useMemo, useState } from "react";
import { normalizeProduct } from "../utils/catalog";
import { CartContext } from "./cartContextValue";

const CART_KEY = "commerceCart";

function readSavedCart() {
  try {
    const savedCart = localStorage.getItem(CART_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readSavedCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    const normalizedProduct = normalizeProduct(product);
    const nextQuantity = Math.max(1, Number(quantity) || 1);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === normalizedProduct.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === normalizedProduct.id
            ? { ...item, quantity: Math.min(item.quantity + nextQuantity, normalizedProduct.stockQuantity || 99) }
            : item,
        );
      }

      return [...currentItems, { ...normalizedProduct, quantity: nextQuantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(nextQuantity, item.stockQuantity || 99) }
          : item,
      ),
    );
  };

  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + Number(item.price || 0) * item.quantity,
      0,
    );
    const discount = Math.round(subtotal * 0.08);
    const deliveryFee = subtotal > 0 && subtotal < 999 ? 49 : 0;
    const total = Math.max(subtotal - discount + deliveryFee, 0);

    return {
      items,
      itemCount,
      subtotal,
      discount,
      deliveryFee,
      total,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
