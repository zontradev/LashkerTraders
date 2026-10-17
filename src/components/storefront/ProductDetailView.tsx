import React, { useState } from 'react';
import {
  ShoppingBag,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Star,
  Plus,
  Minus,
  Check,
  Store,
} from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/services/store-data';
import { VariantSelector } from './VariantSelector';
import { generateWhatsAppOrderMessage, getWhatsAppOrderUrl, STORE_CONFIG } from '@/lib/constants';
import { useCart } from '@/lib/context/cart-context';
import { useRouter, Link } from '@/router';
import { useTranslation } from '@/i18n';

export function ProductDetailView({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { formatPrice, t, language } = useTranslation();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || null
  );
  const [activeImage, setActiveImage] = useState(
    selectedVariant?.variantImageUrl || product.mainImage
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity <= 0;

  const handleVariantChange = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (v.variantImageUrl) {
      setActiveImage(v.variantImageUrl);
    }
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || isOutOfStock) return;
    addItem(product, selectedVariant, quantity);
    router.navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (!selectedVariant) return;

    const message = generateWhatsAppOrderMessage({
      customerName: '[Customer Name]',
      customerPhone: '[Phone Number]',
      deliveryAddress: '[Delivery Address]',
      items: [
        {
          productName: product.name,
          size: selectedVariant.size,
          packCount: selectedVariant.packCount,
          quantity,
          unitPrice: selectedVariant.price,
          subtotal: selectedVariant.price * quantity,
        },
      ],
      deliveryFee: 60, // Inside Dhaka
      total: selectedVariant.price * quantity + 60,
    });

    window.open(getWhatsAppOrderUrl(message), '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    setReviewSubmitted(true);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xs">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {selectedVariant?.regularPrice &&
              selectedVariant.regularPrice > selectedVariant.price && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Save {formatPrice(selectedVariant.regularPrice - selectedVariant.price)}
                </span>
              )}
          </div>

          {/* Thumbnails */}
          {product.galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImage === img
                      ? 'border-sky-600 ring-2 ring-sky-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Purchasing Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 text-xs font-semibold">
                {product.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.averageRating)
                        ? 'fill-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">({product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.basePrice)}
            </span>
            {selectedVariant?.regularPrice &&
              selectedVariant.regularPrice > selectedVariant.price && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(selectedVariant.regularPrice)}
                </span>
              )}
            <span className="text-xs text-slate-500 font-medium ml-auto">
              {selectedVariant?.packCount} {t.catalog.pcsPerPack}
            </span>
          </div>

          {/* Sizing & Variant Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {language === 'bn' ? 'শিশুর সাইজ নির্বাচন করুন' : 'Select Diaper Size'}
              </label>
              <Link to="/#sizing-chart" className="text-xs text-sky-600 hover:underline font-semibold">
                {t.sizing.badge}
              </Link>
            </div>

            <VariantSelector
              variants={product.variants}
              selectedVariantId={selectedVariant?.id || ''}
              onVariantChange={handleVariantChange}
            />

            {/* Stock Level Indicator */}
            <div className="text-xs font-medium pt-1">
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  {t.catalog.outOfStock}
                </span>
              ) : selectedVariant && selectedVariant.stockQuantity <= 15 ? (
                <span className="text-amber-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  {t.catalog.lowStock} ({selectedVariant.stockQuantity} {language === 'bn' ? 'প্যাক অবশিষ্ট' : 'packs left'})
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  {t.catalog.inStock} ({selectedVariant?.stockQuantity} {language === 'bn' ? 'প্যাক উপলব্ধ' : 'packs available'})
                </span>
              )}
            </div>
          </div>

          {/* B2B Wholesale Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5">
            <Store className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-900">
                {language === 'bn' ? 'ফার্মেসি ও পাইকারি কার্টুন রেট:' : 'Wholesale Carton Pricing:'}
              </span>
              <p className="text-amber-800 mt-0.5">
                {language === 'bn' 
                  ? '৫+ প্যাকে ৮% এবং ২০+ প্যাকে ১৪% পাইকারি কমিশন রেট। ' 
                  : '5+ packs: 8% off, 20+ packs: 14% off wholesale tier pricing. '}
                <Link to="/b2b" className="font-bold underline text-amber-950">
                  {language === 'bn' ? 'পাইকারি পোর্টাল দেখুন' : 'View B2B Portal'}
                </Link>
              </p>
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(selectedVariant?.stockQuantity || 1, quantity + 1))
                  }
                  disabled={quantity >= (selectedVariant?.stockQuantity || 1) || isOutOfStock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.catalog.addToCart}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{t.catalog.buyNow}</span>
              </button>
            </div>

            {/* Direct WhatsApp Order CTA */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={isOutOfStock}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি অর্ডার দিন' : 'Order This Product on WhatsApp'}</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>{language === 'bn' ? 'ঢাকায় ৬০ ৳, সারাদেশে ১২০ ৳' : 'Dhaka ৳60, Outside ৳120'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? '১০০% আসল ও সিলগালা প্যাকেট' : '100% Authentic Guaranteed'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {language === 'bn' ? 'পণ্যের বিবরণ' : 'Product Description'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{language === 'bn' ? 'গ্রাহকদের মতামত' : 'Customer Reviews'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{language === 'bn' ? 'যাচাইকৃত ক্রেতাদের নির্ভরযোগ্য রিভিউ' : 'Approved reviews from verified purchasers'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {product.averageRating.toFixed(1)}
            </span>
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Review Submission Form */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">{language === 'bn' ? 'আপনার রিভিউ লিখুন' : 'Write a Product Review'}</h3>
          {reviewSubmitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'ধন্যবাদ! আপনার রিভিউটি গ্রহণ করা হয়েছে।' : 'Thank you! Your review has been submitted for moderation.'}</span>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{language === 'bn' ? 'আপনার নাম' : 'Your Name'}</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-hidden focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{language === 'bn' ? 'রেটিং' : 'Rating'}</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-hidden focus:border-sky-500"
                  >
                    <option value={5}>5 Stars — Excellent Dryness & Fit</option>
                    <option value={4}>4 Stars — Very Good Quality</option>
                    <option value={3}>3 Stars — Average</option>
                    <option value={2}>2 Stars — Below Expectations</option>
                    <option value={1}>1 Star — Poor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{language === 'bn' ? 'আপনার মন্তব্য' : 'Your Review'}</label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={language === 'bn' ? 'শিশুর ফিটিং, শুষ্কতা ও ওভারনাইট কমফোর্ট সম্পর্কে লিখুন...' : 'Tell us about the fit, absorption, and overnight comfort for your baby...'}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-hidden focus:border-sky-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'রিভিউ জমা দিন' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
