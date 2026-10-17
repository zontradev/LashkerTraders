import React, { useState } from 'react';
import { ShoppingBag, Star, Heart, Check } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/services/store-data';
import { Link } from '@/router';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useTranslation } from '@/i18n';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice, language } = useTranslation();
  const [selectedVariant] = useState<ProductVariant>(
    product.variants[0] || null
  );
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant || selectedVariant.stockQuantity <= 0) return;

    addItem(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const isOutOfStock = !selectedVariant || selectedVariant.stockQuantity <= 0;

  // Badge styling matching the reference screenshot
  const renderBadge = () => {
    if (product.badge === 'Best Seller') {
      return (
        <span className="bg-[#00b050] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm shadow-2xs">
          Best Seller
        </span>
      );
    }
    if (product.badge === 'Popular') {
      return (
        <span className="bg-[#00b050] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm shadow-2xs">
          Popular
        </span>
      );
    }
    if (product.badge === 'On Sale') {
      return (
        <span className="bg-[#ef4444] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm shadow-2xs">
          On Sale
        </span>
      );
    }
    if (product.badge === 'New') {
      return (
        <span className="bg-[#009688] text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm shadow-2xs">
          New
        </span>
      );
    }
    return <span className="h-4" />;
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 p-3 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative">
      <div>
        {/* Top Badges & Wishlist row */}
        <div className="flex items-center justify-between mb-1 min-h-[22px]">
          <div>{renderBadge()}</div>
          <button
            type="button"
            onClick={handleWishlistClick}
            className="p-1 rounded-full text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isFavorited
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-slate-300 hover:text-rose-400'
              }`}
            />
          </button>
        </div>

        {/* Product Image */}
        <Link
          to={`/product/${product.slug}`}
          className="block aspect-square w-full overflow-hidden bg-slate-50/50 rounded-xl my-1 relative group"
        >
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Title */}
        <Link to={`/product/${product.slug}`} className="block mt-2">
          <h3 className="font-semibold text-slate-900 text-xs sm:text-sm hover:text-[#00b050] transition-colors line-clamp-1" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Ratings & Reviews */}
        <div className="flex items-center gap-1.5 mt-1 text-[11px]">
          <div className="flex items-center text-[#f59e0b]">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <Star className="w-3 h-3 text-slate-300" />
          </div>
          <span className="font-semibold text-slate-700">{product.averageRating.toFixed(1)}</span>
          <span className="text-slate-400">({product.reviewCount})</span>
        </div>
      </div>

      {/* Pricing & Add to Cart button */}
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-slate-900">
              ৳ {selectedVariant ? selectedVariant.price.toLocaleString() : product.basePrice.toLocaleString()}
            </span>
            {selectedVariant?.regularPrice && selectedVariant.regularPrice > selectedVariant.price && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  ৳ {selectedVariant.regularPrice.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded">
                  -{Math.round(((selectedVariant.regularPrice - selectedVariant.price) / selectedVariant.regularPrice) * 100)}%
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white scale-110'
              : 'bg-[#00b050] hover:bg-[#009643] text-white hover:scale-105 active:scale-95'
          }`}
          aria-label="Add to cart"
          title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
