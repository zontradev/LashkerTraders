import React, { useState } from 'react';
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Check,
} from 'lucide-react';
import { Link } from '@/router';
import { BabyLogo } from '@/components/common/BabyLogo';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 text-slate-600 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <BabyLogo size="md" showTagline={true} />
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Your trusted partner for quality baby care products in Bangladesh.
            </p>

            {/* Social Icons matching screenshot */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#00b050] hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#00b050] hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#00b050] hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801797753722"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#00b050] hover:text-white text-slate-600 flex items-center justify-center transition-colors shadow-2xs"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/" className="hover:text-[#00b050] transition-colors">
                  › Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#00b050] transition-colors">
                  › All Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#00b050] transition-colors">
                  › About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00b050] transition-colors">
                  › Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Customer Service</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/shipping-policy" className="hover:text-[#00b050] transition-colors">
                  › Delivery Information
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-[#00b050] transition-colors">
                  › Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#00b050] transition-colors">
                  › Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#00b050] transition-colors">
                  › Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00b050] transition-colors">
                  › FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: My Account */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">My Account</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <Link to="/account" className="hover:text-[#00b050] transition-colors">
                  › Login / Sign Up
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#00b050] transition-colors">
                  › Track Order
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#00b050] transition-colors">
                  › My Orders
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#00b050] transition-colors">
                  › Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Subscribe to Our Newsletter */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Subscribe to Our Newsletter</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get the latest updates on new products and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00b050] outline-hidden transition-all"
              />
              <button
                type="submit"
                className="w-full bg-[#00b050] hover:bg-[#009643] text-white font-bold text-xs py-2 px-4 rounded-lg transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright line matching screenshot */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2025 Lashker Traders. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>Dhaka, Bangladesh</span>
            <span>•</span>
            <span>Hotline: 01797753722</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
