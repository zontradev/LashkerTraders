import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  MessageCircle,
  Truck,
  ShieldCheck,
  User,
  LayoutDashboard,
  Menu,
  X,
  Languages,
  Store,
} from 'lucide-react';
import { Link, useRouter } from '@/router';
import { STORE_CONFIG } from '@/lib/constants';
import { useCart } from '@/lib/context/cart-context';
import { useTranslation } from '@/i18n';

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const { language, setLanguage, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Truck className="w-3.5 h-3.5" /> {language === 'bn' ? 'ঢাকা সিটিতে মাত্র ৬০ টাকায় ডেলিভারি' : 'Fast Delivery Across Bangladesh (৳60 Dhaka)'}
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {language === 'bn' ? '১০০% আসল ও জেনুইন ডায়াপার' : '100% Genuine Diaper Brands'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Visible Language Selector: English | বাংলা */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-700">
              <Languages className="w-3 h-3 text-amber-400" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`transition-colors cursor-pointer ${language === 'en' ? 'text-amber-300 font-bold underline underline-offset-2' : 'text-slate-400 hover:text-slate-200'}`}
                aria-label="Switch to English"
              >
                English
              </button>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`transition-colors cursor-pointer ${language === 'bn' ? 'text-amber-300 font-bold underline underline-offset-2' : 'text-slate-400 hover:text-slate-200'}`}
                aria-label="বাংলায় পরিবর্তন করুন"
              >
                বাংলা
              </button>
            </div>

            <span className="text-slate-500 hidden sm:inline">|</span>

            <Link
              to="/b2b"
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t.nav.b2bWholesale}</span>
            </Link>

            <span className="text-slate-500 hidden sm:inline">|</span>

            <Link
              to="/track-order"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              {t.nav.trackOrder}
            </Link>

            <span className="text-slate-500 hidden sm:inline">|</span>

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappCleanNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp: {STORE_CONFIG.whatsappNumber}
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="glass-nav px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">LT</span>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Lashker <span className="text-sky-600 font-extrabold">Traders</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 tracking-wider uppercase font-medium">
                {t.nav.tagline}
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg mx-6 relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'ব্র্যান্ড বা সাইজ দিয়ে খুঁজুন (S, M, L, XL)...' : 'Search diapers by brand, size (S, M, L, XL)...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-11 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all outline-hidden"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/b2b"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.nav.b2bWholesale}</span>
            </Link>

            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.nav.admin}</span>
            </Link>

            <Link
              to="/account"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              title="Customer Account"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-600 text-white text-[11px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories navigation row */}
        <nav className="hidden md:flex max-w-7xl mx-auto items-center gap-6 mt-2 pt-2 border-t border-slate-100 text-xs font-medium text-slate-600">
          <Link to="/shop" className="hover:text-sky-600 transition-colors">
            {t.catalog.allBrands}
          </Link>
          <Link to="/category/diaper-pants" className="hover:text-sky-600 transition-colors">
            {language === 'bn' ? 'ডায়াপার প্যান্টস (পুল-আপ)' : 'Diaper Pants (Pull-Up)'}
          </Link>
          <Link to="/category/baby-diapers-belt" className="hover:text-sky-600 transition-colors">
            {language === 'bn' ? 'বেল্ট ডায়াপার (টেপ)' : 'Belt Diapers (Tape)'}
          </Link>
          <Link to="/category/baby-wipes-skincare" className="hover:text-sky-600 transition-colors">
            {language === 'bn' ? 'বেবি ওয়াইপস ও স্কিনকেয়ার' : 'Baby Wipes & Skincare'}
          </Link>
          <Link to="/b2b" className="hover:text-amber-600 transition-colors text-amber-700 font-bold flex items-center gap-1">
            <Store className="w-3 h-3" />
            <span>{t.nav.b2bWholesale}</span>
          </Link>
          <Link to="/shop?brand=twinkle" className="hover:text-sky-600 transition-colors text-sky-700 font-semibold">
            Twinkle Diaper
          </Link>
          <Link to="/shop?brand=huggies" className="hover:text-sky-600 transition-colors">
            Huggies
          </Link>
          <Link to="/shop?brand=molfix" className="hover:text-sky-600 transition-colors">
            Molfix
          </Link>
          <Link to="/shop?brand=neocare" className="hover:text-sky-600 transition-colors">
            NeoCare
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'ডায়াপার খুঁজুন...' : 'Search diapers...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-3 pr-10 text-sm"
            />
            <button type="submit" className="absolute right-2 top-2 p-1 text-slate-500">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              {t.nav.shop}
            </Link>
            <Link
              to="/b2b"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-amber-50 text-amber-800 font-bold flex items-center justify-between"
            >
              <span>{t.nav.b2bWholesale}</span>
              <Store className="w-4 h-4 text-amber-600" />
            </Link>
            <Link
              to="/category/diaper-pants"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              {language === 'bn' ? 'ডায়াপার প্যান্টস' : 'Diaper Pants'}
            </Link>
            <Link
              to="/category/baby-diapers-belt"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50"
            >
              {language === 'bn' ? 'বেল্ট ডায়াপার' : 'Belt Diapers'}
            </Link>
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between"
            >
              <span>{t.nav.trackOrder}</span>
              <Truck className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-100 text-slate-900 font-semibold flex items-center justify-between"
            >
              <span>{t.nav.admin}</span>
              <LayoutDashboard className="w-4 h-4 text-sky-600" />
            </Link>
            <div className="p-2.5 rounded-xl bg-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-sky-600" />
                <span>Language / ভাষা:</span>
              </span>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${language === 'en' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('bn');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${language === 'bn' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
