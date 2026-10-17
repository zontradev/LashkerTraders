import React from 'react';
import type { ProductVariant } from '@/lib/services/store-data';
import { useTranslation } from '@/i18n';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  selectedVariantId?: string;
  onSelectVariant?: (variant: ProductVariant) => void;
  onVariantChange?: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  selectedVariantId,
  onSelectVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const { formatPrice, t, language } = useTranslation();

  const activeVariant =
    selectedVariant ||
    variants.find((v) => v.id === selectedVariantId) ||
    variants[0];

  const handleSelect = (v: ProductVariant) => {
    if (onVariantChange) onVariantChange(v);
    if (onSelectVariant) onSelectVariant(v);
  };

  if (!activeVariant) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          {language === 'bn' ? 'সাইজ:' : 'Size:'}{' '}
          <span className="text-sky-600 font-extrabold">{activeVariant.size}</span>
        </label>
        <span className="text-xs text-slate-500 font-medium">
          {language === 'bn' ? 'প্যাকে:' : 'Pack:'}{' '}
          <strong className="text-slate-800">{activeVariant.packCount} {t.catalog.pcsPerPack}</strong>
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {variants.map((v) => {
          const isSelected = v.id === activeVariant.id;
          const isOutOfStock = v.stockQuantity <= 0 || !v.isAvailable;

          return (
            <button
              key={v.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => handleSelect(v)}
              className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-sky-600 bg-sky-50/70 text-sky-950 shadow-xs ring-2 ring-sky-600/20'
                  : isOutOfStock
                  ? 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-60'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <span className="text-sm font-extrabold tracking-tight">Size {v.size}</span>
              <span className="text-[11px] text-slate-500 mt-0.5">{v.packCount} pcs</span>
              <span className="text-[11px] font-bold text-slate-900 mt-1">
                {formatPrice(v.price)}
              </span>

              {isOutOfStock && (
                <span className="absolute -top-1.5 -right-1 text-[9px] font-bold bg-slate-200 text-slate-600 px-1 py-0.2 rounded-xs">
                  {t.catalog.outOfStock}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Real-time stock status badge */}
      <div className="flex items-center gap-2 pt-1 text-xs">
        {activeVariant.stockQuantity > 15 ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t.catalog.inStock} ({activeVariant.stockQuantity} {language === 'bn' ? 'প্যাক উপলব্ধ' : 'packs available'})
          </span>
        ) : activeVariant.stockQuantity > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {t.catalog.lowStock}: {activeVariant.stockQuantity} {language === 'bn' ? 'প্যাক অবশিষ্ট' : 'packs left'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {t.catalog.outOfStock}
          </span>
        )}
        <span className="text-slate-300">•</span>
        <span className="text-[11px] text-slate-400 font-mono">SKU: {activeVariant.sku}</span>
      </div>
    </div>
  );
}
