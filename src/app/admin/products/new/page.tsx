import React from 'react';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Add New Diaper Product — Admin',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Create New Diaper Product
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Define product specifications, size variants, pack counts, and pricing for Lashker Traders.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
