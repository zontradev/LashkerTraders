import React from 'react';
import Link from 'next/link';
import { STORE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Lashker Traders protects customer and order data in Bangladesh.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Privacy Policy</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          When you place a diaper order on Lashker Traders, we collect your name, phone number, delivery address, and any optional delivery instructions solely to fulfill and deliver your order.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Guest Order Privacy</h2>
        <p>
          We protect guest customer privacy by generating high-entropy cryptographic tracking tokens. Knowing an order number alone does not reveal private customer names or phone numbers on our tracking portal.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Third-Party Courier Data Sharing</h2>
        <p>
          Recipient delivery details are securely shared strictly with our logistics courier partners (Steadfast and Pathao) for delivery dispatch. We never sell, rent, or trade your personal data.
        </p>
      </div>
    </div>
  );
}
