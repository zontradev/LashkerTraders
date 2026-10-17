import { z } from 'zod';
import { DIAPER_SIZES } from './product';

export const importRowSchema = z.object({
  product_name: z.string().trim().min(2, { message: 'Product name is required' }),
  product_slug: z.string().trim().optional(),
  brand_name: z.string().trim().default('Twinkle'),
  category_name: z.string().trim().default('Diaper Pants'),
  variant_sku: z.string().trim().min(3, { message: 'Variant SKU is required' }),
  size: z.enum(DIAPER_SIZES, {
    errorMap: () => ({ message: 'Size must be one of: NB, S, M, L, XL, XXL, XXXL' }),
  }),
  pack_count: z.coerce.number().int().positive({ message: 'Pack count must be positive integer' }),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative' }),
  regular_price: z.coerce.number().min(0).optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  description: z.string().trim().optional().default(''),
  image_url: z.string().trim().optional().default(''),
  barcode: z.string().trim().optional().default(''),
});

export type ImportRow = z.infer<typeof importRowSchema>;

export interface ImportPreviewResult {
  totalRows: number;
  validRows: ImportRow[];
  invalidRows: { rowNumber: number; sku?: string; errors: string[]; raw: Record<string, unknown> }[];
}
