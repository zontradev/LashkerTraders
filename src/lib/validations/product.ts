import { z } from 'zod';

export const DIAPER_SIZES = ['NB', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  sku: z.string().trim().min(3, { message: 'Variant SKU must be at least 3 characters' }),
  size: z.enum(DIAPER_SIZES, { message: 'Invalid diaper size' }),
  packCount: z
    .number()
    .int()
    .positive({ message: 'Pack count must be positive (e.g. 40 pcs)' }),
  price: z
    .number()
    .min(0, { message: 'Selling price cannot be negative' }),
  regularPrice: z
    .number()
    .min(0, { message: 'Regular price cannot be negative' })
    .optional()
    .nullable(),
  stockQuantity: z
    .number()
    .int()
    .min(0, { message: 'Stock quantity cannot be negative' }),
  isAvailable: z.boolean().default(true),
  barcode: z.string().optional().nullable(),
  weightGrams: z.number().int().min(0).default(0),
  variantImageUrl: z.string().url().optional().nullable().or(z.literal('')),
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(3, { message: 'Product name must be at least 3 characters' })
    .max(255),
  slug: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  brandId: z.string().uuid().optional().nullable().or(z.literal('')),
  categoryId: z.string().uuid().optional().nullable().or(z.literal('')),
  sku: z.string().trim().min(3).optional().nullable().or(z.literal('')),
  shortDescription: z.string().trim().max(300).optional().nullable().or(z.literal('')),
  description: z.string().trim().min(10, { message: 'Description must be at least 10 characters' }),
  basePrice: z.number().min(0, { message: 'Base price cannot be negative' }),
  salePrice: z.number().min(0).optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  seoTitle: z.string().max(70).optional().nullable().or(z.literal('')),
  seoDescription: z.string().max(160).optional().nullable().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  searchKeywords: z.string().optional().nullable().or(z.literal('')),
  weightGrams: z.number().int().min(0).default(0),
  variants: z
    .array(variantSchema)
    .min(1, { message: 'Product must have at least one variant (e.g. Size M, 40 pcs)' }),
});

export type ProductInput = z.infer<typeof productSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
