import React, { useEffect, useState } from 'react';
import { useRouter, Link } from '@/router';
import { getCategories, getProducts, type Category, type Product } from '@/lib/services/store-data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ArrowLeft, Package } from 'lucide-react';
import { useTranslation } from '@/i18n';

export function CategoryView() {
  const { params } = useRouter();
  const { t, language } = useTranslation();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const slug = params.slug;

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      getCategories(),
      getProducts({ categorySlug: slug, publishedOnly: true }),
    ]).then(([cats, prods]) => {
      const found = cats.find((c) => c.slug === slug);
      setCategory(found || null);
      setProducts(prods);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading category products...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Category not found</h2>
        <Link to="/shop" className="text-sky-600 font-semibold text-sm hover:underline">
          Return to full catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb back */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'সকল ডায়াপার ক্যাটালগ' : 'Back to Full Catalog'}</span>
      </Link>

      {/* Category Hero */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
            {language === 'bn' ? 'ক্যাটাগরি কালেকশন' : 'Category Collection'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-slate-700 font-semibold text-sm">
            {language === 'bn' ? 'এই ক্যাটাগরিতে বর্তমানে কোনো ডায়াপার পাওয়া যায়নি।' : 'No products found in this category right now.'}
          </p>
          <Link to="/shop" className="btn-primary">
            {t.cart.startShopping}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
