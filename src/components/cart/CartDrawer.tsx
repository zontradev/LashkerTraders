import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { generateWhatsAppOrderMessage, getWhatsAppOrderUrl, STORE_CONFIG } from '@/lib/constants';
import { Link, useRouter } from '@/router';
import { useTranslation } from '@/i18n';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, itemCount, subtotal, isCartOpen, setIsCartOpen } = useCart();
  const { formatPrice, t, language } = useTranslation();
  const router = useRouter();

  if (!isCartOpen) return null;

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
      deliveryFee: 60, // Default inside Dhaka
      total: subtotal + 60,
    });

    window.open(getWhatsAppOrderUrl(message), '_blank');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    router.navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-sky-600" />
              <h2 className="text-base font-bold text-slate-900">
                {t.cart.title} ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold">{t.cart.emptyTitle}</p>
                  <p className="text-xs text-slate-500 mt-1">{t.cart.emptySubtitle}</p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.navigate('/shop');
                  }}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {t.cart.startShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.productSlug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-xs font-semibold text-slate-900 hover:text-sky-600 transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Size: <span className="font-semibold text-slate-700">{item.size}</span> ({item.packCount} pcs)
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1 hover:bg-slate-200 text-slate-600 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {formatPrice(item.unitPrice)} / pack
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Actions */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t.cart.deliveryCharge}</span>
                  <span className="text-slate-500 font-medium">
                    {language === 'bn' ? 'চেকআউটে নির্ধারিত হবে (৬০-১২০ ৳)' : 'Calculated at checkout (৳60-৳120)'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>{t.cart.total}</span>
                  <span className="text-base text-sky-700">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.cart.proceedToCheckout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার পাঠান' : 'Order via WhatsApp'}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                {t.cart.secureCheckoutNotice}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
