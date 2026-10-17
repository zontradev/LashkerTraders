import { NextResponse } from 'next/server';
import { productSchema } from '@/lib/validations/product';
import { saveProductAdmin } from '@/lib/services/store-data';

export async function POST(request: Request) {
  try {
    const { product, id } = await request.json();

    const validation = productSchema.safeParse(product);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await saveProductAdmin(validation.data, id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to save product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product: result.product });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal error saving product',
      },
      { status: 500 }
    );
  }
}
