import React from 'react';
import Link from 'next/link';
import { STORE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Return & Exchange Policy',
  description: 'Understand the return and exchange policy for diaper purchases at Lashker Traders.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Return Policy</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Return & Replacement Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 2026 • Lashker Traders Bangladesh
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">1. Hygiene & Safety Standards</h2>
        <p>
          Because baby diapers are personal hygiene products for infants, unopened, untampered packs in original factory condition can be exchanged within <strong>7 days</strong> of delivery if the wrong size was accidentally ordered.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Damaged or Defective Items</h2>
        <p>
          If a pack arrives torn, punctured, or defective, please take a photo and contact our WhatsApp helpline immediately at <strong>{STORE_CONFIG.whatsappNumber}</strong> within 24 hours of receiving the parcel. We will arrange a free door-step replacement immediately.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Non-Returnable Scenarios</h2>
        <p>
          Any diaper pack where the factory plastic seal has been broken or items have been removed cannot be accepted for return or refund due to sanitary health regulations.
        </p>
      </div>
    </div>
  );
}
