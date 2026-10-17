import React, { useState } from 'react';
import { ShoppingBag, Star, Check } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/services/store-data';
import { Link } from '@/router';
import { useCart } from '@/lib/context/cart-context';
import { useTranslation } from '@/i18n';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { formatPrice, t, language } = useTranslation();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || null
  );
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant || selectedVariant.stockQuantity <= 0) return;

    addItem(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <Link
          to={`/product/${product.slug}`}
          className="relative block aspect-square bg-slate-50 overflow-hidden"
        >
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.isFeatured && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Popular
              </span>
            )}
            {selectedVariant?.regularPrice && selectedVariant.regularPrice > selectedVariant.price && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                Save {formatPrice(selectedVariant.regularPrice - selectedVariant.price)}
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
              {product.brand}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-sky-700">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.averageRating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/product/${product.slug}`}>
            <h3 className="font-bold text-slate-900 text-sm hover:text-sky-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Size Pills */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium mr-1">{t.catalog.selectSize}</span>
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariant?.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariant(v);
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50 text-sky-700 ring-1 ring-sky-600'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
            {selectedVariant && (
              <p className="text-[11px] text-slate-400 mt-1">
                Size {selectedVariant.size} • {selectedVariant.packCount} {t.catalog.pcsPerPack}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Price & Add */}
      <div className="p-4 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900">
              {selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(product.basePrice)}
            </span>
            {selectedVariant?.regularPrice && selectedVariant.regularPrice > selectedVariant.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(selectedVariant.regularPrice)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold">{t.catalog.outOfStock}</span>
            ) : selectedVariant && selectedVariant.stockQuantity <= 15 ? (
              <span className="text-amber-600 font-semibold">{t.catalog.lowStock} ({selectedVariant.stockQuantity})</span>
            ) : (
              <span className="text-emerald-600 font-semibold">{t.catalog.inStock}</span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-sky-50 hover:bg-sky-600 text-sky-700 hover:text-white shadow-xs'
          }`}
          aria-label="Add to cart"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.catalog.addToCart}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
