'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { formatBDT, formatDhakaDate, ORDER_STATUS_LABELS } from '@/lib/constants';

interface OrderTimelineItem {
  oldStatus: string | null;
  newStatus: string;
  changedAt: string;
  notes?: string | null;
}

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryZoneName: string;
  deliveryAddress: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  items: Array<{
    productName: string;
    size: string;
    packCount: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  statusHistory: OrderTimelineItem[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [token, setToken] = useState(searchParams.get('token') || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);

  // If order number and token are provided via URL, automatically perform lookup
  useEffect(() => {
    const urlOrder = searchParams.get('order');
    const urlToken = searchParams.get('token');
    if (urlOrder && urlToken) {
      performTracking(urlOrder, urlToken);
    }
  }, [searchParams]);

  const performTracking = async (ordNum: string, tkn: string) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: ordNum.trim(), token: tkn.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to locate order');
        setTrackedOrder(null);
      } else {
        setTrackedOrder(data.order);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error tracking order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !token.trim()) {
      setError('Please provide both your order number and guest tracking token.');
      return;
    }
    performTracking(orderNumber, token);
  };

  // Lifecycle steps for the tracker bar
  const LIFECYCLE_STEPS = [
    { key: 'pending', label: 'Order Received' },
    { key: 'confirmed', label: 'Order Confirmed' },
    { key: 'processing', label: 'Packaging' },
    { key: 'shipped', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getCurrentStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStep = trackedOrder ? getCurrentStepIndex(trackedOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Diaper Delivery
        </h1>
        <p className="text-xs text-slate-500">
          Enter your public order number (e.g. LT-00001) and the secure guest tracking token provided upon checkout.
        </p>
      </div>

      {/* Tracking Search Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Order Number (e.g., LT-00001)
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="LT-00001"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs font-bold outline-hidden focus:bg-white focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Secure Guest Tracking Token
            </label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste the 48-character token from checkout"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs outline-hidden focus:bg-white focus:border-sky-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Locating order in database...</span>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Track Order</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Tracking Results View */}
      {trackedOrder && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-8 shadow-xs animate-in fade-in">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] text-slate-400 font-medium">Order Reference</span>
              <p className="text-xl font-mono font-extrabold text-sky-700">
                {trackedOrder.orderNumber}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Placed on {formatDhakaDate(trackedOrder.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  ORDER_STATUS_LABELS[trackedOrder.orderStatus]?.color || 'bg-slate-100 text-slate-700'
                }`}
              >
                {ORDER_STATUS_LABELS[trackedOrder.orderStatus]?.label || trackedOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2 text-center">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="space-y-2">
                    <div
                      className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-md'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <p
                      className={`text-[11px] font-semibold leading-tight ${
                        isCurrent
                          ? 'text-sky-700 font-bold'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items & Shipping Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Delivery address snapshot */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                Delivery Details
              </h3>
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-slate-600 border border-slate-100">
                <p>
                  <strong className="text-slate-800">Recipient:</strong> {trackedOrder.customerName}
                </p>
                <p>
                  <strong className="text-slate-800">Phone:</strong> {trackedOrder.customerPhone}
                </p>
                <p>
                  <strong className="text-slate-800">Zone:</strong> {trackedOrder.deliveryZoneName}
                </p>
                <p>
                  <strong className="text-slate-800">Address:</strong> {trackedOrder.deliveryAddress}
                </p>
              </div>
            </div>

            {/* Financial summary snapshot */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                Payment & Totals
              </h3>
              <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 text-slate-600 border border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">
                    {formatBDT(trackedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-slate-800">
                    {formatBDT(trackedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total (Cash on Delivery):</span>
                  <span className="text-sky-600">{formatBDT(trackedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Items in Package
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
              {trackedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <p className="text-[11px] text-slate-500">
                      Size: <strong>{item.size}</strong> ({item.packCount} pcs) × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">{formatBDT(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Timeline */}
          {trackedOrder.statusHistory.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Status History Log
              </h3>
              <div className="space-y-2">
                {trackedOrder.statusHistory.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-600 p-2.5 bg-slate-50 rounded-lg"
                  >
                    <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-semibold text-slate-800 uppercase text-[10px]">
                        {h.newStatus}
                      </span>
                      <p className="text-slate-500 text-[11px]">{h.notes}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDhakaDate(h.changedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
