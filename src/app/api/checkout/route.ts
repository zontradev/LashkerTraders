import { NextResponse } from 'next/server';
import { checkoutFormSchema } from '@/lib/validations/checkout';
import { placeOrder } from '@/lib/services/store-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Centralized Zod Validation
    const validation = checkoutFormSchema.safeParse(body);
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

    // 2. Authoritative Order Placement & Stock Decrement
    const result = await placeOrder(validation.data);

    if (!result.success || !result.order) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to place order due to inventory or database error',
        },
        { status: 422 }
      );
    }

    // 3. Return Confirmed Public Order Details
    return NextResponse.json({
      success: true,
      order: {
        orderNumber: result.order.orderNumber,
        guestTrackingToken: result.order.guestTrackingToken,
        customerName: result.order.customerName,
        customerPhone: result.order.customerPhone,
        deliveryAddress: result.order.deliveryAddress,
        deliveryZoneName: result.order.deliveryZoneName,
        subtotal: result.order.subtotal,
        deliveryCharge: result.order.deliveryCharge,
        total: result.order.total,
        orderStatus: result.order.orderStatus,
        paymentMethod: result.order.paymentMethod,
        items: result.order.items,
        createdAt: result.order.createdAt,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal checkout server error',
      },
      { status: 500 }
    );
  }
}
