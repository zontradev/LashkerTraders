import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getProducts } from '@/lib/services/store-data';
import { ProductCard } from '@/components/storefront/ProductCard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} — Diapers at Lashker Traders`,
    description: category.description || `Buy ${category.name} online in Bangladesh.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ categorySlug: slug, publishedOnly: true });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-slate-900">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{category.name}</span>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Category
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Product List */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Available Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            No products currently published in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
