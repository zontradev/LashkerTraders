import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Lashker Traders for retail orders and support in Bangladesh.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Contact</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Customer Support</h1>
        <p className="text-xs text-slate-500">
          Our friendly customer care team is available daily from 9:00 AM to 10:00 PM BST.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Direct Contact Channels</h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Phone className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Phone Support</p>
                <p className="text-slate-500">{STORE_CONFIG.phone}</p>
              </div>
            </div>

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappCleanNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">WhatsApp Hotline</p>
                <p className="text-slate-500">{STORE_CONFIG.whatsappNumber} (Quick order & inquiries)</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Email Inquiries</p>
                <p className="text-slate-500">{STORE_CONFIG.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Distribution Center</p>
                <p className="text-slate-500">{STORE_CONFIG.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Send an Inquiry</h2>
          <form className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
              <input type="text" required className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input type="tel" required className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono" />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message</label>
              <textarea rows={3} required className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs" />
            </div>
            <button type="button" className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors">
              Submit Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
