import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, HeartHandshake, Phone, MessageCircle, Mail } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'About Us',
  description: 'Learn about Lashker Traders — your trusted diaper shopping partner in Bangladesh.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">About Us</span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Lashker Traders
        </h1>
        <p className="text-sm font-semibold text-sky-600">
          {STORE_CONFIG.tagline}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>
          Founded in Dhaka, Bangladesh, <strong>Lashker Traders</strong> is an established baby diaper and baby care retailer committed to making essential parenting supplies convenient, accessible, and affordable.
        </p>
        <p>
          We partner directly with authorized distributors of leading diaper brands including <strong>Twinkle, Huggies, Molfix, NeoCare, and Pampers</strong>. Every single pack we dispatch is verified for factory seals, correct piece count, and long expiry dates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-sky-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-xs">Authentic Products</h4>
            <p className="text-[11px] text-slate-500">Zero duplicate or gray-market stock</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
            <Truck className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-xs">Fast Home Delivery</h4>
            <p className="text-[11px] text-slate-500">1-2 days Dhaka, nationwide courier</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center space-y-1">
            <HeartHandshake className="w-6 h-6 text-amber-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-xs">Customer Support</h4>
            <p className="text-[11px] text-slate-500">Direct phone & WhatsApp assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
