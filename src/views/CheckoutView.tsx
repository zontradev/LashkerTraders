import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
  AlertCircle,
  Tag,
  Lock,
} from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import {
  DEFAULT_DELIVERY_ZONES,
  formatBDT,
  generateWhatsAppOrderMessage,
  getWhatsAppOrderUrl,
  STORE_CONFIG,
} from '@/lib/constants';
import { placeOrder, validateCoupon, type OrderRecord, type CouponRule } from '@/lib/services/store-data';
import { checkoutFormSchema } from '@/lib/validations/checkout';
import { Link, useRouter } from '@/router';
import { useTranslation } from '@/i18n';

export function CheckoutView() {
  const { items, subtotal, clearCart } = useCart();
  const { formatPrice, t, language } = useTranslation();
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryZoneId, setDeliveryZoneId] = useState(DEFAULT_DELIVERY_ZONES[0].id);
  const [additionalNote, setAdditionalNote] = useState('');

  // Bot spam honeypot (invisible to humans, filled by automated bot crawlers)
  const [honeypot, setHoneypot] = useState('');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponRule | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({});
  const [generalError, setGeneralError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const selectedZone =
    DEFAULT_DELIVERY_ZONES.find((z) => z.id === deliveryZoneId) || DEFAULT_DELIVERY_ZONES[0];
  const deliveryFee = selectedZone.baseFee;
  const grandTotal = Math.max(0, subtotal - couponDiscount) + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const result = validateCoupon(
      couponInput.trim(),
      subtotal,
      items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }))
    );

    if (!result.valid || !result.coupon) {
      setCouponError(result.error || t.checkout.couponInvalid);
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } else {
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discountAmount);
      setCouponSuccess(t.checkout.couponApplied);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralError('');

    if (items.length === 0) {
      setGeneralError('Your cart is empty. Please add products before checking out.');
      return;
    }

    // Client-side schema pre-validation
    const validation = checkoutFormSchema.safeParse({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: deliveryAddress.trim(),
      deliveryZoneId,
      additionalNote: additionalNote.trim() || undefined,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      honeypot: honeypot || undefined,
      items: items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      })),
      idempotencyKey: `idemp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    });

    if (!validation.success) {
      setFormErrors(validation.error.flatten().fieldErrors as any);
      return;
    }

    setIsSubmitting(true);

    try {
      // Authoritative database/store order placement with server-side validation
      const result = await placeOrder(validation.data);

      if (!result.success || !result.order) {
        setGeneralError(result.error || 'Failed to place order due to inventory or stock limitation.');
      } else {
        setConfirmedOrder(result.order);
        clearCart();
      }
    } catch (err: unknown) {
      setGeneralError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingToken = () => {
    if (confirmedOrder?.guestTrackingToken) {
      navigator.clipboard.writeText(confirmedOrder.guestTrackingToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // Order Confirmed State
  if (confirmedOrder) {
    const waMessage = generateWhatsAppOrderMessage({
      orderNumber: confirmedOrder.orderNumber,
      customerName: confirmedOrder.customerName,
      customerPhone: confirmedOrder.customerPhone,
      deliveryAddress: confirmedOrder.deliveryAddress,
      additionalNote: confirmedOrder.additionalNote || undefined,
      items: confirmedOrder.items.map((i) => ({
        productName: i.productName,
        size: i.size,
        packCount: i.packCount,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.subtotal,
      })),
      deliveryFee: confirmedOrder.deliveryCharge,
      total: confirmedOrder.total,
    });

    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.checkout.orderSuccessTitle}
            </h1>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {t.checkout.orderSuccessSubtitle}
            </p>
          </div>

          {/* Key Reference Box */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {t.checkout.orderNumberLabel}
                </span>
                <p className="text-xl font-mono font-extrabold text-sky-700">
                  {confirmedOrder.orderNumber}
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  {t.cart.total}
                </span>
                <p className="text-xl font-extrabold text-slate-900">
                  {formatPrice(confirmedOrder.total)}
                </p>
              </div>
            </div>

            {/* 48-char Guest Tracking Token */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-600">
                {t.checkout.trackingTokenLabel}
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={confirmedOrder.guestTrackingToken}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 outline-hidden select-all"
                />
                <button
                  onClick={copyTrackingToken}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? t.checkout.copiedToken : t.checkout.copyToken}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' 
                  ? 'এই গোপন টোকেনটি সংরক্ষণ করে পরবর্তীতে যে কোনো সময় আপনার অর্ডার ট্র্যাক করতে পারবেন।'
                  : 'Save this unique token to track your order live anytime without logging in.'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/track-order?token=${confirmedOrder.guestTrackingToken}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{t.checkout.trackOrderBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={getWhatsAppOrderUrl(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.checkout.whatsappConfirmation}</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Cart Empty redirect
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-900">{t.cart.emptyTitle}</h1>
        <p className="text-xs text-slate-500">{t.cart.emptySubtitle}</p>
        <Link to="/shop" className="btn-primary">
          {t.cart.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.checkout.title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t.checkout.subtitle}
        </p>
      </div>

      {generalError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer & Delivery Details */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            {t.checkout.customerInfo}
          </h2>

          <div className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.checkout.fullName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.checkout.fullNamePlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:bg-white focus:border-sky-500"
              />
              {formErrors.customerName && (
                <p className="text-rose-600 text-[11px] mt-1">{formErrors.customerName[0]}</p>
              )}
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.checkout.phone} <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={t.checkout.phonePlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono outline-hidden focus:bg-white focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'bn' 
                  ? '১১ ডিজিটের সঠিক মোবাইল নম্বর (যেমন: 01797753722)'
                  : 'Valid 11-digit Bangladeshi mobile number (e.g. 01797753722)'}
              </p>
              {formErrors.customerPhone && (
                <p className="text-rose-600 text-[11px] mt-1">{formErrors.customerPhone[0]}</p>
              )}
            </div>

            {/* Delivery Zone */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.checkout.deliveryZone} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DEFAULT_DELIVERY_ZONES.map((zone) => {
                  const isSelected = zone.id === deliveryZoneId;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setDeliveryZoneId(zone.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">{zone.name}</p>
                      <p className="text-sky-700 font-extrabold text-sm mt-0.5">
                        {formatPrice(zone.baseFee)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">{zone.estimatedDays}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.checkout.deliveryAddress} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={t.checkout.deliveryAddressPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:bg-white focus:border-sky-500"
              />
              {formErrors.deliveryAddress && (
                <p className="text-rose-600 text-[11px] mt-1">{formErrors.deliveryAddress[0]}</p>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {t.checkout.notes}
              </label>
              <input
                type="text"
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                placeholder={t.checkout.notesPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-hidden focus:bg-white focus:border-sky-500"
              />
            </div>

            {/* Invisible bot honeypot spam protection */}
            <input
              type="text"
              name="company_fax_check"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="opacity-0 absolute -left-[9999px] pointer-events-none w-0 h-0"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Right: Authoritative Order Summary & Confirmation */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            {t.checkout.orderSummary}
          </h2>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.variantId} className="py-2.5 flex items-center justify-between text-xs first:pt-0">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-slate-800 line-clamp-1">{i.productName}</p>
                  <p className="text-[11px] text-slate-400">
                    Size: {i.size} ({i.packCount} pcs) × {i.quantity}
                  </p>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatPrice(i.unitPrice * i.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon / Promo Code Input Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.checkout.couponCode}</span>
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <div>
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.code}</span>
                  </p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">{appliedCoupon.description}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  {t.checkout.removeCoupon}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder={t.checkout.couponPlaceholder}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono uppercase outline-hidden focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {t.checkout.applyCoupon}
                </button>
              </div>
            )}
            {couponError && <p className="text-rose-600 text-[11px] font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-emerald-700 text-[11px] font-medium">{couponSuccess}</p>}
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
              <span>{language === 'bn' ? 'ব্যবহারযোগ্য কুপন:' : 'Popular codes:'}</span>
              <button
                type="button"
                onClick={() => setCouponInput('WELCOME50')}
                className="text-sky-600 font-semibold hover:underline cursor-pointer"
              >
                WELCOME50
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setCouponInput('LASHKER100')}
                className="text-sky-600 font-semibold hover:underline cursor-pointer"
              >
                LASHKER100
              </button>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t.cart.subtotal}</span>
              <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{t.checkout.discount}</span>
                </span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>{t.cart.deliveryCharge} ({selectedZone.name})</span>
              <span className="font-semibold text-slate-800">{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
              <span>{t.cart.total}</span>
              <span className="text-xl text-sky-700">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              {language === 'bn' 
                ? 'ক্যাশ অন ডেলিভারি (COD): ডেলিভারিম্যান থেকে পণ্য বুঝে নিয়ে মূল্য পরিশোধ করুন।'
                : 'Cash On Delivery: Pay safely upon receiving and inspecting your package.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>{t.checkout.submitting}</span>
            ) : (
              <>
                <span>{t.checkout.placeOrderBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
