import { NextResponse } from 'next/server';
import { getOrderByTracking } from '@/lib/services/store-data';

export async function POST(request: Request) {
  try {
    const { orderNumber, token } = await request.json();

    if (!orderNumber || !token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide both your order number and secure guest tracking token.',
        },
        { status: 400 }
      );
    }

    const order = await getOrderByTracking(orderNumber, token);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'No matching order found for the provided order number and tracking token.',
        },
        { status: 404 }
      );
    }

    // Mask sensitive personal details for privacy protection
    const maskedPhone =
      order.customerPhone.length > 5
        ? `${order.customerPhone.slice(0, 3)}****${order.customerPhone.slice(-3)}`
        : order.customerPhone;

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: maskedPhone,
        deliveryZoneName: order.deliveryZoneName,
        deliveryAddress: order.deliveryAddress,
        subtotal: order.subtotal,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          productName: i.productName,
          size: i.size,
          packCount: i.packCount,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.subtotal,
        })),
        statusHistory: order.statusHistory,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Error retrieving order status',
      },
      { status: 500 }
    );
  }
}
