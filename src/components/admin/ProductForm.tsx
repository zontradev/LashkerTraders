'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Product, ProductVariant } from '@/lib/services/store-data';
import { DIAPER_SIZES, type ProductInput, type VariantInput } from '@/lib/validations/product';

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [brand, setBrand] = useState(product?.brand || 'Twinkle');
  const [category, setCategory] = useState(product?.category || 'Diaper Pants');
  const [sku, setSku] = useState(product?.sku || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');
  const [description, setDescription] = useState(product?.description || '');
  const [basePrice, setBasePrice] = useState(product?.basePrice || 530);
  const [salePrice, setSalePrice] = useState<number | undefined>(product?.salePrice || undefined);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isPublished, setIsPublished] = useState(product?.isPublished !== false);
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(product?.seoDescription || '');

  // Variants state (Real database records for Size, Pack count, SKU, Price, Stock)
  const [variants, setVariants] = useState<VariantInput[]>(
    product?.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size as typeof DIAPER_SIZES[number],
      packCount: v.packCount,
      price: v.price,
      regularPrice: v.regularPrice,
      stockQuantity: v.stockQuantity,
      isAvailable: v.isAvailable,
      barcode: v.barcode,
      weightGrams: 900,
    })) || [
      {
        sku: 'TWK-PANT-S42',
        size: 'S',
        packCount: 42,
        price: 510,
        regularPrice: 540,
        stockQuantity: 50,
        isAvailable: true,
        weightGrams: 900,
      },
      {
        sku: 'TWK-PANT-M40',
        size: 'M',
        packCount: 40,
        price: 530,
        regularPrice: 560,
        stockQuantity: 80,
        isAvailable: true,
        weightGrams: 900,
      },
      {
        sku: 'TWK-PANT-L34',
        size: 'L',
        packCount: 34,
        price: 550,
        regularPrice: 580,
        stockQuantity: 60,
        isAvailable: true,
        weightGrams: 900,
      },
    ]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!product) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const addVariantRow = () => {
    const nextSize = DIAPER_SIZES[variants.length % DIAPER_SIZES.length];
    setVariants((prev) => [
      ...prev,
      {
        sku: `${sku || 'DIAPER'}-${nextSize}${30}`,
        size: nextSize,
        packCount: 32,
        price: basePrice,
        regularPrice: basePrice + 30,
        stockQuantity: 30,
        isAvailable: true,
        weightGrams: 900,
      },
    ]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) {
      setError('A diaper product must have at least one variant size.');
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantField = (
    index: number,
    field: keyof VariantInput,
    value: unknown
  ) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload: ProductInput = {
        name: name.trim(),
        slug: slug.trim(),
        sku: sku.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        description: description.trim(),
        basePrice,
        salePrice: salePrice || undefined,
        isFeatured,
        isPublished,
        seoTitle: seoTitle.trim() || undefined,
        seoDescription: seoDescription.trim() || undefined,
        tags: [brand.toLowerCase(), category.toLowerCase(), 'diaper'],
        weightGrams: 900,
        variants,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: payload, id: product?.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to save product');
      } else {
        setSavedSuccess(true);
        setTimeout(() => {
          router.push('/admin/products');
        }, 1000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error submitting product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product List</span>
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <span>Saving Product...</span>
          ) : savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved! Redirecting...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{product ? 'Update Product' : 'Create Product'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* General Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
          General Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Twinkle Baby Diaper Pant"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs outline-hidden focus:bg-white focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              URL Slug <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="twinkle-baby-diaper-pant"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono outline-hidden focus:bg-white focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            >
              <option value="Twinkle">Twinkle</option>
              <option value="Huggies">Huggies</option>
              <option value="Molfix">Molfix</option>
              <option value="NeoCare">NeoCare</option>
              <option value="Pampers">Pampers</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            >
              <option value="Diaper Pants">Diaper Pants</option>
              <option value="Baby Diapers (Belt)">Baby Diapers (Belt)</option>
              <option value="Baby Wipes & Skincare">Baby Wipes & Skincare</option>
              <option value="Adult & Incontinence Care">Adult & Incontinence Care</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Master SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="TWK-PANT-MASTER"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Base Price (৳)</label>
            <input
              type="number"
              required
              min={0}
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold"
            />
          </div>
        </div>

        <div className="space-y-3 text-xs pt-2">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Quick one-line summary for product cards and search snippets"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Product Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Features, absorption specs, leak lock details, skin-friendly materials..."
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded text-sky-600 w-4 h-4"
            />
            <span>Published on Storefront</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-sky-600 w-4 h-4"
            />
            <span>Feature on Home Page</span>
          </label>
        </div>
      </div>

      {/* Real Database Variants Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Product Variants (Sizes & Pack Counts)
            </h2>
            <p className="text-xs text-slate-500">
              Each diaper size is a distinct record with its own SKU, pack count, price, and stock.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariantRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Size Variant</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Pack Count (Pcs)</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Selling Price (৳)</th>
                <th className="py-2.5 px-3">Regular Price (৳)</th>
                <th className="py-2.5 px-3">Stock Qty</th>
                <th className="py-2.5 px-3">Available</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {variants.map((v, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2 px-3">
                    <select
                      value={v.size}
                      onChange={(e) =>
                        updateVariantField(idx, 'size', e.target.value as typeof DIAPER_SIZES[number])
                      }
                      className="p-1.5 rounded border border-slate-200 bg-white font-extrabold text-xs"
                    >
                      {DIAPER_SIZES.map((s) => (
                        <option key={s} value={s}>
                          Size {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      required
                      min={1}
                      value={v.packCount}
                      onChange={(e) => updateVariantField(idx, 'packCount', Number(e.target.value))}
                      className="w-20 p-1.5 rounded border border-slate-200 bg-white text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      required
                      value={v.sku}
                      onChange={(e) => updateVariantField(idx, 'sku', e.target.value.toUpperCase())}
                      className="w-32 p-1.5 rounded border border-slate-200 bg-white font-mono text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      required
                      min={0}
                      value={v.price}
                      onChange={(e) => updateVariantField(idx, 'price', Number(e.target.value))}
                      className="w-24 p-1.5 rounded border border-slate-200 bg-white font-bold text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={0}
                      value={v.regularPrice || ''}
                      onChange={(e) =>
                        updateVariantField(
                          idx,
                          'regularPrice',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-24 p-1.5 rounded border border-slate-200 bg-white text-xs"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      required
                      min={0}
                      value={v.stockQuantity}
                      onChange={(e) =>
                        updateVariantField(idx, 'stockQuantity', Number(e.target.value))
                      }
                      className="w-20 p-1.5 rounded border border-slate-200 bg-white text-xs font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={v.isAvailable}
                      onChange={(e) => updateVariantField(idx, 'isAvailable', e.target.checked)}
                      className="rounded text-sky-600 w-4 h-4"
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeVariantRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      aria-label="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
}
