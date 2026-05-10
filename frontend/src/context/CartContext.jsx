import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  getCart,
  getErrorMessage,
  getToken,
  removeCartItem,
  updateCartItem,
} from "../services/api";
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

function normalizeCartItem(item) {
  return {
    cartItemId: item.id,
    id: item.productId ?? item.id,
    name: item.productName ?? item.name ?? "Product",
    price: Number(item.price) || 0,
    imageUrl: item.imageUrl || "",
    category: item.category || "Essentials",
    description: item.description || "",
    stockQuantity: Number(item.stockQuantity) || 99,
    quantity: Math.max(1, Number(item.quantity) || 1),
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readSavedCart);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const refreshCart = useCallback(async () => {
    if (!getToken()) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getCart();
      const nextItems = Array.isArray(response.data)
        ? response.data.map(normalizeCartItem)
        : [];

      setItems(nextItems);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to load your cart right now."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    const normalizedProduct = normalizeProduct(product);
    const nextQuantity = Math.max(1, Number(quantity) || 1);

    setErrorMessage("");
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

    try {
      await addCartItem(normalizedProduct.id, nextQuantity);
      await refreshCart();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to add this product to your cart."));
      await refreshCart();
    }
  }, [refreshCart]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);

    setErrorMessage("");
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(nextQuantity, item.stockQuantity || 99) }
        : item,
      ),
    );

    try {
      await updateCartItem(productId, nextQuantity);
      await refreshCart();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to update this cart item."));
      await refreshCart();
    }
  }, [refreshCart]);

  const removeFromCart = useCallback(async (productId) => {
    const itemToRemove = items.find((item) => item.id === productId);

    setErrorMessage("");
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));

    try {
      await removeCartItem(itemToRemove?.cartItemId ?? productId);
      await refreshCart();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to remove this cart item."));
      await refreshCart();
    }
  }, [items, refreshCart]);

  const clearCart = useCallback(async () => {
    const itemsToRemove = items;

    setErrorMessage("");
    setItems([]);

    try {
      await Promise.all(
        itemsToRemove.map((item) => removeCartItem(item.cartItemId ?? item.id)),
      );
      await refreshCart();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to clear your cart."));
      await refreshCart();
    }
  }, [items, refreshCart]);

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
      isLoading,
      errorMessage,
      refreshCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    };
  }, [
    items,
    isLoading,
    errorMessage,
    refreshCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
