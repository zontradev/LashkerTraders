import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Eye, Filter } from 'lucide-react';
import { getAllOrdersAdmin } from '@/lib/services/store-data';
import { DEFAULT_DELIVERY_ZONES, formatBDT, formatDhakaDate, ORDER_STATUS_LABELS } from '@/lib/constants';

export const metadata = {
  title: 'Order Management — Admin',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const statusParam = typeof params.status === 'string' ? params.status : undefined;
  const zoneParam = typeof params.zone === 'string' ? params.zone : undefined;
  const qParam = typeof params.q === 'string' ? params.q : undefined;

  const orders = await getAllOrdersAdmin({
    status: statusParam,
    deliveryZone: zoneParam,
    search: qParam,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Order Lifecycle & Fulfillment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process incoming diaper orders, track deliveries, and maintain inventory audit logs
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          {orders.length} orders found
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Status:
        </span>
        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => {
          const isActive = (!statusParam && st === 'all') || statusParam === st;
          return (
            <Link
              key={st}
              href={`/admin/orders${st === 'all' ? '' : `?status=${st}`}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors uppercase ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {st}
            </Link>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <form className="relative max-w-sm w-full">
            <input
              type="text"
              name="q"
              defaultValue={qParam || ''}
              placeholder="Search by order #, phone, customer..."
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-xs outline-hidden focus:border-sky-500"
            />
            <button type="submit" className="absolute right-2 top-2 p-0.5 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Placed At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-extrabold text-sky-700">
                      {o.orderNumber}
                      {o.isWhatsappOrder && (
                        <span className="block text-[9px] font-bold text-emerald-600">WhatsApp</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{o.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{o.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{o.deliveryZoneName}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                      {o.items.map((i) => `${i.productName} (${i.size}) × ${i.quantity}`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatBDT(o.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          ORDER_STATUS_LABELS[o.orderStatus]?.color || 'bg-slate-100'
                        }`}
                      >
                        {ORDER_STATUS_LABELS[o.orderStatus]?.label || o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDhakaDate(o.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
