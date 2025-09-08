import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

// PUBLIC_INTERFACE
export const CartContext = createContext({
  items: [],
  addItem: (_product, _qty) => {},
  removeItem: (_productId) => {},
  clear: () => {},
  updateQty: (_productId, _qty) => {},
  totalItems: 0,
  totalPrice: 0,
});

/**
 * PUBLIC_INTERFACE
 * CartProvider manages shopping cart with localStorage persistence.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cartItems");
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...product, qty }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, qty: Math.max(1, qty) } : p))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totals = useMemo(() => {
    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = items.reduce((s, i) => s + i.qty * (i.price || 0), 0);
    return { totalItems, totalPrice };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQty,
      clear,
      totalItems: totals.totalItems,
      totalPrice: totals.totalPrice,
    }),
    [items, addItem, removeItem, updateQty, clear, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
