import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { DEFAULT_DELIVERY_ZONES, formatBDT, STORE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Shipping & Delivery Policy',
  description: 'Learn about Lashker Traders delivery charges, delivery zones across Bangladesh, and packaging standards.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Shipping Policy</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 2026 • Lashker Traders Bangladesh
        </p>
      </div>

      {/* Delivery Zone Fee Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-sky-600" />
          <span>Configured Delivery Rates Across Bangladesh</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-4">Delivery Zone</th>
                <th className="py-3 px-4">Standard Fee</th>
                <th className="py-3 px-4">Estimated Delivery Time</th>
                <th className="py-3 px-4">Coverage Areas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEFAULT_DELIVERY_ZONES.map((z) => (
                <tr key={z.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{z.name}</td>
                  <td className="py-3 px-4 font-extrabold text-sky-600">{formatBDT(z.baseFee)}</td>
                  <td className="py-3 px-4 text-slate-600">{z.estimatedDays}</td>
                  <td className="py-3 px-4 text-slate-500">{z.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
        <h3 className="text-base font-bold text-slate-900">1. Order Dispatch & Processing</h3>
        <p>
          Orders confirmed before 2:00 PM BST are processed and packaged on the same business day. Our partner couriers (Steadfast and Pathao) collect packages directly from our central Dhaka warehouse.
        </p>

        <h3 className="text-base font-bold text-slate-900">2. Discreet & Hygienic Packaging</h3>
        <p>
          Baby diapers are sanitary hygiene items. All products dispatched by Lashker Traders are double-wrapped in water-resistant protective poly sleeves to protect them from dust, moisture, and road transit weather.
        </p>

        <h3 className="text-base font-bold text-slate-900">3. Cash on Delivery (COD) Rules</h3>
        <p>
          Cash on delivery is offered nationwide. Customers are requested to have the exact order amount ready for the delivery rider upon arrival.
        </p>
      </div>
    </div>
  );
}
