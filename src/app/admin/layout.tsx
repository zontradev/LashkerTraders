'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileSpreadsheet,
  Star,
  Settings,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products & Variants', icon: Package },
    { href: '/admin/orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { href: '/admin/import', label: 'Product Import Center', icon: FileSpreadsheet },
    { href: '/admin/reviews', label: 'Customer Reviews', icon: Star },
    { href: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Top Admin Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <span className="text-slate-700">|</span>
          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Lashker Traders Operations Console
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono text-[11px]">
            Role: Admin
          </span>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
