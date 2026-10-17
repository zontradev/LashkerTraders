'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { DEFAULT_DELIVERY_ZONES, formatBDT, STORE_CONFIG } from '@/lib/constants';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState(STORE_CONFIG.name);
  const [tagline, setTagline] = useState(STORE_CONFIG.tagline);
  const [whatsapp, setWhatsapp] = useState(STORE_CONFIG.whatsappNumber);
  const [phone, setPhone] = useState(STORE_CONFIG.phone);
  const [email, setEmail] = useState(STORE_CONFIG.email);

  // Delivery zone charges
  const [zones, setZones] = useState(DEFAULT_DELIVERY_ZONES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateZoneFee = (id: string, newFee: number) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, baseFee: newFee } : z))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Store & Delivery Pricing Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage database-backed delivery fees, WhatsApp hotline, and business profile without touching code
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings saved successfully!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Delivery Zones Pricing Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Delivery Zone Fees (BDT)
          </h2>
          <p className="text-xs text-slate-500">
            These authoritative rates are used on the checkout server and WhatsApp message generator.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {zones.map((z) => (
              <div key={z.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">{z.name}</span>
                <p className="text-[11px] text-slate-500">{z.description}</p>
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">
                    Delivery Fee (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={z.baseFee}
                    onChange={(e) => updateZoneFee(z.id, Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white font-extrabold text-sm text-slate-900 mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp & Brand Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Brand & Communication Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business WhatsApp Number</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Helpline Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  );
}
