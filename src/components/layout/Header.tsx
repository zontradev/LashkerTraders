import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  Truck,
  ShieldCheck,
  Headphones,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Store,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Link, useRouter } from '@/router';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useAuth } from '@/lib/context/auth-context';
import { BabyLogo } from '@/components/common/BabyLogo';
import { getSearchSuggestions } from '@/lib/services/store-data';

export function Header() {
  const { user, isEmailVerified } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{
    products: any[];
    categories: any[];
    brands: any[];
  }>({ products: [], categories: [], brands: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions({ products: [], categories: [], brands: [] });
      return;
    }

    const timer = setTimeout(() => {
      getSearchSuggestions(searchQuery.trim()).then((res) => {
        setSuggestions(res);
        setShowSuggestions(true);
      });
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setAllCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectSuggestion = (path: string) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Top utility bar */}
      <div className="bg-[#f8fafc] text-slate-600 text-xs py-2 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left features */}
          <div className="flex items-center gap-6 overflow-hidden">
            <span className="flex items-center gap-2 text-slate-700 font-medium text-xs truncate">
              <Truck className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
              <span>Free delivery on orders above ৳1,000 (Dhaka)</span>
            </span>

            <span className="hidden md:flex items-center gap-2 text-slate-700 font-medium text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
              <span>100% Original Products</span>
            </span>
          </div>

          {/* Right Links & Phone */}
          <div className="flex items-center gap-4 shrink-0 text-slate-600 font-medium">
            <a
              href="tel:01797753722"
              className="flex items-center gap-1.5 hover:text-[#00b050] transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Customer Support: 01797753722</span>
            </a>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <Link
              to="/track-order"
              className="hover:text-[#00b050] transition-colors hidden sm:inline"
            >
              Track Order
            </Link>

            <span className="text-slate-300 hidden sm:inline">|</span>

            <Link
              to="/contact"
              className="hover:text-[#00b050] transition-colors hidden sm:inline"
            >
              Help & Support
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4 sm:gap-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Baby Logo */}
        <Link to="/" className="shrink-0 flex items-center">
          <BabyLogo size="md" showTagline={true} />
        </Link>

        {/* Search Bar with live autocomplete */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl mx-2 sm:mx-6 relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSuggestions(true);
                }}
                placeholder="Search for diapers, baby care, brands..."
                className="w-full bg-[#f8fafc] border border-slate-200 rounded-full py-2.5 pl-5 pr-14 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00b050] focus:ring-2 focus:ring-[#00b050]/20 transition-all outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-[#00b050] hover:bg-[#009643] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && (suggestions.products.length > 0 || suggestions.categories.length > 0 || suggestions.brands.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 max-h-[420px] overflow-y-auto">
              {suggestions.products.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Matching Products
                  </div>
                  <div className="space-y-1">
                    {suggestions.products.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(`/product/${p.slug}`)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                      >
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#00b050]">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>{p.brand}</span>
                            <span>•</span>
                            <span className="font-bold text-slate-900">৳ {p.price.toLocaleString()}</span>
                            {p.matchedSku && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.2 rounded font-mono font-medium">
                                SKU: {p.matchedSku}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00b050] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories & Brands matching */}
              {(suggestions.categories.length > 0 || suggestions.brands.length > 0) && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap px-2">
                  <span className="text-[11px] text-slate-400 font-medium">Quick filters:</span>
                  {suggestions.categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(`/category/${c.slug}`)}
                      className="text-xs bg-slate-100 hover:bg-[#00b050] hover:text-white px-2.5 py-1 rounded-full text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      {c.name}
                    </button>
                  ))}
                  {suggestions.brands.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(`/shop?brand=${b.slug}`)}
                      className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side Actions: Wishlist, Cart, Login / Sign Up */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          {/* Wishlist Button */}
          <Link
            to="/account"
            className="flex flex-col items-center group relative cursor-pointer"
            aria-label="Wishlist"
          >
            <div className="relative p-1">
              <Heart className="w-6 h-6 text-slate-700 group-hover:text-rose-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors hidden sm:block">
              Wishlist
            </span>
          </Link>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center group relative cursor-pointer"
            aria-label="Cart"
          >
            <div className="relative p-1">
              <ShoppingBag className="w-6 h-6 text-slate-700 group-hover:text-[#00b050] transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00b050] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors hidden sm:block">
              Cart
            </span>
          </button>

          {/* User Profile / Auth Pill */}
          <Link
            to="/account"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-800 text-xs font-semibold cursor-pointer group"
          >
            {user ? (
              <>
                <div className="relative">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[#00b050]">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  {isEmailVerified && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00b050] border-2 border-white rounded-full"
                      title="Verified Account"
                    />
                  )}
                </div>
                <span className="hidden md:inline max-w-[110px] truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'My Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden md:inline">Login / Sign Up</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </>
            )}
          </Link>
        </div>
      </div>

      {/* 3. Category Navigation Row */}
      <div className="border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
          {/* All Categories Dropdown Button */}
          <div ref={categoryMenuRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setAllCategoriesOpen(!allCategoriesOpen)}
              className="bg-[#00b050] hover:bg-[#009643] text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg flex items-center gap-2.5 transition-colors shadow-xs cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${allCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {allCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                <Link
                  to="/shop"
                  onClick={() => setAllCategoriesOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-800"
                >
                  <span>All Products</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <div className="h-px bg-slate-100 my-1" />
                {[
                  { name: 'Diapers', slug: 'diapers' },
                  { name: 'Baby Care', slug: 'baby-care' },
                  { name: 'Feeding', slug: 'feeding' },
                  { name: 'Wipes & Tissue', slug: 'wipes-tissue' },
                  { name: 'Bath & Skincare', slug: 'bath-skincare' },
                  { name: 'Accessories', slug: 'accessories' },
                  { name: 'Brands', slug: 'brands' },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    to={cat.slug === 'brands' ? '/shop' : `/category/${cat.slug}`}
                    onClick={() => setAllCategoriesOpen(false)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 text-xs text-slate-700 hover:text-[#00b050] transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Horizontal Links */}
          <nav className="flex items-center gap-6 sm:gap-7 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
            <Link to="/" className="text-[#00b050] font-bold hover:text-[#009643] transition-colors">
              Home
            </Link>
            <Link to="/category/diapers" className="hover:text-[#00b050] transition-colors">
              Diapers
            </Link>
            <Link to="/category/baby-care" className="hover:text-[#00b050] transition-colors">
              Baby Care
            </Link>
            <Link to="/category/feeding" className="hover:text-[#00b050] transition-colors">
              Feeding
            </Link>
            <Link to="/category/wipes-tissue" className="hover:text-[#00b050] transition-colors">
              Wipes & Tissue
            </Link>
            <Link to="/category/accessories" className="hover:text-[#00b050] transition-colors">
              Accessories
            </Link>
            <Link to="/shop" className="hover:text-[#00b050] transition-colors">
              Brands
            </Link>
            <Link to="/shop" className="text-amber-600 hover:text-amber-700 transition-colors font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Offers</span>
            </Link>
            <Link
              to="/b2b"
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full border border-amber-200 transition-colors flex items-center gap-1 text-xs"
            >
              <Store className="w-3 h-3 text-amber-600" />
              <span>B2B Wholesale</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diapers..."
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 w-8 bg-[#00b050] text-white rounded-full flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg text-[#00b050] hover:bg-slate-50">
              Home
            </Link>
            <Link to="/category/diapers" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">
              Diapers
            </Link>
            <Link to="/category/baby-care" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">
              Baby Care
            </Link>
            <Link to="/category/feeding" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">
              Feeding
            </Link>
            <Link to="/category/wipes-tissue" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">
              Wipes & Tissue
            </Link>
            <Link to="/b2b" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-between">
              <span>B2B Wholesale</span>
              <Store className="w-4 h-4 text-amber-600" />
            </Link>
            <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">
              Track Order
            </Link>
            <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-50">
              My Account / Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
