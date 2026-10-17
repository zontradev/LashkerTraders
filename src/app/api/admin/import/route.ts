import { NextResponse } from 'next/server';
import { importRowSchema, type ImportRow } from '@/lib/validations/import';
import { importProductsBatch } from '@/lib/services/store-data';

export async function POST(request: Request) {
  try {
    const { rows } = await request.json();

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data rows provided for import.' },
        { status: 400 }
      );
    }

    // Validate all rows with row-level error accumulation
    const validRows: ImportRow[] = [];
    const validationErrors: Array<{ rowNumber: number; sku?: string; errors: string[] }> = [];

    rows.forEach((rawRow, index) => {
      const parsed = importRowSchema.safeParse(rawRow);
      if (parsed.success) {
        validRows.push(parsed.data);
      } else {
        validationErrors.push({
          rowNumber: index + 1,
          sku: rawRow.variant_sku || rawRow.sku || 'N/A',
          errors: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
        });
      }
    });

    // If all rows have validation errors, abort before committing
    if (validRows.length === 0 && validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed on all rows. Please fix the file format.',
          validationErrors,
        },
        { status: 422 }
      );
    }

    // Process valid records in bounded batches
    const batchResult = await importProductsBatch(validRows);

    return NextResponse.json({
      success: true,
      totalProcessed: rows.length,
      created: batchResult.created,
      updated: batchResult.updated,
      failed: batchResult.failed + validationErrors.length,
      validationErrors,
      executionErrors: batchResult.errors,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal error processing import',
      },
      { status: 500 }
    );
  }
}
