'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ReviewItem {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  reviewText: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    productName: 'Twinkle Baby Diaper Pant (Size M, 40 pcs)',
    customerName: 'Nusrat Jahan',
    rating: 5,
    reviewText:
      'Very comfortable for my 9-month-old. No rash even after overnight sleep. Best value for money in Bangladesh!',
    isVerified: true,
    status: 'approved',
    date: '2 days ago',
  },
  {
    id: 'rev-2',
    productName: 'Twinkle Baby Diaper Pant (Size L, 34 pcs)',
    customerName: 'Tanvir Ahmed',
    rating: 5,
    reviewText: 'Original Twinkle diaper delivered within 24 hours inside Mirpur. Highly recommend Lashker Traders.',
    isVerified: true,
    status: 'approved',
    date: '4 days ago',
  },
  {
    id: 'rev-3',
    productName: 'Huggies Wonder Pants Extra Absorb',
    customerName: 'Sharmin Akter',
    rating: 5,
    reviewText: 'Bubble bed softness is really gentle on baby skin. Absorbs fast and fit is snug.',
    isVerified: true,
    status: 'approved',
    date: '6 days ago',
  },
  {
    id: 'rev-4',
    productName: 'NeoCare Baby Diaper Belt System',
    customerName: 'Sadia Islam',
    rating: 4,
    reviewText: 'Tape fit is good. Standard ADL layer kept my baby dry for 8 hours without sagging.',
    isVerified: true,
    status: 'pending',
    date: 'Just now',
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  const handleUpdateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Customer Review Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Approve genuine customer reviews before they appear on the public storefront
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          {reviews.length} reviews
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-xs">{rev.customerName}</span>
                {rev.isVerified && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-100">
                    Verified Buyer
                  </span>
                )}
                <span className="text-[10px] text-slate-400">• {rev.date}</span>
              </div>

              <div className="flex text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-700 italic">&ldquo;{rev.reviewText}&rdquo;</p>
              <p className="text-[11px] text-slate-400 font-medium">{rev.productName}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                  rev.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : rev.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {rev.status}
              </span>

              {rev.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'approved')}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
                    title="Approve Review"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                    title="Reject Review"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
