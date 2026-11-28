"use client";

import { createContext, useContext } from "react";

export interface CartLine {
  productId: string;
  size: string;
  quantity: number;
}

export interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  totalCents: number;
  ready: boolean;
  storageError: string | null;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return cart;
}
