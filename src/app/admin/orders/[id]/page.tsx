import React from 'react';
import { notFound } from 'next/navigation';
import { getAllOrdersAdmin } from '@/lib/services/store-data';
import { OrderDetailManager } from '@/components/admin/OrderDetailManager';

export const metadata = {
  title: 'Manage Order — Admin',
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orders = await getAllOrdersAdmin();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  return <OrderDetailManager order={order} />;
}
