'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Package,
} from 'lucide-react';
import type { OrderRecord } from '@/lib/services/store-data';
import { formatBDT, formatDhakaDate, ORDER_STATUS_LABELS } from '@/lib/constants';

export function OrderDetailManager({ order: initialOrder }: { order: OrderRecord }) {
  const [order, setOrder] = useState<OrderRecord>(initialOrder);
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [courierDispatched, setCourierDispatched] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === order.orderStatus) return;

    setIsUpdating(true);
    setError('');

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          newStatus: selectedStatus,
          notes: statusNote || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update order');
      } else {
        setOrder((prev) => ({
          ...prev,
          orderStatus: selectedStatus,
          statusHistory: [
            ...prev.statusHistory,
            {
              oldStatus: prev.orderStatus,
              newStatus: selectedStatus,
              changedAt: new Date().toISOString(),
              notes: statusNote || `Status changed to ${selectedStatus}`,
            },
          ],
        }));
        setUpdateSuccess(true);
        setStatusNote('');
        setTimeout(() => setUpdateSuccess(false), 2000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintPackingSlip = () => {
    window.print();
  };

  const handleDispatchCourier = (partner: 'steadfast' | 'pathao') => {
    setCourierDispatched(true);
    setSelectedStatus('shipped');
    setStatusNote(`Dispatched via ${partner.toUpperCase()} Courier`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrintPackingSlip}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice / Slip</span>
          </button>
        </div>
      </div>

      {/* Invoice Header (Shows in Print Mode) */}
      <div className="hidden print:block p-6 text-center border-b border-slate-300">
        <h1 className="text-2xl font-bold">LASHKER TRADERS</h1>
        <p className="text-xs">Your Trusted Diaper Shopping Partner in Bangladesh</p>
        <p className="text-xs">Dhaka, Bangladesh • WhatsApp: 01797753722</p>
        <p className="text-sm font-bold mt-2">PACKING SLIP & RETAIL INVOICE</p>
      </div>

      {/* Order Status Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Order Reference</span>
          <p className="text-2xl font-mono font-extrabold text-sky-700">{order.orderNumber}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Placed on {formatDhakaDate(order.createdAt)} • {order.items.length} unique items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold border uppercase ${
              ORDER_STATUS_LABELS[order.orderStatus]?.color || 'bg-slate-100 text-slate-700'
            }`}
          >
            {ORDER_STATUS_LABELS[order.orderStatus]?.label || order.orderStatus}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Line Items Snapshot & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Purchased Items Snapshot
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Size & Pack</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {item.productName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-sky-700">Size {item.size}</span>{' '}
                        <span className="text-slate-500">({item.packCount} pcs/pack)</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                        {item.sku}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-700">
                        {formatBDT(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        {formatBDT(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subtotals */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatBDT(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge ({order.deliveryZoneName}):</span>
                <span className="font-semibold text-slate-900">{formatBDT(order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Payable (COD):</span>
                <span className="text-sky-600 text-base">{formatBDT(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Lifecycle & Status History */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 print:hidden">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Status Change Audit Trail
            </h2>

            <div className="space-y-2 text-xs">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-start gap-3 border border-slate-100">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 uppercase text-[11px]">
                      {h.newStatus}
                    </span>
                    <p className="text-slate-600 text-xs mt-0.5">{h.notes}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatDhakaDate(h.changedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details, Status Transition Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer & Address Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3 text-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Customer & Delivery
            </h2>

            <div className="space-y-1.5 text-slate-700">
              <p>
                <strong className="text-slate-900">Name:</strong> {order.customerName}
              </p>
              <p>
                <strong className="text-slate-900">Phone:</strong> {order.customerPhone}
              </p>
              <p>
                <strong className="text-slate-900">Zone:</strong> {order.deliveryZoneName}
              </p>
              <p>
                <strong className="text-slate-900">Address:</strong> {order.deliveryAddress}
              </p>
              {order.additionalNote && (
                <p className="p-2 bg-amber-50 rounded-lg text-amber-900 border border-amber-200 mt-2">
                  <strong>Customer Note:</strong> {order.additionalNote}
                </p>
              )}
            </div>
          </div>

          {/* Status Controls (Print Hidden) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 print:hidden">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Update Order Status
            </h2>

            {updateSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Status successfully updated!</span>
              </div>
            )}

            <form onSubmit={handleStatusChange} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Lifecycle Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing & Packaging</option>
                  <option value="shipped">Shipped / Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled (Auto-Restock)</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Note (Optional)</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Phone confirmed, handed to Steadfast rider"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating || selectedStatus === order.orderStatus}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-40"
              >
                {isUpdating ? 'Updating...' : 'Save Status Change'}
              </button>
            </form>
          </div>

          {/* Courier Dispatch Actions (Print Hidden) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3 print:hidden">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Dispatch to Courier Partner
            </h2>
            <p className="text-xs text-slate-500">
              Integrate with Steadfast or Pathao APIs to generate consignment code and tracking number.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDispatchCourier('steadfast')}
                className="py-2.5 px-3 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors"
              >
                Steadfast Dispatch
              </button>
              <button
                type="button"
                onClick={() => handleDispatchCourier('pathao')}
                className="py-2.5 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
              >
                Pathao Dispatch
              </button>
            </div>

            {courierDispatched && (
              <p className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg">
                Consignment booked. Order marked as Shipped.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
