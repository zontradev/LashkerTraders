import React from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, FileSpreadsheet, Package } from 'lucide-react';
import { getProducts } from '@/lib/services/store-data';
import { formatBDT } from '@/lib/constants';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : undefined;

  const products = await getProducts({ search: q, publishedOnly: false });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Product & Variant Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage diaper products, size variants, individual SKUs, pricing, and inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/import"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Import CSV/Excel</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <form className="relative max-w-sm w-full">
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Search by title, SKU, or brand..."
              className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-8 text-xs outline-hidden focus:border-sky-500"
            />
            <button type="submit" className="absolute right-2 top-2 p-0.5 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
          <span className="text-xs text-slate-500">{products.length} products total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Brand & Category</th>
                <th className="py-3 px-4">Base Price</th>
                <th className="py-3 px-4">Variants (Size • Pack • Stock)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{p.brand}</span>
                      <p className="text-[11px] text-slate-400">{p.category}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatBDT(p.basePrice)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-sm">
                        {p.variants.map((v) => (
                          <span
                            key={v.id}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                              v.stockQuantity === 0
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : v.stockQuantity <= 15
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <strong>{v.size}</strong> ({v.packCount} pcs) • {v.stockQuantity} in stock
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Total inventory: {totalStock} units</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.isPublished ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold text-[11px] transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
