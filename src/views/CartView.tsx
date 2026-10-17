import React from 'react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, MessageCircle, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { DEFAULT_DELIVERY_ZONES, generateWhatsAppOrderMessage, getWhatsAppOrderUrl, STORE_CONFIG } from '@/lib/constants';
import { Link, useRouter } from '@/router';
import { useTranslation } from '@/i18n';

export function CartView() {
  const { items, removeItem, updateQuantity, itemCount, subtotal } = useCart();
  const { formatPrice, t, language } = useTranslation();
  const router = useRouter();

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppOrderMessage({
      customerName: '[Customer Name]',
      customerPhone: '[Phone Number]',
      deliveryAddress: '[Delivery Address]',
      items: items.map((item) => ({
        productName: item.productName,
        size: item.size,
        packCount: item.packCount,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      })),
      deliveryFee: 60,
      total: subtotal + 60,
    });

    window.open(getWhatsAppOrderUrl(message), '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">{t.cart.emptyTitle}</h1>
          <p className="text-sm text-slate-500">{t.cart.emptySubtitle}</p>
        </div>
        <Link to="/shop" className="btn-primary">
          <span>{t.cart.startShopping}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.cart.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {itemCount} {language === 'bn' ? 'টি আইটেম ব্যাগে রয়েছে' : 'items currently in your bag'}
          </p>
        </div>
        <Link to="/shop" className="text-xs font-semibold text-sky-600 hover:underline">
          {language === 'bn' ? '+ আরো ডায়াপার যোগ করুন' : '+ Continue Shopping'}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 divide-y divide-slate-100 shadow-xs">
          {items.map((item) => (
            <div key={item.variantId} className="py-5 flex gap-4 first:pt-0 last:pb-0 items-center">
              <div className="w-20 h-20 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="font-bold text-sm text-slate-900 hover:text-sky-600 transition-colors line-clamp-1"
                  >
                    {item.productName}
                  </Link>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-0.5">
                  Size: <strong className="text-slate-800">{item.size}</strong> • {item.packCount} pcs/pack
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-900">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatPrice(item.unitPrice)} each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {t.checkout.orderSummary}
          </h2>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{t.cart.subtotal}</span>
              <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.cart.deliveryCharge}</span>
              <span className="text-slate-500 font-medium">৳60 (Inside Dhaka)</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-3 border-t border-slate-200">
              <span>{t.cart.total}</span>
              <span className="text-lg text-sky-700">{formatPrice(subtotal + 60)}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              to="/checkout"
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2"
            >
              <span>{t.cart.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার পাঠান' : 'Order via WhatsApp'}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>{language === 'bn' ? 'ঢাকার ভেতরে ১-২ দিন, সারাদেশে ২-৩ দিন' : '1-2 Days Inside Dhaka, 2-3 Days Nationwide'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি — পণ্য পেয়ে মূল্য পরিশোধ' : 'Cash On Delivery — Pay upon receipt'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
