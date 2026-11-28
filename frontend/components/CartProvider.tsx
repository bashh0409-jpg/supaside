"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import CartDrawer from "./CartDrawer";
import {
  CartContext,
  type CartContextValue,
  type CartLine,
} from "../lib/cart-context";
import { sampleProducts, sampleUkSizes } from "../lib/products";

const CART_STORAGE_KEY = "supaside-cart";

function getProduct(productId: string) {
  const product = sampleProducts.find((item) => item.id === productId);
  if (!product) {
    throw new Error(`Cart contains unknown product "${productId}"`);
  }
  return product;
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    sampleProducts.some((product) => product.id === line.productId) &&
    typeof line.size === "string" &&
    sampleUkSizes.some(
      (option) => option.size === line.size && option.available,
    ) &&
    typeof line.quantity === "number" &&
    Number.isSafeInteger(line.quantity) &&
    line.quantity > 0
  );
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const persistLines = useCallback((nextLines: CartLine[]) => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(nextLines));
      setStorageError(null);
    } catch (error) {
      console.error("Unable to save the cart in this browser.", error);
      setStorageError("Cart changes could not be saved in this browser.");
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed: unknown = JSON.parse(savedCart);
          if (!Array.isArray(parsed)) {
            throw new Error("Saved cart data has an invalid format");
          }
          const savedLines: CartLine[] = [];
          for (const value of parsed) {
            if (!isCartLine(value)) {
              throw new Error("Saved cart data has an invalid item");
            }
            savedLines.push(value);
          }
          setLines(savedLines);
        }
      } catch (error) {
        console.error("Unable to load the saved cart.", error);
        setStorageError(
          "Your saved cart could not be loaded from this browser.",
        );
      } finally {
        setReady(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const addItem = useCallback(
    (productId: string, size: string) => {
      getProduct(productId);
      const sizeOption = sampleUkSizes.find((option) => option.size === size);
      if (!sizeOption?.available) {
        throw new Error(`UK size "${size}" is not available`);
      }

      const existing = lines.find(
        (line) => line.productId === productId && line.size === size,
      );
      const nextLines = existing
        ? lines.map((line) =>
            line.productId === productId && line.size === size
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          )
        : [...lines, { productId, size, quantity: 1 }];
      setLines(nextLines);
      persistLines(nextLines);
      setOpen(true);
    },
    [lines, persistLines],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (!Number.isSafeInteger(quantity) || quantity < 1) {
        throw new Error("Cart quantity must be a positive whole number");
      }
      const nextLines = lines.map((line) =>
        line.productId === productId && line.size === size
          ? { ...line, quantity }
          : line,
      );
      setLines(nextLines);
      persistLines(nextLines);
    },
    [lines, persistLines],
  );

  const removeItem = useCallback(
    (productId: string, size: string) => {
      const nextLines = lines.filter(
        (line) => line.productId !== productId || line.size !== size,
      );
      setLines(nextLines);
      persistLines(nextLines);
    },
    [lines, persistLines],
  );

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
    const totalCents = lines.reduce(
      (total, line) =>
        total + getProduct(line.productId).priceCents * line.quantity,
      0,
    );

    return {
      lines,
      itemCount,
      totalCents,
      ready,
      storageError,
      open,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
    };
  }, [
    addItem,
    closeCart,
    lines,
    open,
    openCart,
    ready,
    removeItem,
    storageError,
    updateQuantity,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer open={open} onClose={closeCart} />
    </CartContext.Provider>
  );
}
