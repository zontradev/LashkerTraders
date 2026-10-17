import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories, getBrands } from '@/lib/services/store-data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

export const metadata = {
  title: 'Diaper Catalog & Shop',
  description:
    'Browse the complete collection of baby diapers, diaper pants, and baby care products at Lashker Traders Bangladesh.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const brandParam = typeof params.brand === 'string' ? params.brand : undefined;
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;
  const sizeParam = typeof params.size === 'string' ? params.size : undefined;
  const queryParam = typeof params.q === 'string' ? params.q : undefined;

  const [products, categories, brands] = await Promise.all([
    getProducts({
      brandSlug: brandParam,
      categorySlug: categoryParam,
      size: sizeParam,
      search: queryParam,
      publishedOnly: true,
    }),
    getCategories(),
    getBrands(),
  ]);

  const hasFilters = Boolean(brandParam || categoryParam || sizeParam || queryParam);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Shop Diapers</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Diaper Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {products.length} {products.length === 1 ? 'product' : 'products'} available in stock
            </p>
          </div>

          {hasFilters && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filter Tabs by Brand */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Brands:
        </span>
        <Link
          href={`/shop${categoryParam ? `?category=${categoryParam}` : ''}`}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
            !brandParam
              ? 'bg-sky-600 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          All Brands
        </Link>
        {brands.map((b) => {
          const isActive = brandParam === b.slug;
          return (
            <Link
              key={b.id}
              href={`/shop?brand=${b.slug}${categoryParam ? `&category=${categoryParam}` : ''}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {b.name}
            </Link>
          );
        })}
      </div>

      {/* Filter Pills by Size */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Size Filter:
        </span>
        {['NB', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => {
          const isActive = sizeParam === s;
          const href = isActive
            ? `/shop${brandParam ? `?brand=${brandParam}` : ''}`
            : `/shop?size=${s}${brandParam ? `&brand=${brandParam}` : ''}`;

          return (
            <Link
              key={s}
              href={href}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold shrink-0 border transition-all ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white ring-2 ring-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Size {s}
            </Link>
          );
        })}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn&apos;t find any diaper products matching your selected filters. Try clearing your filters or search keywords.
          </p>
          <Link
            href="/shop"
            className="inline-block px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
