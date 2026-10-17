// ==============================================================================
// Lashker Traders — Application Constants & Formatters
// ==============================================================================

export const STORE_CONFIG = {
  name: 'Lashker Traders',
  tagline: 'Your Trusted Diaper Shopping Partner in Bangladesh',
  whatsappNumber: '01797753722',
  whatsappIntl: '+8801797753722',
  whatsappCleanNumber: '8801797753722',
  phone: '01797753722',
  phoneClean: '01797753722',
  email: 'contact@lashkertraders.com',
  address: 'Dhaka, Bangladesh',
  currency: 'BDT',
  currencySymbol: '৳',
};

export const DEFAULT_DELIVERY_ZONES = [
  {
    id: 'zone-dhaka-inside',
    name: 'Inside Dhaka Mainland',
    code: 'dhaka_inside',
    baseFee: 60,
    estimatedDays: '1-2 Days',
    description: 'Dhaka North & South City Corporation areas',
  },
  {
    id: 'zone-dhaka-suburban',
    name: 'Suburban / Outer Dhaka',
    code: 'dhaka_suburban',
    baseFee: 80,
    estimatedDays: '2-3 Days',
    description: 'Gazipur, Savar, Keraniganj, Narayanganj, Tongi',
  },
  {
    id: 'zone-outside-dhaka',
    name: 'Other Districts Across Bangladesh',
    code: 'outside_dhaka',
    baseFee: 120,
    estimatedDays: '3-5 Days',
    description: 'All 63 districts nationwide outside Dhaka',
  },
];

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  processing: { label: 'Packaging', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  returned: { label: 'Returned', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  failed_delivery: { label: 'Failed Delivery', color: 'bg-red-100 text-red-800 border-red-200' },
};

/**
 * Format monetary amount into exact Bangladeshi Taka representation
 * e.g. 1060 -> "৳1,060"
 */
export function formatBDT(amount: number): string {
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  return `৳${rounded.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format UTC date string to Bangladesh Standard Time (Asia/Dhaka)
 */
export function formatDhakaDate(utcDateStr: string): string {
  try {
    const date = new Date(utcDateStr);
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return utcDateStr;
  }
}

/**
 * Generate official Lashker Traders prefilled WhatsApp order message
 */
export function generateWhatsAppOrderMessage(params: {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  additionalNote?: string;
  items: Array<{
    productName: string;
    size: string;
    packCount: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  deliveryFee: number;
  total: number;
  orderNumber?: string;
}): string {
  const lines: string[] = [
    'Hello Lashker Traders, I would like to place an order.',
    '',
    params.orderNumber ? `Order Number: ${params.orderNumber}` : '',
    `Customer name: ${params.customerName}`,
    `Phone: ${params.customerPhone}`,
    `Address: ${params.deliveryAddress}`,
    params.additionalNote ? `Additional note: ${params.additionalNote}` : '',
    '',
    'Items:',
  ];

  params.items.forEach((item) => {
    lines.push(`- ${item.productName} — ${item.size} (${item.packCount} pcs per pack) × ${item.quantity}`);
    lines.push(`  Unit price: ${formatBDT(item.unitPrice)}`);
    lines.push(`  Line subtotal: ${formatBDT(item.subtotal)}`);
  });

  lines.push('');
  lines.push(`Delivery: ${formatBDT(params.deliveryFee)}`);
  lines.push(`Total payable: ${formatBDT(params.total)}`);
  lines.push('');
  lines.push('Please confirm availability and delivery details.');

  return lines.filter(Boolean).join('\n');
}

/**
 * Construct URL-encoded WhatsApp direct click link
 */
export function getWhatsAppOrderUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${STORE_CONFIG.whatsappCleanNumber}?text=${encoded}`;
}
