import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for diaper retail purchases at Lashker Traders.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Terms of Service</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">1. Order Acceptance & Pricing</h2>
        <p>
          All product prices are quoted in Bangladeshi Taka (BDT). Lashker Traders reserves the right to decline or cancel orders in cases of pricing inaccuracies, sudden stock depletion from suppliers, or unverified contact numbers.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. WhatsApp Order Handoff</h2>
        <p>
          Opening or clicking a WhatsApp order link does not constitute a legally binding transaction until the order is acknowledged, stock is locked, and confirmed by our sales operations team.
        </p>
      </div>
    </div>
  );
}
