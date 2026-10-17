import React, { useState, useEffect } from 'react';
import {
  Store,
  Calculator,
  CheckCircle2,
  Phone,
  MessageCircle,
  Truck,
  ShieldCheck,
  Building,
  TrendingUp,
  Package,
  ArrowRight,
  Lock,
  BadgePercent,
} from 'lucide-react';
import { STORE_CONFIG, formatBDT } from '@/lib/constants';
import { useTranslation } from '@/i18n';
import {
  isCurrentUserB2BGranted,
  getCurrentUserB2BMembership,
  getProducts,
  type Product,
  type ProductVariant,
  type B2BMembershipRecord,
} from '@/lib/services/store-data';
import { useCart } from '@/lib/context/cart-context';
import { Link, useRouter } from '@/router';

export function B2BWholesaleView() {
  const { formatPrice, t, language } = useTranslation();
  const router = useRouter();
  const { addItem } = useCart();

  const [isB2BGranted, setIsB2BGranted] = useState(false);
  const [b2bMember, setB2bMember] = useState<B2BMembershipRecord | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartonAddedSku, setCartonAddedSku] = useState<string | null>(null);

  // Calculator state
  const [monthlyPacks, setMonthlyPacks] = useState<number>(100);
  const avgRetailPrice = 540; // Average MRP in Bangladesh
  const wholesaleDiscount = monthlyPacks >= 50 ? 0.20 : monthlyPacks >= 20 ? 0.14 : 0.08;
  const wholesaleCostPerPack = Math.round(avgRetailPrice * (1 - wholesaleDiscount));
  const profitPerPack = avgRetailPrice - wholesaleCostPerPack;
  const totalMonthlyProfit = profitPerPack * monthlyPacks;
  const totalWholesaleInvestment = wholesaleCostPerPack * monthlyPacks;

  // Inquiry Form state
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [estimatedQuantity, setEstimatedQuantity] = useState('50');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const granted = isCurrentUserB2BGranted();
    const mem = getCurrentUserB2BMembership();
    setIsB2BGranted(granted);
    setB2bMember(mem);

    getProducts().then((list) => {
      setProducts(list);
    });
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleAddCarton = (product: Product, variant: ProductVariant, moq: number) => {
    addItem(product, variant, moq);
    setCartonAddedSku(variant.sku);
    setTimeout(() => setCartonAddedSku(null), 2000);
  };

  const getWhatsAppB2BUrl = () => {
    const text = encodeURIComponent(
      `Hello Lashker Traders Wholesale Team,\nI am interested in B2B wholesale diaper purchasing.\n\nBusiness Name: ${businessName || '[Business Name]'}\nContact Person: ${contactName || '[Contact Person]'}\nPhone: ${phone || '[Phone]'}\nDistrict: ${district}\nEstimated Monthly Volume: ${estimatedQuantity} packs\n\nPlease share current carton wholesale price list and delivery terms.`
    );
    return `https://wa.me/${STORE_CONFIG.whatsappCleanNumber}?text=${text}`;
  };

  return (
    <div className="space-y-12 pb-16">
      {/* B2B Hero */}
      <section className="b2b-hero text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Store className="w-4 h-4 text-amber-400" />
            <span>{t.b2b.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.b2b.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.b2b.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {isB2BGranted ? (
              <a
                href="#wholesale-catalog"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <Package className="w-4 h-4" />
                <span>View Wholesale Catalog</span>
              </a>
            ) : (
              <Link
                to="/account"
                className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
              >
                <Store className="w-4 h-4" />
                <span>Apply for Wholesale Access</span>
              </Link>
            )}

            <a
              href={`https://wa.me/${STORE_CONFIG.whatsappCleanNumber}?text=Hello%20Lashker%20Traders,%20I%20would%20like%20to%20discuss%20B2B%20wholesale%20diaper%20supply.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.b2b.whatsappDirect}</span>
            </a>

            <a
              href="#calculator"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-slate-700 transition-all"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'লাভের হিসাব করুন' : 'Profit Calculator'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Active B2B Partner Wholesale Portal                                */}
      {/* ------------------------------------------------------------------ */}
      {isB2BGranted && (
        <section id="wholesale-catalog" className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-amber-100">
                  Verified B2B Wholesale Partner
                </span>
                <h2 className="text-2xl font-black">{b2bMember?.businessName}</h2>
                <p className="text-xs text-amber-100 mt-1">
                  Active Price Group: <strong>{b2bMember?.priceGroupName}</strong> • Credit Facility: ৳{b2bMember?.creditLimit?.toLocaleString()} • Carton MOQ: {b2bMember?.moqPacks || 20} pcs
                </p>
              </div>
              <Link
                to="/account"
                className="px-4 py-2.5 rounded-xl bg-white text-amber-900 font-bold text-xs hover:bg-amber-50 transition-colors shadow-xs"
              >
                Manage B2B Account
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Wholesale Diaper Inventory & Carton Rates</h3>
              <p className="text-xs text-slate-500">Live distributor pricing unlocked for your commercial account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) =>
                p.variants.map((v) => {
                  const wsPrice = v.wholesalePrice || Math.round(v.price * 0.85);
                  const moq = v.wholesaleMoq || 20;
                  const cartonTotal = wsPrice * moq;
                  const isAdded = cartonAddedSku === v.sku;

                  return (
                    <div
                      key={v.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <img
                            src={v.variantImageUrl || p.mainImage}
                            alt={p.name}
                            className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              {p.brand} • Size {v.size}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{p.name}</h4>
                            <p className="text-[11px] text-slate-500">{v.packCount} pcs/pack</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-amber-800 font-bold uppercase">Wholesale Price</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-black text-amber-950">{formatPrice(wsPrice)}</span>
                              <span className="text-xs text-slate-400 line-through">MRP {formatPrice(v.price)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-amber-800 font-bold uppercase">Carton (20 pcs)</span>
                            <p className="text-xs font-bold text-slate-800">{formatPrice(cartonTotal)}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddCarton(p, v, moq)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>{isAdded ? 'Added 1 Carton!' : `Add Carton (${moq} packs) to Cart`}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* Wholesale Tier Schedules */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {language === 'bn' ? 'পাইকারি কার্টুন মূল্যতালিকা ও কমিশন কাঠামো' : 'Wholesale Carton Pricing & Tier Schedule'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'bn' ? 'অর্ডার ভলিউম যত বড়, আপনার প্রতি প্যাকে লাভের পরিমাণ তত বেশি' : 'Larger carton volume provides higher retail margin for your pharmacy or store'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="b2b-tier-card">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.b2b.tier1Title}
            </span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{t.b2b.tier1Qty}</p>
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="font-extrabold text-amber-800 text-sm">{t.b2b.tier1Discount}</span>
            </div>
            <p className="text-xs text-slate-600 mt-4 leading-relaxed">{t.b2b.tier1Desc}</p>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard Cash On Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Mixed sizes allowed in carton</span>
              </div>
            </div>
          </div>

          {/* Tier 2 (Featured) */}
          <div className="b2b-tier-card featured">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                {t.b2b.tier2Title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold">
                Most Popular
              </span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{t.b2b.tier2Qty}</p>
            <div className="mt-4 p-3 rounded-xl bg-sky-100 border border-sky-300">
              <span className="font-extrabold text-sky-900 text-sm">{t.b2b.tier2Discount}</span>
            </div>
            <p className="text-xs text-slate-600 mt-4 leading-relaxed">{t.b2b.tier2Desc}</p>
            <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Priority courier dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated B2B account representative</span>
              </div>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="b2b-tier-card">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.b2b.tier3Title}
            </span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{t.b2b.tier3Qty}</p>
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-extrabold text-emerald-800 text-sm">{t.b2b.tier3Discount}</span>
            </div>
            <p className="text-xs text-slate-600 mt-4 leading-relaxed">{t.b2b.tier3Desc}</p>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct warehouse supply contract</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Custom promotional shop banners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Margin Calculator */}
      <section id="calculator" className="max-w-7xl mx-auto px-4">
        <div className="b2b-calculator-box">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  {language === 'bn' ? 'মার্জিন ক্যালকুলেটর' : 'Interactive ROI Tool'}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t.b2b.calculatorTitle}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.b2b.calculatorDesc}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label className="text-slate-700">{t.b2b.packsPerMonth}</label>
                  <span className="text-sky-700 font-extrabold text-base">{monthlyPacks} packs</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={500}
                  step={5}
                  value={monthlyPacks}
                  onChange={(e) => setMonthlyPacks(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5 packs (Minimum)</span>
                  <span>100 packs</span>
                  <span>500 packs (Distributor)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">{t.b2b.avgSellingPrice}</span>
                <p className="text-lg font-extrabold text-slate-900">{formatPrice(avgRetailPrice)}</p>
                <p className="text-[10px] text-slate-400">Standard retail pack MRP</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">{t.b2b.wholesaleCost}</span>
                <p className="text-lg font-extrabold text-sky-700">{formatPrice(wholesaleCostPerPack)}</p>
                <p className="text-[10px] text-sky-600 font-semibold">
                  {Math.round(wholesaleDiscount * 100)}% wholesale discount
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Profit per Pack</span>
                <p className="text-lg font-extrabold text-emerald-600">{formatPrice(profitPerPack)}</p>
                <p className="text-[10px] text-slate-400">Gross margin per unit</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[11px] text-emerald-700 font-bold uppercase">{t.b2b.yourProfit}</span>
                <p className="text-2xl font-extrabold text-emerald-800">{formatPrice(totalMonthlyProfit)}</p>
                <p className="text-[10px] text-emerald-700">From {monthlyPacks} packs monthly sales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Application Form */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs space-y-6">
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.b2b.inquiryTitle}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.b2b.inquirySubtitle}
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">{t.b2b.inquirySuccess}</h3>
              <p className="text-xs text-emerald-700">
                You can also reach our manager directly on WhatsApp for instant confirmation.
              </p>
              <a
                href={getWhatsAppB2BUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.b2b.pharmacyName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Al-Madina Pharmacy & Baby Shop"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.b2b.contactPerson} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Mohammad Kabir"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.b2b.phone} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01797753722"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono outline-hidden focus:bg-white focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.b2b.district} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Dhaka, Gazipur, Cumilla"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.b2b.estimatedMonthlyQty}
                  </label>
                  <select
                    value={estimatedQuantity}
                    onChange={(e) => setEstimatedQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                  >
                    <option value="10-20">10 – 20 Packs</option>
                    <option value="20-50">20 – 50 Packs</option>
                    <option value="50-100">50 – 100 Packs</option>
                    <option value="100+">100+ Packs (Distributor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.b2b.notes}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Preferred brands (Twinkle, Huggies, NeoCare), sizing preferences..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-hidden focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all shadow-md cursor-pointer"
                >
                  {t.b2b.submitInquiry}
                </button>

                <a
                  href={getWhatsAppB2BUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.b2b.whatsappDirect}</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
