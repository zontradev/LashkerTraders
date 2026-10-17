import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/services/store-data';
import { ProductForm } from '@/components/admin/ProductForm';

export const metadata = {
  title: 'Edit Product — Admin',
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Edit Diaper Product
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Modify product details, size variants, individual SKUs, prices, or stock quantities.
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
