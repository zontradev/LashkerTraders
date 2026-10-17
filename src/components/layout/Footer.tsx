import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck, HeartHandshake, Truck, Store } from 'lucide-react';
import { Link } from '@/router';
import { STORE_CONFIG } from '@/lib/constants';
import { useTranslation } from '@/i18n';

export function Footer() {
  const { t, language } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-16 border-t border-slate-800">
      {/* Trust banner */}
      <div className="border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-950/60 border border-sky-800/50 flex items-center justify-center text-sky-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                {language === 'bn' ? 'সারাদেশে দ্রুত হোম ডেলিভারি' : 'Nationwide Fast Delivery'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' ? 'ঢাকা সিটিতে মাত্র ৬০ টাকা, পার্শ্ববর্তী ৮০ টাকা, সারাদেশে ১২০ টাকা' : 'Inside Dhaka ৳60, Suburban ৳80, Outside Dhaka ৳120'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                {language === 'bn' ? '১০০% আসল ও সিলগালা স্টক' : '100% Authentic Stock'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' ? 'সরাসরি অফিসিয়াল সোর্স থেকে সংগৃহীত ফ্রেশ মেয়াদের ডায়াপার' : 'Direct source authentic diaper brands with fresh expiry'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি ও পাইকারি' : 'Cash on Delivery & B2B Wholesale'}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'bn' ? 'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন। ফার্মেসির জন্য কার্টুন রেট।' : 'Pay on delivery. Carton wholesale rates for pharmacies.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
              LT
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Lashker <span className="text-sky-400">Traders</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {t.footer.about}
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{language === 'bn' ? 'হটলাইন' : 'Helpline'}: {STORE_CONFIG.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp: {STORE_CONFIG.whatsappNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{STORE_CONFIG.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{STORE_CONFIG.address}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">{t.footer.quickLinks}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/shop" className="hover:text-white transition-colors">{t.nav.shop}</Link></li>
            <li><Link to="/b2b" className="hover:text-amber-400 text-amber-300 transition-colors font-semibold flex items-center gap-1"><Store className="w-3 h-3" /> {t.nav.b2bWholesale}</Link></li>
            <li><Link to="/category/diaper-pants" className="hover:text-white transition-colors">{language === 'bn' ? 'ডায়াপার প্যান্টস (পুল-আপ)' : 'Diaper Pants'}</Link></li>
            <li><Link to="/category/baby-diapers-belt" className="hover:text-white transition-colors">{language === 'bn' ? 'বেল্ট ডায়াপার (টেপ)' : 'Belt Diapers'}</Link></li>
            <li><Link to="/category/baby-wipes-skincare" className="hover:text-white transition-colors">{language === 'bn' ? 'বেবি ওয়াইপস' : 'Baby Wipes'}</Link></li>
          </ul>
        </div>

        {/* Popular Brands */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">{language === 'bn' ? 'শীর্ষ ব্র্যান্ড' : 'Top Brands'}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/shop?brand=twinkle" className="hover:text-white transition-colors">Twinkle Diaper</Link></li>
            <li><Link to="/shop?brand=huggies" className="hover:text-white transition-colors">Huggies Wonder Pants</Link></li>
            <li><Link to="/shop?brand=molfix" className="hover:text-white transition-colors">Molfix Air Dry</Link></li>
            <li><Link to="/shop?brand=neocare" className="hover:text-white transition-colors">NeoCare (ACI)</Link></li>
            <li><Link to="/shop?brand=pampers" className="hover:text-white transition-colors">Pampers Active Baby</Link></li>
          </ul>
        </div>

        {/* Customer Care & Policies */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">{t.footer.policies}</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/track-order" className="hover:text-white transition-colors">{t.nav.trackOrder}</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-white transition-colors">{language === 'bn' ? 'শিপিং পলিসি' : 'Shipping Policy'}</Link></li>
            <li><Link to="/return-policy" className="hover:text-white transition-colors">{language === 'bn' ? 'রিটার্ন ও রিফান্ড পলিসি' : 'Return Policy'}</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">{language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">{language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">{language === 'bn' ? 'যোগাযোগ' : 'Contact Us'}</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright & payment icons */}
      <div className="border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.name}. {t.footer.allRightsReserved}</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">Cash On Delivery</span>
            <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-medium">bKash</span>
            <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 font-medium">Nagad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
