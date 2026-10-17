'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, MessageCircle, Truck } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { formatBDT, generateWhatsAppOrderMessage, getWhatsAppOrderUrl, STORE_CONFIG } from '@/lib/constants';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart();

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppOrderMessage({
      customerName: '[Customer Name]',
      customerPhone: '[Customer Phone]',
      deliveryAddress: '[Delivery Address]',
      items: items.map((i) => ({
        productName: i.productName,
        size: i.size,
        packCount: i.packCount,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.unitPrice * i.quantity,
      })),
      deliveryFee: 60,
      total: subtotal + 60,
    });

    window.open(getWhatsAppOrderUrl(message), '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Your Shopping Bag is Empty</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven&apos;t added any diaper items to your bag yet. Browse our selection of genuine baby diapers.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-sky-500/20"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shopping Bag</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected sizes and pack quantities ({itemCount} total items)
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.variantId} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-100">
                      Size: {item.size}
                    </span>
                    <span className="text-xs text-slate-500">{item.packCount} pcs/pack</span>
                  </div>
                  <p className="text-xs text-slate-500">Unit Price: {formatBDT(item.unitPrice)}</p>
                </div>
              </div>

              {/* Quantity Controls & Line Subtotal */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {formatBDT(item.unitPrice * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.variantId)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-bold text-slate-900">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                Estimated Delivery
              </span>
              <span className="font-semibold text-slate-700">Calculated at checkout</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Total Payable</span>
              <span className="font-extrabold text-sky-600 text-lg">{formatBDT(subtotal)}*</span>
            </div>
            <p className="text-[10px] text-slate-400">
              *Delivery fee (৳60 Dhaka City, ৳80 Suburban, ৳120 Outside) will be finalized upon selecting your delivery zone.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Checkout via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
