import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  MessageCircle,
  Sparkles,
  Star,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { getProducts, getCategories, getBrands } from '@/lib/services/store-data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { STORE_CONFIG } from '@/lib/constants';

export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getCategories(),
    getBrands(),
  ]);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-100 py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Your Trusted Diaper Shopping Partner in Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Gentle Dryness & Protection For Your <span className="text-sky-600">Precious Baby</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Shop authentic, 100% genuine baby diapers with certified Japanese and European absorption technology. Fast home delivery in Dhaka (৳60) and all 64 districts.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
              >
                <span>Shop Diaper Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${STORE_CONFIG.whatsappCleanNumber}?text=Hello%20Lashker%20Traders,%20I%20would%20like%20to%20order%20baby%20diapers.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {STORE_CONFIG.whatsappNumber}</span>
              </a>
            </div>

            {/* Quick Micro-Trust */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 text-left max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-base font-extrabold text-slate-900">৳60</p>
                <p className="text-[11px] text-slate-500 font-medium">Dhaka City Delivery</p>
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900">100%</p>
                <p className="text-[11px] text-slate-500 font-medium">Genuine Guarantee</p>
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900">COD</p>
                <p className="text-[11px] text-slate-500 font-medium">Cash On Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Banner Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
                alt="Lashker Traders baby diaper products"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Bestseller
                  </span>
                  <p className="font-bold text-lg">Twinkle Baby Diaper Pants</p>
                  <p className="text-xs text-slate-200">Sizes S, M, L, XL, XXL, XXXL with 12hr leak-lock</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills & Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Diaper Categories
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose the ideal fit for your baby&apos;s comfort and stage
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="pt-4 flex items-center text-xs font-semibold text-sky-600">
                <span>Browse Products</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Diapers Showcase */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Diaper Products
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your size (S, M, L, XL, XXL, XXXL) for exact price and stock
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>See full catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Size Guide Reference Card */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Diaper Sizing Chart
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Finding The Right Diaper Size For Your Baby
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Pack counts vary by size to give optimal value. Refer to this standard weight guideline before ordering.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-8">
            {[
              { size: 'S', weight: '4 – 8 kg', packs: '42 pcs/pack' },
              { size: 'M', weight: '6 – 11 kg', packs: '40 pcs/pack' },
              { size: 'L', weight: '9 – 14 kg', packs: '34 pcs/pack' },
              { size: 'XL', weight: '12 – 17 kg', packs: '32 pcs/pack' },
              { size: 'XXL', weight: '15 – 25 kg', packs: '24 pcs/pack' },
              { size: 'XXXL', weight: '18+ kg', packs: '24 pcs/pack' },
            ].map((item) => (
              <div
                key={item.size}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center space-y-1"
              >
                <span className="text-xl font-extrabold text-amber-400">Size {item.size}</span>
                <p className="text-xs font-semibold text-white">{item.weight}</p>
                <p className="text-[11px] text-slate-300">{item.packs}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Genuine Customer Feedback
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from verified buyers across Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Nusrat Jahan',
              location: 'Mirpur, Dhaka',
              rating: 5,
              product: 'Twinkle Diaper Pant — Size M (40 pcs)',
              comment:
                'Very comfortable for my 9-month-old daughter. Zero diaper rash even after full overnight sleep. Fast delivery inside Dhaka within 24 hours!',
            },
            {
              name: 'Tanvir Ahmed',
              location: 'Dhanmondi, Dhaka',
              rating: 5,
              product: 'Twinkle Diaper Pant — Size L (34 pcs)',
              comment:
                'Original products and courteous delivery rider. WhatsApp ordering was so convenient when we were out of diapers late evening.',
            },
            {
              name: 'Sharmin Akter',
              location: 'Uttara, Dhaka',
              rating: 5,
              product: 'Huggies Wonder Pants — Size M (42 pcs)',
              comment:
                'The bubble-bed softness is great on delicate baby skin. Price was fair and packaging was completely sealed and fresh.',
            },
          ].map((rev, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{rev.name}</p>
                  <p className="text-[11px] text-slate-400">{rev.location}</p>
                </div>
                <p className="text-[10px] text-slate-400 text-right max-w-[120px] truncate">
                  {rev.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
