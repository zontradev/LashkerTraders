import { NextResponse } from 'next/server';
import { updateOrderStatusAdmin } from '@/lib/services/store-data';

export async function POST(request: Request) {
  try {
    const { orderId, newStatus, notes } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { success: false, error: 'Order ID and new status are required.' },
        { status: 400 }
      );
    }

    const result = await updateOrderStatusAdmin(orderId, newStatus, notes);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to update order status' },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal error updating order',
      },
      { status: 500 }
    );
  }
}
