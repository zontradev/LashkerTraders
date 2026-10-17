'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product, ProductVariant } from '@/lib/services/store-data';

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  size: string;
  packCount: number;
  sku: string;
  unitPrice: number;
  regularPrice?: number | null;
  quantity: number;
  maxStock: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'lashker_cart_items_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Initialize cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Storage unavailable or blocked
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage on update
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Storage quota or error
      }
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    if (!variant.isAvailable || variant.stockQuantity <= 0) return;

    setItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.variantId === variant.id);
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = Math.min(next[existingIdx].quantity + quantity, variant.stockQuantity);
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          maxStock: variant.stockQuantity,
          unitPrice: variant.price,
        };
        return next;
      } else {
        const newItem: CartItem = {
          variantId: variant.id,
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          size: variant.size,
          packCount: variant.packCount,
          sku: variant.sku,
          unitPrice: variant.price,
          regularPrice: variant.regularPrice,
          quantity: Math.min(quantity, variant.stockQuantity),
          maxStock: variant.stockQuantity,
          imageUrl: variant.variantImageUrl || product.mainImage,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const validQty = Math.min(quantity, item.maxStock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
