import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
        <ShoppingBag className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-900">Page Not Found</h1>
        <p className="text-xs text-slate-500">
          The product or page you are looking for has been moved, archived, or does not exist.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
        >
          <span>Shop Catalog</span>
        </Link>
      </div>
    </div>
  );
}
