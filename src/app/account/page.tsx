'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, LogIn, ShieldCheck, Mail, Phone, LogOut } from 'lucide-react';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('Mohammad Faruk');
  const [phone, setPhone] = useState('01711223344');
  const [address, setAddress] = useState('House 14, Road 5, Block B, Dhanmondi, Dhaka');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSimulateGoogleLogin = () => {
    setIsLoggedIn(true);
    setEmail('faruk.bangladesh@example.com');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">Customer Account</h1>
            <p className="text-xs text-slate-500">
              Sign in to view your order history, save delivery addresses, and track shipments.
            </p>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleSimulateGoogleLogin}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold">Or</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setIsLoggedIn(true);
            }}
            className="space-y-3 text-left text-xs"
          >
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs outline-hidden focus:bg-white focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition-colors"
            >
              Sign In with Email
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Guest customer? You do not need to sign in to place an order.{' '}
            <Link href="/track-order" className="text-sky-600 font-semibold hover:underline">
              Track Guest Order here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Signed in as {email}</p>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors w-fit"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Profile & Saved Delivery Address
          </h2>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Delivery Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 h-fit">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            My Orders
          </h2>
          <div className="space-y-2 text-xs">
            <Link
              href="/track-order?order=LT-00001&token=demo-token-1234567890abcdef"
              className="block p-3 rounded-xl border border-slate-100 hover:border-sky-300 bg-slate-50 hover:bg-sky-50/50 transition-colors"
            >
              <div className="flex justify-between font-bold text-slate-900">
                <span>LT-00001</span>
                <span className="text-sky-600 font-extrabold">৳1,120</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Twinkle Diaper Pant — M (40 pcs) × 2</p>
              <span className="inline-block mt-2 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Confirmed
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
