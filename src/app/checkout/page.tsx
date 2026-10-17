'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { DEFAULT_DELIVERY_ZONES, formatBDT, generateWhatsAppOrderMessage, getWhatsAppOrderUrl, STORE_CONFIG } from '@/lib/constants';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryZoneId, setDeliveryZoneId] = useState(DEFAULT_DELIVERY_ZONES[0].id);
  const [additionalNote, setAdditionalNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({});
  const [generalError, setGeneralError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    guestTrackingToken: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryZoneName: string;
    subtotal: number;
    deliveryCharge: number;
    total: number;
  } | null>(null);

  const [copiedToken, setCopiedToken] = useState(false);

  const selectedZone = DEFAULT_DELIVERY_ZONES.find((z) => z.id === deliveryZoneId) || DEFAULT_DELIVERY_ZONES[0];
  const deliveryFee = selectedZone.baseFee;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralError('');

    if (items.length === 0) {
      setGeneralError('Your cart is empty. Please add products before checking out.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        deliveryZoneId,
        additionalNote: additionalNote.trim() || undefined,
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        idempotencyKey: `idemp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.details) {
          setFormErrors(data.details);
        } else {
          setGeneralError(data.error || 'Failed to place order. Please check inputs.');
        }
      } else {
        setConfirmedOrder(data.order);
        clearCart();
      }
    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : 'Network error during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingToken = () => {
    if (confirmedOrder?.guestTrackingToken) {
      navigator.clipboard.writeText(confirmedOrder.guestTrackingToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // If order is successfully placed, render Order Confirmation View
  if (confirmedOrder) {
    const whatsAppMsg = generateWhatsAppOrderMessage({
      orderNumber: confirmedOrder.orderNumber,
      customerName: confirmedOrder.customerName,
      customerPhone: confirmedOrder.customerPhone,
      deliveryAddress: confirmedOrder.deliveryAddress,
      items: items.map((i) => ({
        productName: i.productName,
        size: i.size,
        packCount: i.packCount,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.unitPrice * i.quantity,
      })),
      deliveryFee: confirmedOrder.deliveryCharge,
      total: confirmedOrder.total,
    });

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in fade-in">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Order Received Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Thank You, {confirmedOrder.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              We have received your order for authentic baby diapers. Our fulfillment team will prepare your package shortly.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Public Order Number</span>
                <p className="text-xl font-mono font-extrabold text-sky-700">
                  {confirmedOrder.orderNumber}
                </p>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-[11px] text-slate-500 font-medium">Payment Mode</span>
                <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
              </div>
            </div>

            {/* Secret Tracking Token */}
            <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">
                  Your Secure Guest Tracking Token:
                </span>
                <button
                  onClick={copyTrackingToken}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded-md break-all border border-slate-200">
                {confirmedOrder.guestTrackingToken}
              </p>
              <p className="text-[10px] text-slate-400">
                Keep this token safe to track real-time delivery status anytime on our tracking portal.
              </p>
            </div>

            {/* Financial Summary */}
            <div className="pt-2 space-y-1.5 text-xs text-slate-600 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatBDT(confirmedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({confirmedOrder.deliveryZoneName}):</span>
                <span className="font-semibold text-slate-900">{formatBDT(confirmedOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Payable at Doorstep:</span>
                <span className="text-sky-600 text-base">{formatBDT(confirmedOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Post-order actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={getWhatsAppOrderUrl(whatsAppMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm on WhatsApp ({STORE_CONFIG.whatsappNumber})</span>
            </a>

            <Link
              href={`/track-order?order=${confirmedOrder.orderNumber}&token=${confirmedOrder.guestTrackingToken}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Track Delivery Progress</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If bag is empty before checkout
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Your bag is empty</h1>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 text-white font-bold text-xs rounded-xl"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your delivery details below. Cash on delivery accepted across Bangladesh.
        </p>
      </div>

      {generalError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            1. Delivery Information
          </h2>

          <div className="space-y-4 text-xs">
            {/* Customer Name */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g., Mohammad Faruk"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              {formErrors.customerName && (
                <p className="text-rose-600 text-[11px] mt-1">{formErrors.customerName[0]}</p>
              )}
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Phone Number (11 Digits) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={20}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g., 01797753722"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                We will call or WhatsApp this number to confirm your order dispatch.
              </span>
              {formErrors.customerPhone && (
                <p className="text-rose-600 text-[11px] mt-1">{formErrors.customerPhone[0]}</p>
              )}
            </div>

            {/* Delivery Zone Selector */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Delivery Zone & City <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DEFAULT_DELIVERY_ZONES.map((zone) => {
                  const isSelected = zone.id === deliveryZoneId;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setDeliveryZoneId(zone.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{zone.name}</span>
                      <span className="text-sm font-extrabold text-slate-900 mt-1 block">
                        {formatBDT(zone.baseFee)}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {zone.estimatedDays}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Full Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                maxLength={300}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="House / Flat #, Road, Block/Sector, Area / Thana, City"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              {formErrors.deliveryAddress && (
                <p className="text-rose-600 text-[11px] mt-1">{formErrors.deliveryAddress[0]}</p>
              )}
            </div>

            {/* Additional Note */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Delivery Instructions / Notes (Optional)
              </label>
              <input
                type="text"
                maxLength={500}
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                placeholder="e.g., Deliver after 4 PM, call before arriving..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            2. Order Items ({items.length})
          </h2>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.variantId} className="py-2.5 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-[11px] text-slate-500">
                    Size: <strong>{item.size}</strong> ({item.packCount} pcs) × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatBDT(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs pt-3 border-t border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery ({selectedZone.name})</span>
              <span className="font-semibold text-slate-900">{formatBDT(deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable at Delivery</span>
              <span className="text-xl font-extrabold text-sky-600">{formatBDT(grandTotal)}</span>
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Cash on Delivery (COD)
            </span>
            <p className="text-[11px] text-slate-500">
              Pay in cash to the delivery rider once you receive and inspect your package.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm transition-all shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Placing Order Securely...</span>
            ) : (
              <>
                <span>Confirm Order — {formatBDT(grandTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
