// ==============================================================================
// Lashker Traders — Authoritative Data & Business Logic Layer
// Production-ready data repository with database operations and in-memory dev mode
// ==============================================================================

import { DEFAULT_DELIVERY_ZONES, STORE_CONFIG } from '@/lib/constants';
import type { CheckoutFormInput } from '@/lib/validations/checkout';
import type { ProductInput, VariantInput } from '@/lib/validations/product';
import type { ImportRow } from '@/lib/validations/import';

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  packCount: number;
  price: number;
  regularPrice?: number | null;
  wholesalePrice?: number | null;
  wholesaleMoq?: number;
  stockQuantity: number;
  isAvailable: boolean;
  barcode?: string | null;
  variantImageUrl?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  sku: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  badge?: 'Best Seller' | 'Popular' | 'On Sale' | 'New' | null;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  searchKeywords?: string;
  weightGrams: number;
  mainImage: string;
  galleryImages: string[];
  variants: ProductVariant[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  size: string;
  packCount: number;
  sku: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  subtotal: number;
  pricingMode?: 'retail' | 'wholesale';
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  idempotencyKey?: string | null;
  userId?: string | null;
  guestTrackingToken: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  additionalNote?: string | null;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  fulfillmentStatus: string;
  isWhatsappOrder: boolean;
  staffInternalNotes?: string | null;
  courierPartner?: string | null;
  courierConsignmentId?: string | null;
  courierTrackingUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemSnapshot[];
  statusHistory: Array<{
    oldStatus: string | null;
    newStatus: string;
    changedAt: string;
    notes?: string | null;
  }>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  count: number;
  logo: string;
}

export interface ReviewRecord {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CustomerAddress {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  address: string;
  zoneId: string;
  isDefault: boolean;
}

export interface CustomerProfile {
  id: string;
  publicId: string; // CUS-XXXXXX
  displayName: string;
  phone: string;
  email?: string;
  preferredLanguage: 'en' | 'bn';
  addresses: CustomerAddress[];
  wishlist: string[];
  createdAt: string;
}

export type B2BApplicationStatus =
  | 'pending'
  | 'granted'
  | 'rejected'
  | 'cancelled'
  | 'restricted'
  | 'removed';

export interface B2BApplicationRecord {
  id: string;
  customerId: string;
  businessName: string;
  contactName: string;
  verifiedEmail: string;
  phone: string;
  district: string;
  tradeLicenseNo?: string;
  status: B2BApplicationStatus;
  accessCode?: string;
  accessCodeLabel?: string;
  decisionReason?: string;
  decisionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface B2BMembershipRecord {
  id: string;
  customerId: string;
  businessName: string;
  contactName: string;
  verifiedEmail: string;
  phone: string;
  priceGroupId: string;
  priceGroupName: string;
  status: 'granted' | 'restricted' | 'removed';
  grantSource: string;
  discountRate: number;
  moqPacks: number;
  creditLimit: number;
  createdAt: string;
}

export interface B2BClientProfile {
  id: string;
  publicId: string; // B2B-XXXXXX
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessAddress: string;
  district: string;
  status: B2BApplicationStatus;
  pricingTier: string;
  tierDiscountRate: number;
  moqPacks: number;
  creditApproved: boolean;
  createdAt: string;
  decisionReason?: string;
}

export interface B2BAccessCodeRecord {
  code: string;
  label: string;
  policy: 'A' | 'B' | 'C';
  targetPriceGroupId: string;
  targetPriceGroupName: string;
  isActive: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
}

export interface CouponRule {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderSubtotal: number;
  maxDiscountAmount?: number;
  brandRestriction?: string;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  description: string;
}

// ------------------------------------------------------------------------------
// Cryptographically Secure Public & Order Identifier Generators
// ------------------------------------------------------------------------------
export function generatePublicCustomerId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 6; i++) {
      rand += chars[bytes[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return `CUS-${rand}`;
}

export function generatePublicB2BId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 6; i++) {
      rand += chars[bytes[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return `B2B-${rand}`;
}

export function generateSecureTrackingToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  );
}

// ------------------------------------------------------------------------------
// In-Memory Dev State (Persists across hot-reloads within server process)
// ------------------------------------------------------------------------------
let orderSequenceCounter = 1;

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    name: 'Twinkle Baby Diaper (M)',
    slug: 'twinkle-baby-diaper-m',
    brand: 'Twinkle',
    brandSlug: 'twinkle',
    category: 'Diapers',
    categorySlug: 'diapers',
    sku: 'TWK-M-40',
    shortDescription: 'Super absorbent breathable diaper pants with 12-hour leak lock protection.',
    description:
      'Twinkle Baby Diapers feature advanced Japanese SAP technology providing instant absorption and keeping your baby dry for up to 12 hours. Equipped with a 360-degree super soft elastic waistband, wetness indicator line, and breathable micro-pores to prevent diaper rash in Bangladesh weather.',
    basePrice: 1250,
    salePrice: null,
    badge: 'Best Seller',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Twinkle Baby Diaper (M) — Lashker Traders Bangladesh',
    seoDescription: 'Buy original Twinkle Baby Diaper Pants online in Bangladesh. Fast home delivery in Dhaka & all districts.',
    tags: ['diaper', 'twinkle', 'pant', 'baby', 'leak-proof'],
    searchKeywords: 'twinkle baby diaper m size medium',
    weightGrams: 900,
    mainImage: '/images/twinkle_diaper_m.jpg',
    galleryImages: ['/images/twinkle_diaper_m.jpg'],
    averageRating: 4.8,
    reviewCount: 128,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000001',
        productId: 'p1000000-0000-0000-0000-000000000001',
        sku: 'TWK-S42',
        size: 'S',
        packCount: 42,
        price: 1190,
        regularPrice: 1290,
        stockQuantity: 85,
        isAvailable: true,
      },
      {
        id: 'v1000000-0000-0000-0000-000000000002',
        productId: 'p1000000-0000-0000-0000-000000000001',
        sku: 'TWK-M40',
        size: 'M',
        packCount: 40,
        price: 1250,
        regularPrice: 1350,
        stockQuantity: 120,
        isAvailable: true,
      },
      {
        id: 'v1000000-0000-0000-0000-000000000003',
        productId: 'p1000000-0000-0000-0000-000000000001',
        sku: 'TWK-L34',
        size: 'L',
        packCount: 34,
        price: 1300,
        regularPrice: 1400,
        stockQuantity: 95,
        isAvailable: true,
      },
      {
        id: 'v1000000-0000-0000-0000-000000000004',
        productId: 'p1000000-0000-0000-0000-000000000001',
        sku: 'TWK-XL32',
        size: 'XL',
        packCount: 32,
        price: 1350,
        regularPrice: 1450,
        stockQuantity: 70,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000005',
    name: 'MamyPoko Extra Dry (L)',
    slug: 'mamypoko-extra-dry-l',
    brand: 'MamyPoko',
    brandSlug: 'mamypoko',
    category: 'Diapers',
    categorySlug: 'diapers',
    sku: 'MPK-EXTRA-L',
    shortDescription: 'Japanese Speed Air Wave technology for ultra-fast absorption and maximum airflow.',
    description:
      'MamyPoko Extra Dry pants feature the patented Speed Air Wave crisscross sheet that absorbs moisture instantaneously while letting fresh air circulate freely, keeping sensitive baby skin dry and healthy all day and night.',
    basePrice: 1480,
    salePrice: null,
    badge: 'Popular',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'MamyPoko Extra Dry (L) — Lashker Traders',
    seoDescription: 'Authentic MamyPoko Extra Dry baby diaper pants in Bangladesh.',
    tags: ['mamypoko', 'extra dry', 'pant', 'japan technology'],
    searchKeywords: 'mamypoko extra dry l diaper baby large',
    weightGrams: 950,
    mainImage: '/images/mamypoko_extra_dry_l.jpg',
    galleryImages: ['/images/mamypoko_extra_dry_l.jpg'],
    averageRating: 4.7,
    reviewCount: 96,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000021',
        productId: 'p1000000-0000-0000-0000-000000000005',
        sku: 'MPK-M44',
        size: 'M',
        packCount: 44,
        price: 1420,
        regularPrice: 1520,
        stockQuantity: 75,
        isAvailable: true,
      },
      {
        id: 'v1000000-0000-0000-0000-000000000022',
        productId: 'p1000000-0000-0000-0000-000000000005',
        sku: 'MPK-L38',
        size: 'L',
        packCount: 38,
        price: 1480,
        regularPrice: 1580,
        stockQuantity: 110,
        isAvailable: true,
      },
      {
        id: 'v1000000-0000-0000-0000-000000000023',
        productId: 'p1000000-0000-0000-0000-000000000005',
        sku: 'MPK-XL32',
        size: 'XL',
        packCount: 32,
        price: 1540,
        regularPrice: 1640,
        stockQuantity: 65,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    name: 'Huggies Dry Comfort (S)',
    slug: 'huggies-dry-comfort-s',
    brand: 'Huggies',
    brandSlug: 'huggies',
    category: 'Diapers',
    categorySlug: 'diapers',
    sku: 'HUG-DRY-S',
    shortDescription: 'Cushiony soft bubble bed diaper pants engineered for overnight dryness with -17% discount.',
    description:
      'Huggies Dry Comfort diapers are designed with an innovative Bubble-Bed waist and pad that feels as soft as cotton. Its quick-lock system traps wetness inside immediately to prevent leaks during night sleep.',
    basePrice: 1120,
    salePrice: 1120,
    badge: 'On Sale',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Huggies Dry Comfort (S) — Lashker Traders',
    seoDescription: 'Premium Huggies Dry Comfort diaper pants with bubble bed comfort. Fast delivery across Bangladesh.',
    tags: ['huggies', 'dry comfort', 'sale', 'bubble bed'],
    searchKeywords: 'huggies dry comfort s diaper small baby',
    weightGrams: 900,
    mainImage: '/images/huggies_dry_comfort_s.jpg',
    galleryImages: ['/images/huggies_dry_comfort_s.jpg'],
    averageRating: 4.6,
    reviewCount: 73,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000007',
        productId: 'p1000000-0000-0000-0000-000000000002',
        sku: 'HUG-DC-S46',
        size: 'S',
        packCount: 46,
        price: 1120,
        regularPrice: 1350,
        stockQuantity: 60,
        isAvailable: true,
      },
      {
        id: 'v1000000-0000-0000-0000-000000000008',
        productId: 'p1000000-0000-0000-0000-000000000002',
        sku: 'HUG-DC-M42',
        size: 'M',
        packCount: 42,
        price: 1180,
        regularPrice: 1400,
        stockQuantity: 80,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000006',
    name: "Johnson's Baby Lotion",
    slug: 'johnsons-baby-lotion',
    brand: "Johnson's",
    brandSlug: 'johnsons',
    category: 'Bath & Skincare',
    categorySlug: 'bath-skincare',
    sku: 'JHN-LOTION-200',
    shortDescription: '24-hour nourishment with coconut oil and gentle pediatrician-tested moisturizing formula.',
    description:
      "Johnson's Baby Lotion with coconut oil provides 24 hours of gentle nourishment and hydration for delicate baby skin. Hypoallergenic, pH-balanced, and 100% free from dyes, parabens, and phthalates.",
    basePrice: 680,
    salePrice: null,
    badge: null,
    isFeatured: true,
    isPublished: true,
    seoTitle: "Johnson's Baby Lotion — Lashker Traders",
    seoDescription: "Authentic Johnson's Baby Lotion online in Bangladesh.",
    tags: ['johnsons', 'baby lotion', 'skincare', 'hypoallergenic'],
    searchKeywords: 'johnsons baby lotion moisturizer baby care',
    weightGrams: 300,
    mainImage: '/images/johnsons_baby_lotion.jpg',
    galleryImages: ['/images/johnsons_baby_lotion.jpg'],
    averageRating: 4.8,
    reviewCount: 156,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000031',
        productId: 'p1000000-0000-0000-0000-000000000006',
        sku: 'JHN-LOT-200ML',
        size: '200ml',
        packCount: 1,
        price: 680,
        regularPrice: 750,
        stockQuantity: 90,
        isAvailable: true,
      },
      {
        id: 'v1000000-0000-0000-0000-000000000032',
        productId: 'p1000000-0000-0000-0000-000000000006',
        sku: 'JHN-LOT-500ML',
        size: '500ml',
        packCount: 1,
        price: 1250,
        regularPrice: 1350,
        stockQuantity: 50,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000007',
    name: 'Pampers Pants (XL)',
    slug: 'pampers-pants-xl',
    brand: 'Pampers',
    brandSlug: 'pampers',
    category: 'Diapers',
    categorySlug: 'diapers',
    sku: 'PMP-PANTS-XL',
    shortDescription: 'All-round 360-degree stretchy waistband with magic gel locks wetness for up to 12 hours.',
    description:
      'Pampers All-Round Protection Pants provide up to 12 hours of absorption using micro-pore air channels and magic gel crystals to lock away wetness and protect against friction rashes.',
    basePrice: 1650,
    salePrice: null,
    badge: 'New',
    isFeatured: true,
    isPublished: true,
    seoTitle: 'Pampers Pants (XL) — Lashker Traders',
    seoDescription: 'Buy original Pampers All-Round Protection Pants online in Bangladesh.',
    tags: ['pampers', 'pants', 'magic gel', 'extra large'],
    searchKeywords: 'pampers pants xl diaper extra large',
    weightGrams: 950,
    mainImage: '/images/pampers_pants_xl.jpg',
    galleryImages: ['/images/pampers_pants_xl.jpg'],
    averageRating: 4.7,
    reviewCount: 102,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000041',
        productId: 'p1000000-0000-0000-0000-000000000007',
        sku: 'PMP-XL32',
        size: 'XL',
        packCount: 32,
        price: 1650,
        regularPrice: 1750,
        stockQuantity: 80,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000008',
    name: 'MamyPoko Baby Wipes',
    slug: 'mamypoko-baby-wipes',
    brand: 'MamyPoko',
    brandSlug: 'mamypoko',
    category: 'Wipes & Tissue',
    categorySlug: 'wipes-tissue',
    sku: 'MPK-WIPES-80',
    shortDescription: '99% pure purified water wipes with gentle aloe vera extract for hands, mouth and diaper area.',
    description:
      'MamyPoko Baby Wipes are alcohol-free, fragrance-free, and dermatologically tested for newborns. Made with thick honeycomb embossed non-woven fabric that cleans thoroughly with just one wipe.',
    basePrice: 320,
    salePrice: null,
    badge: null,
    isFeatured: true,
    isPublished: true,
    seoTitle: 'MamyPoko Baby Wipes — Lashker Traders',
    seoDescription: 'Order gentle MamyPoko Baby Wipes online in Bangladesh.',
    tags: ['mamypoko', 'wipes', 'pure water', 'aloe vera'],
    searchKeywords: 'mamypoko baby wipes wet wipe pure water',
    weightGrams: 400,
    mainImage: '/images/mamypoko_baby_wipes.jpg',
    galleryImages: ['/images/mamypoko_baby_wipes.jpg'],
    averageRating: 4.6,
    reviewCount: 64,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000051',
        productId: 'p1000000-0000-0000-0000-000000000008',
        sku: 'MPK-WIPE-80PCS',
        size: '80 pcs',
        packCount: 80,
        price: 320,
        regularPrice: 360,
        stockQuantity: 150,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    name: 'Molfix Air Dry Diaper (Tape)',
    slug: 'molfix-air-dry-diaper-tape',
    brand: 'Molfix',
    brandSlug: 'molfix',
    category: 'Diapers',
    categorySlug: 'diapers',
    sku: 'MOL-TAPE-MASTER',
    shortDescription: 'Turkish engineered hypoallergenic tape diaper with aloe vera and chamomile extract.',
    description:
      'Molfix diapers are crafted with Air Dry Technology and enriched with organic bamboo and natural cotton extracts. Features umbilical cord notch in newborn sizes and double leak barrier guards.',
    basePrice: 720,
    salePrice: 680,
    isFeatured: false,
    isPublished: true,
    seoTitle: 'Molfix Air Dry Tape Diapers — Lashker Traders',
    seoDescription: 'Buy authentic Molfix Air Dry Diapers with aloe vera comfort.',
    tags: ['molfix', 'air dry', 'tape', 'hypoallergenic'],
    searchKeywords: 'molfix diaper tape newborn baby',
    weightGrams: 850,
    mainImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'],
    averageRating: 4.8,
    reviewCount: 3,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000011',
        productId: 'p1000000-0000-0000-0000-000000000003',
        sku: 'MOL-TAPE-NB44',
        size: 'NB',
        packCount: 44,
        price: 660,
        regularPrice: 700,
        stockQuantity: 40,
        isAvailable: true,
      },
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    name: 'NeoCare Baby Diaper Belt System',
    slug: 'neocare-baby-diaper-belt-system',
    brand: 'NeoCare',
    brandSlug: 'neocare',
    category: 'Diapers',
    categorySlug: 'diapers',
    sku: 'NEO-BELT-MASTER',
    shortDescription: 'Reliable dryness with magic side tapes and ADL distribution layer from ACI.',
    description:
      'Manufactured by ACI Bangladesh, NeoCare provides superior absorption with its Acquisition Distribution Layer (ADL) that quickly disperses liquid evenly across the core, preventing sagging and discomfort.',
    basePrice: 480,
    salePrice: 450,
    isFeatured: false,
    isPublished: true,
    seoTitle: 'NeoCare Baby Diapers — Lashker Traders',
    seoDescription: 'Affordable and reliable NeoCare diapers for babies across Bangladesh.',
    tags: ['neocare', 'belt', 'aci', 'affordable'],
    searchKeywords: 'neocare baby diaper bangladesh',
    weightGrams: 800,
    mainImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'],
    averageRating: 4.7,
    reviewCount: 2,
    createdAt: new Date().toISOString(),
    variants: [
      {
        id: 'v1000000-0000-0000-0000-000000000015',
        productId: 'p1000000-0000-0000-0000-000000000004',
        sku: 'NEO-BELT-S40',
        size: 'S',
        packCount: 40,
        price: 450,
        regularPrice: 480,
        stockQuantity: 90,
        isAvailable: true,
      },
    ],
  },
];

const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Diapers',
    slug: 'diapers',
    description: 'Diaper pants, tape belts, pull-ups for newborns and toddlers',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    productCount: 5,
  },
  {
    id: 'cat-2',
    name: 'Baby Care',
    slug: 'baby-care',
    description: 'Gentle oils, powders, creams, and infant grooming essentials',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    productCount: 3,
  },
  {
    id: 'cat-3',
    name: 'Feeding',
    slug: 'feeding',
    description: 'BPA-free feeding bottles, pacifiers, sippy cups and sterilizers',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    productCount: 2,
  },
  {
    id: 'cat-4',
    name: 'Wipes & Tissue',
    slug: 'wipes-tissue',
    description: '99% pure water wipes, soft facial tissues and sanitizing wipes',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    productCount: 1,
  },
  {
    id: 'cat-5',
    name: 'Bath & Skincare',
    slug: 'bath-skincare',
    description: 'Tear-free shampoos, body wash, and gentle moisturizing lotions',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    productCount: 1,
  },
  {
    id: 'cat-6',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Diaper caddies, waterproof bed protectors, bibs and teethers',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    productCount: 2,
  },
  {
    id: 'cat-7',
    name: 'Brands',
    slug: 'brands',
    description: 'Certified 100% genuine baby diaper and childcare brands',
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
    productCount: 7,
  },
];

const INITIAL_BRANDS = [
  { id: 'b-1', name: 'Twinkle', slug: 'twinkle', count: 1, logo: 'TW' },
  { id: 'b-2', name: 'MamyPoko', slug: 'mamypoko', count: 2, logo: 'MP' },
  { id: 'b-3', name: 'Huggies', slug: 'huggies', count: 1, logo: 'HG' },
  { id: 'b-4', name: "Johnson's", slug: 'johnsons', count: 1, logo: 'JH' },
  { id: 'b-5', name: 'Pampers', slug: 'pampers', count: 1, logo: 'PM' },
  { id: 'b-6', name: 'Molfix', slug: 'molfix', count: 1, logo: 'MF' },
  { id: 'b-7', name: 'NeoCare', slug: 'neocare', count: 1, logo: 'NC' },
];

const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-1',
    productId: 'p1000000-0000-0000-0000-000000000001',
    customerName: 'Nusrat Jahan',
    rating: 5,
    reviewText: 'Very comfortable for my 9-month-old. No rash even after overnight sleep. Best value for money in Bangladesh!',
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rev-2',
    productId: 'p1000000-0000-0000-0000-000000000001',
    customerName: 'Tanvir Ahmed',
    rating: 5,
    reviewText: 'Original Twinkle diaper delivered within 24 hours inside Mirpur. Highly recommend Lashker Traders.',
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'rev-3',
    productId: 'p1000000-0000-0000-0000-000000000002',
    customerName: 'Sharmin Akter',
    rating: 5,
    reviewText: 'Bubble bed softness is really gentle on baby skin. Absorbs fast and fit is snug.',
    isVerifiedPurchase: true,
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export const INITIAL_COUPONS: CouponRule[] = [
  {
    code: 'WELCOME50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderSubtotal: 500,
    usedCount: 0,
    description: '৳50 instant discount on orders of ৳500 or more',
  },
  {
    code: 'TWINKLE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderSubtotal: 500,
    maxDiscountAmount: 200,
    brandRestriction: 'twinkle',
    usedCount: 0,
    description: '10% discount on all Twinkle brand diapers (up to ৳200)',
  },
  {
    code: 'LASHKER100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderSubtotal: 1000,
    usedCount: 0,
    description: '৳100 discount on orders ৳1,000 and above',
  },
];

const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cus-001',
    publicId: 'CUS-FARUK1',
    displayName: 'Mohammad Faruk',
    phone: '01711223344',
    email: 'faruk.dhaka@gmail.com',
    preferredLanguage: 'bn',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home (বাসা)',
        recipientName: 'Mohammad Faruk',
        phone: '01711223344',
        address: 'House 14, Road 5, Block B, Dhanmondi, Dhaka',
        zoneId: 'zone-dhaka-inside',
        isDefault: true,
      },
    ],
    wishlist: ['p1000000-0000-0000-0000-000000000001'],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

const INITIAL_B2B_CLIENTS: B2BClientProfile[] = [
  {
    id: 'b2b-001',
    publicId: 'B2B-LASHKER88',
    businessName: 'Al-Madina Pharmacy & Baby Care',
    contactPerson: 'Kazi Nurul Islam',
    phone: '01797753722',
    email: 'madina.pharmacy@gmail.com',
    businessAddress: 'Plot 4, Mirpur 10 Circle, Dhaka-1216',
    district: 'Dhaka',
    status: 'granted',
    pricingTier: 'Standard Wholesale (14% Margin)',
    tierDiscountRate: 0.14,
    moqPacks: 20,
    creditApproved: true,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
];

const INITIAL_B2B_ACCESS_CODES: B2BAccessCodeRecord[] = [
  {
    code: 'Lashkerb2b001',
    label: 'VIP Pharmacy Fast-Track Auto Approval',
    policy: 'A',
    targetPriceGroupId: 'pg-1',
    targetPriceGroupName: 'Standard Wholesale',
    isActive: true,
    maxUses: 100,
    usedCount: 0,
    expiresAt: '2027-12-31T23:59:59Z',
  },
  {
    code: 'Lashkerlimitb2b002',
    label: 'Limited Wholesale Starter Tier',
    policy: 'C',
    targetPriceGroupId: 'pg-2',
    targetPriceGroupName: 'Limited Wholesale',
    isActive: true,
    maxUses: 50,
    usedCount: 0,
    expiresAt: '2027-12-31T23:59:59Z',
  },
  {
    code: 'Lashkervip003',
    label: 'VIP Distributor Application Required',
    policy: 'B',
    targetPriceGroupId: 'pg-1',
    targetPriceGroupName: 'Standard Wholesale',
    isActive: true,
    maxUses: 50,
    usedCount: 0,
    expiresAt: '2027-12-31T23:59:59Z',
  },
];

const INITIAL_B2B_MEMBERSHIPS: B2BMembershipRecord[] = [
  {
    id: 'mem-001',
    customerId: 'cus-b2b-demo',
    businessName: 'Al-Madina Pharmacy & Baby Care',
    contactName: 'Kazi Nurul Islam',
    verifiedEmail: 'madina.pharmacy@gmail.com',
    phone: '01797753722',
    priceGroupId: 'pg-1',
    priceGroupName: 'Standard Wholesale',
    status: 'granted',
    grantSource: 'Staff Approved',
    discountRate: 0.14,
    moqPacks: 20,
    creditLimit: 50000,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
];

const INITIAL_B2B_APPLICATIONS: B2BApplicationRecord[] = [];

// Persistent state containers
const state = {
  products: ([...INITIAL_PRODUCTS].map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({
      ...v,
      wholesalePrice: v.wholesalePrice ?? Math.round(v.price * 0.85),
      wholesaleMoq: v.wholesaleMoq ?? 20,
    })),
  })) as Product[]),
  orders: [] as OrderRecord[],
  reviews: [...INITIAL_REVIEWS],
  deliveryZones: [...DEFAULT_DELIVERY_ZONES],
  categories: [...INITIAL_CATEGORIES],
  brands: [...INITIAL_BRANDS],
  coupons: [...INITIAL_COUPONS],
  customers: [...INITIAL_CUSTOMERS],
  b2bClients: [...INITIAL_B2B_CLIENTS],
  b2bAccessCodes: [...INITIAL_B2B_ACCESS_CODES],
  b2bMemberships: [...INITIAL_B2B_MEMBERSHIPS],
  b2bApplications: [...INITIAL_B2B_APPLICATIONS],
  activeAccountMode: 'retail' as 'retail' | 'b2b',
  inventoryMovements: [] as Array<{
    id: string;
    variantId: string;
    orderId?: string;
    changeQuantity: number;
    reason: string;
    previousStock: number;
    newStock: number;
    timestamp: string;
  }>,
};

// Seed an initial demo order so admin dashboard and tracking are testable immediately
(function seedInitialOrder() {
  const sampleVariant = state.products[0].variants[1]; // Twinkle M40
  const orderNumber = 'LT-00001';
  orderSequenceCounter = 2;

  state.orders.push({
    id: 'ord-demo-001',
    orderNumber,
    guestTrackingToken: 'demo-token-1234567890abcdef',
    customerName: 'Mohammad Faruk',
    customerPhone: '01711223344',
    deliveryAddress: 'House 14, Road 5, Block B, Dhanmondi, Dhaka',
    deliveryZoneId: 'zone-dhaka-inside',
    deliveryZoneName: 'Inside Dhaka Mainland',
    additionalNote: 'Please ring bell twice upon arrival',
    subtotal: sampleVariant.price * 2,
    discount: 0,
    deliveryCharge: 60,
    total: sampleVariant.price * 2 + 60,
    orderStatus: 'confirmed',
    paymentStatus: 'unpaid',
    paymentMethod: 'cash_on_delivery',
    fulfillmentStatus: 'processing',
    isWhatsappOrder: false,
    staffInternalNotes: 'Customer requested evening delivery',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: 'item-demo-001',
        productId: state.products[0].id,
        variantId: sampleVariant.id,
        productName: state.products[0].name,
        size: sampleVariant.size,
        packCount: sampleVariant.packCount,
        sku: sampleVariant.sku,
        unitPrice: sampleVariant.price,
        quantity: 2,
        discount: 0,
        subtotal: sampleVariant.price * 2,
      },
    ],
    statusHistory: [
      {
        oldStatus: null,
        newStatus: 'pending',
        changedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        notes: 'Order placed by customer',
      },
      {
        oldStatus: 'pending',
        newStatus: 'confirmed',
        changedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        notes: 'Confirmed by phone call',
      },
    ],
  });
})();

// ------------------------------------------------------------------------------
// Service Functions
// ------------------------------------------------------------------------------

export async function getProducts(options?: {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  size?: string;
  featuredOnly?: boolean;
  publishedOnly?: boolean;
}) {
  let list = [...state.products];

  if (options?.publishedOnly !== false) {
    list = list.filter((p) => p.isPublished);
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.isFeatured);
  }

  if (options?.categorySlug) {
    list = list.filter((p) => p.categorySlug === options.categorySlug);
  }

  if (options?.brandSlug) {
    list = list.filter((p) => p.brandSlug === options.brandSlug);
  }

  if (options?.size) {
    list = list.filter((p) => p.variants.some((v) => v.size === options.size));
  }

  if (options?.search) {
    const term = options.search.toLowerCase().trim();
    list = list
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.searchKeywords && p.searchKeywords.toLowerCase().includes(term)) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(term) || v.size.toLowerCase() === term)
      )
      .sort((a, b) => {
        // Priority 1: Exact SKU match
        const aExactSku = a.variants.some((v) => v.sku.toLowerCase() === term);
        const bExactSku = b.variants.some((v) => v.sku.toLowerCase() === term);
        if (aExactSku && !bExactSku) return -1;
        if (!aExactSku && bExactSku) return 1;

        // Priority 2: Exact Name match
        const aExactName = a.name.toLowerCase() === term;
        const bExactName = b.name.toLowerCase() === term;
        if (aExactName && !bExactName) return -1;
        if (!aExactName && bExactName) return 1;

        // Priority 3: Name starts with query
        const aStartsName = a.name.toLowerCase().startsWith(term);
        const bStartsName = b.name.toLowerCase().startsWith(term);
        if (aStartsName && !bStartsName) return -1;
        if (!aStartsName && bStartsName) return 1;

        return 0;
      });
  }

  return list;
}

export async function getSearchSuggestions(query: string) {
  if (!query || query.trim().length < 1) return { products: [], categories: [], brands: [] };
  const term = query.toLowerCase().trim();

  const products = state.products
    .filter(
      (p) =>
        p.isPublished &&
        (p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.variants.some((v) => v.sku.toLowerCase().includes(term)))
    )
    .sort((a, b) => {
      const aExact = a.variants.some((v) => v.sku.toLowerCase() === term) || a.name.toLowerCase().startsWith(term);
      const bExact = b.variants.some((v) => v.sku.toLowerCase() === term) || b.name.toLowerCase().startsWith(term);
      return aExact === bExact ? 0 : aExact ? -1 : 1;
    })
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      category: p.category,
      price: p.basePrice,
      mainImage: p.mainImage,
      matchedSku: p.variants.find((v) => v.sku.toLowerCase().includes(term))?.sku,
    }));

  const categories = state.categories
    .filter((c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term))
    .slice(0, 3);

  const brands = state.brands
    .filter((b) => b.name.toLowerCase().includes(term) || b.slug.toLowerCase().includes(term))
    .slice(0, 3);

  return { products, categories, brands };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = state.products.find((p) => p.slug === slug);
  return product || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = state.products.find((p) => p.id === id);
  return product || null;
}

export async function getCategories() {
  return [...state.categories];
}

export async function getBrands() {
  return [...state.brands];
}

export async function getDeliveryZones() {
  return [...state.deliveryZones];
}

// ------------------------------------------------------------------------------
// Promotion & Discount Engine (Server-Side Recalculation & Stacking Rules)
// ------------------------------------------------------------------------------
export function getCoupons(): CouponRule[] {
  return [...state.coupons];
}

export function validateCoupon(
  code: string,
  subtotal: number,
  items: Array<{
    productId?: string;
    variantId?: string;
    quantity?: number;
    unitPrice?: number;
  }> = []
): { valid: boolean; discountAmount: number; error?: string; coupon?: CouponRule } {
  const cleanCode = code.trim().toUpperCase();
  const coupon = state.coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, discountAmount: 0, error: 'Invalid or unrecognized coupon code' };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, discountAmount: 0, error: 'Coupon usage limit has been reached' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, discountAmount: 0, error: 'This promo coupon has expired' };
  }

  if (subtotal < coupon.minOrderSubtotal) {
    return {
      valid: false,
      discountAmount: 0,
      error: `Minimum order subtotal for this coupon is ৳${coupon.minOrderSubtotal}. Your current subtotal is ৳${subtotal}.`,
    };
  }

  let discount = 0;
  if (coupon.brandRestriction) {
    // Brand-specific discount
    const eligibleAmount = items.reduce((sum, itm) => {
      const prod = state.products.find(
        (p) => p.id === itm.productId || p.variants.some((v) => v.id === itm.variantId)
      );
      if (prod && prod.brandSlug === coupon.brandRestriction) {
        return sum + (itm.unitPrice || prod.basePrice) * (itm.quantity || 1);
      }
      return sum;
    }, 0);

    if (eligibleAmount <= 0) {
      return {
        valid: false,
        discountAmount: 0,
        error: `Coupon ${coupon.code} only applies to ${coupon.brandRestriction.toUpperCase()} diaper products.`,
      };
    }

    if (coupon.discountType === 'percentage') {
      discount = Math.round((eligibleAmount * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, eligibleAmount);
    }
  } else {
    // Storewide discount
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }
  }

  if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
    discount = coupon.maxDiscountAmount;
  }

  // Never allow discount to exceed subtotal (no negative balances)
  discount = Math.min(discount, subtotal);

  return { valid: true, discountAmount: discount, coupon };
}

// ------------------------------------------------------------------------------
// Customer & B2B Profile Management
// ------------------------------------------------------------------------------
export function getOrCreateCustomerProfile(phone: string, displayName?: string): CustomerProfile {
  const cleanPhone = phone.trim();
  let existing = state.customers.find(
    (c) => c.phone === cleanPhone || c.phone.endsWith(cleanPhone) || cleanPhone.endsWith(c.phone)
  );

  if (!existing) {
    existing = {
      id: `cus-${Date.now()}`,
      publicId: generatePublicCustomerId(),
      displayName: displayName || (cleanPhone ? `Customer ${cleanPhone.slice(-4)}` : 'Valued Customer'),
      phone: cleanPhone,
      preferredLanguage: 'en',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    state.customers.push(existing);
  }
  return existing;
}

export function getB2BStatusForCustomer(phoneOrEmail: string): {
  membership: B2BMembershipRecord | null;
  application: B2BApplicationRecord | null;
  isB2BGranted: boolean;
  status: B2BApplicationStatus | 'none';
} {
  const clean = (phoneOrEmail || '').trim().toLowerCase();
  if (!clean) {
    return { membership: null, application: null, isB2BGranted: false, status: 'none' };
  }

  // 1. Check active granted membership first
  const membership = state.b2bMemberships.find(
    (m) =>
      m.phone.toLowerCase() === clean ||
      m.verifiedEmail.toLowerCase() === clean ||
      (clean.length >= 10 && m.phone.endsWith(clean)) ||
      (m.phone.length >= 10 && clean.endsWith(m.phone))
  ) || null;

  if (membership && membership.status === 'granted') {
    return { membership, application: null, isB2BGranted: true, status: 'granted' };
  }

  // 2. Check application table
  const app = state.b2bApplications.find(
    (a) =>
      a.phone.toLowerCase() === clean ||
      a.verifiedEmail.toLowerCase() === clean ||
      (clean.length >= 10 && a.phone.endsWith(clean)) ||
      (a.phone.length >= 10 && clean.endsWith(a.phone))
  ) || null;

  if (app) {
    return {
      membership,
      application: app,
      isB2BGranted: false,
      status: app.status,
    };
  }

  if (membership) {
    return {
      membership,
      application: null,
      isB2BGranted: false,
      status: membership.status as B2BApplicationStatus,
    };
  }

  return { membership: null, application: null, isB2BGranted: false, status: 'none' };
}

export function getCurrentUserB2BMembership(): B2BMembershipRecord | null {
  try {
    const phone = (typeof localStorage !== 'undefined' && localStorage.getItem('lashker_user_phone')) || '';
    if (!phone) return null;
    const status = getB2BStatusForCustomer(phone);
    return status.isB2BGranted ? status.membership : null;
  } catch {
    return null;
  }
}

export function isCurrentUserB2BGranted(): boolean {
  try {
    const phone = (typeof localStorage !== 'undefined' && localStorage.getItem('lashker_user_phone')) || '';
    if (!phone) return false;
    return getB2BStatusForCustomer(phone).isB2BGranted;
  } catch {
    return false;
  }
}

export function getOrCreateB2BProfile(
  phone: string,
  businessName?: string,
  contactPerson?: string
): B2BClientProfile {
  const cleanPhone = phone.trim();
  const b2bStatus = getB2BStatusForCustomer(cleanPhone);

  let existing = state.b2bClients.find(
    (b) => b.phone === cleanPhone || b.phone.endsWith(cleanPhone) || cleanPhone.endsWith(b.phone)
  );

  if (b2bStatus.isB2BGranted && b2bStatus.membership) {
    const mem = b2bStatus.membership;
    if (!existing) {
      existing = {
        id: mem.id,
        publicId: generatePublicB2BId(),
        businessName: mem.businessName,
        contactPerson: mem.contactName,
        phone: mem.phone,
        email: mem.verifiedEmail,
        businessAddress: 'Dhaka, Bangladesh',
        district: 'Dhaka',
        status: 'granted',
        pricingTier: mem.priceGroupName,
        tierDiscountRate: mem.discountRate,
        moqPacks: mem.moqPacks,
        creditApproved: true,
        createdAt: mem.createdAt,
      };
      state.b2bClients.push(existing);
    } else {
      existing.status = 'granted';
      existing.businessName = mem.businessName;
      existing.pricingTier = mem.priceGroupName;
      existing.tierDiscountRate = mem.discountRate;
    }
    return existing;
  }

  if (b2bStatus.application) {
    const app = b2bStatus.application;
    if (!existing) {
      existing = {
        id: app.id,
        publicId: generatePublicB2BId(),
        businessName: app.businessName,
        contactPerson: app.contactName,
        phone: app.phone,
        email: app.verifiedEmail,
        businessAddress: app.district,
        district: app.district,
        status: app.status,
        pricingTier: 'Standard Wholesale (Pending Review)',
        tierDiscountRate: 0,
        moqPacks: 20,
        creditApproved: false,
        createdAt: app.createdAt,
        decisionReason: app.decisionReason,
      };
      state.b2bClients.push(existing);
    } else {
      existing.status = app.status;
      existing.decisionReason = app.decisionReason;
    }
    return existing;
  }

  if (!existing) {
    existing = {
      id: `b2b-${Date.now()}`,
      publicId: generatePublicB2BId(),
      businessName: businessName || 'Wholesale Inquirer',
      contactPerson: contactPerson || 'Business Owner',
      phone: cleanPhone,
      email: '',
      businessAddress: 'Dhaka, Bangladesh',
      district: 'Dhaka',
      status: 'pending',
      pricingTier: 'Unverified Retail Account',
      tierDiscountRate: 0,
      moqPacks: 20,
      creditApproved: false,
      createdAt: new Date().toISOString(),
    };
    state.b2bClients.push(existing);
  }
  return existing;
}

export async function submitB2BApplication(input: {
  customerId?: string;
  businessName: string;
  contactName: string;
  verifiedEmail: string;
  phone: string;
  district: string;
  tradeLicenseNo?: string;
  accessCode?: string;
}): Promise<{
  success: boolean;
  message: string;
  status: B2BApplicationStatus;
  application?: B2BApplicationRecord;
  membership?: B2BMembershipRecord;
  error?: string;
}> {
  if (!input.businessName?.trim()) {
    return { success: false, message: 'Business Name is required.', status: 'rejected', error: 'Business Name is required.' };
  }
  if (!input.contactName?.trim()) {
    return { success: false, message: 'Contact Name is required.', status: 'rejected', error: 'Contact Name is required.' };
  }
  if (!input.verifiedEmail?.trim() || !input.verifiedEmail.includes('@')) {
    return { success: false, message: 'Valid verified account email is required.', status: 'rejected', error: 'Valid verified account email is required.' };
  }

  const cleanPhone = input.phone.trim();
  const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  if (!bdPhoneRegex.test(cleanPhone)) {
    return {
      success: false,
      message: 'Invalid Bangladeshi phone format. Must be +8801XXXXXXXXX or 01XXXXXXXXX.',
      status: 'rejected',
      error: 'Invalid Bangladeshi phone format.',
    };
  }

  // Guard: A customer cannot submit a new application while one is already pending
  const existingApp = state.b2bApplications.find(
    (a) =>
      (a.phone === cleanPhone || a.verifiedEmail.toLowerCase() === input.verifiedEmail.trim().toLowerCase()) &&
      a.status === 'pending'
  );
  if (existingApp) {
    return {
      success: false,
      message: 'You already have an application under review. Please wait for our team to review your application.',
      status: 'pending',
      error: 'Duplicate application pending.',
    };
  }

  // Check if customer already has active granted membership
  const existingMem = state.b2bMemberships.find(
    (m) =>
      (m.phone === cleanPhone || m.verifiedEmail.toLowerCase() === input.verifiedEmail.trim().toLowerCase()) &&
      m.status === 'granted'
  );
  if (existingMem) {
    return {
      success: true,
      message: 'Your account already has active B2B wholesale access.',
      status: 'granted',
      membership: existingMem,
    };
  }

  const now = new Date().toISOString();
  let codeRecord: B2BAccessCodeRecord | undefined;

  // Handle access code if provided
  if (input.accessCode && input.accessCode.trim()) {
    const rawCode = input.accessCode.trim();
    codeRecord = state.b2bAccessCodes.find(
      (c) => c.code.toLowerCase() === rawCode.toLowerCase()
    );

    if (!codeRecord || !codeRecord.isActive) {
      return {
        success: false,
        message: 'Invalid or inactive access code. You can still apply without a code.',
        status: 'rejected',
        error: 'Invalid access code.',
      };
    }

    if (codeRecord.usedCount >= codeRecord.maxUses) {
      return {
        success: false,
        message: 'This access code has reached its maximum redemptions. You can still apply without a code.',
        status: 'rejected',
        error: 'Access code exhausted.',
      };
    }

    if (codeRecord.expiresAt && new Date(codeRecord.expiresAt).getTime() < Date.now()) {
      return {
        success: false,
        message: 'This access code has expired. You can still apply without a code.',
        status: 'rejected',
        error: 'Access code expired.',
      };
    }
  }

  // Evaluate policy
  if (codeRecord && (codeRecord.policy === 'A' || codeRecord.policy === 'C')) {
    codeRecord.usedCount++;

    const isLimited = codeRecord.policy === 'C';
    const priceGroupName = isLimited ? 'Limited Wholesale' : (codeRecord.targetPriceGroupName || 'Standard Wholesale');
    const discountRate = isLimited ? 0.08 : 0.14;

    const newApp: B2BApplicationRecord = {
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      customerId: input.customerId || `cus-${Date.now()}`,
      businessName: input.businessName.trim(),
      contactName: input.contactName.trim(),
      verifiedEmail: input.verifiedEmail.trim().toLowerCase(),
      phone: cleanPhone,
      district: input.district.trim(),
      tradeLicenseNo: input.tradeLicenseNo?.trim() || undefined,
      status: 'granted',
      accessCode: codeRecord.code,
      accessCodeLabel: codeRecord.label,
      decisionReason: `Auto-approved via Access Code ${codeRecord.code} (Policy ${codeRecord.policy})`,
      decisionAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const newMembership: B2BMembershipRecord = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      customerId: newApp.customerId,
      businessName: newApp.businessName,
      contactName: newApp.contactName,
      verifiedEmail: newApp.verifiedEmail,
      phone: newApp.phone,
      priceGroupId: codeRecord.targetPriceGroupId || 'pg-1',
      priceGroupName,
      status: 'granted',
      grantSource: `Access Code: ${codeRecord.code} (Policy ${codeRecord.policy})`,
      discountRate,
      moqPacks: 20,
      creditLimit: isLimited ? 25000 : 50000,
      createdAt: now,
    };

    state.b2bApplications.unshift(newApp);
    state.b2bMemberships.unshift(newMembership);
    state.activeAccountMode = 'b2b';

    const successMsg = isLimited
      ? 'Limited Wholesale Access Activated. Enjoy special tier pricing on eligible products.'
      : 'Access Granted! Welcome to Lashker Traders B2B Wholesale. You now have access to wholesale pricing.';

    return {
      success: true,
      message: successMsg,
      status: 'granted',
      application: newApp,
      membership: newMembership,
    };
  }

  // If Policy B or no access code -> Application stays pending
  let decisionReason: string | undefined;
  let codeLabel: string | undefined;
  if (codeRecord && codeRecord.policy === 'B') {
    codeRecord.usedCount++;
    codeLabel = codeRecord.label;
    decisionReason = `Submitted with VIP Access Code ${codeRecord.code} (Policy B - Staff Review)`;
  }

  const newApp: B2BApplicationRecord = {
    id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    customerId: input.customerId || `cus-${Date.now()}`,
    businessName: input.businessName.trim(),
    contactName: input.contactName.trim(),
    verifiedEmail: input.verifiedEmail.trim().toLowerCase(),
    phone: cleanPhone,
    district: input.district.trim(),
    tradeLicenseNo: input.tradeLicenseNo?.trim() || undefined,
    status: 'pending',
    accessCode: codeRecord?.code,
    accessCodeLabel: codeLabel,
    decisionReason,
    createdAt: now,
    updatedAt: now,
  };

  state.b2bApplications.unshift(newApp);

  const message = codeRecord
    ? `Application received with VIP code ${codeRecord.code}. Our team will review your application within 24 hours.`
    : 'Application Submitted! Our B2B operations team reviews applications within 24–48 hours. You will receive an SMS/email confirmation once approved.';

  return {
    success: true,
    message,
    status: 'pending',
    application: newApp,
  };
}

export async function cancelCustomerB2BApplication(
  applicationId: string,
  customerPhoneOrEmail: string
): Promise<{ success: boolean; message: string }> {
  const clean = customerPhoneOrEmail.trim().toLowerCase();
  const app = state.b2bApplications.find(
    (a) =>
      a.id === applicationId &&
      (a.phone.toLowerCase() === clean || a.verifiedEmail.toLowerCase() === clean)
  );

  if (!app) {
    return { success: false, message: 'Application not found or unauthorized.' };
  }

  if (app.status !== 'pending') {
    return { success: false, message: `Cannot cancel application with status '${app.status}'.` };
  }

  app.status = 'cancelled';
  app.updatedAt = new Date().toISOString();
  return { success: true, message: 'B2B application has been cancelled.' };
}

export function verifyCustomerB2BAccessCode(code: string): {
  valid: boolean;
  policy?: 'A' | 'B' | 'C';
  label?: string;
  error?: string;
} {
  const clean = code.trim();
  const rec = state.b2bAccessCodes.find((c) => c.code.toLowerCase() === clean.toLowerCase());
  if (!rec || !rec.isActive) {
    return { valid: false, error: 'Invalid or inactive access code.' };
  }
  if (rec.usedCount >= rec.maxUses) {
    return { valid: false, error: 'This access code has reached its maximum redemptions.' };
  }
  if (rec.expiresAt && new Date(rec.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: 'This access code has expired.' };
  }
  return {
    valid: true,
    policy: rec.policy,
    label: rec.label,
  };
}

export function getCustomerOrders(phone: string): OrderRecord[] {
  const clean = phone.trim();
  if (!clean) return [];
  return state.orders.filter(
    (o) =>
      o.customerPhone === clean ||
      o.customerPhone.endsWith(clean) ||
      clean.endsWith(o.customerPhone)
  );
}

export function getActiveAccountMode(): 'retail' | 'b2b' {
  return state.activeAccountMode;
}

export function setActiveAccountMode(mode: 'retail' | 'b2b'): void {
  state.activeAccountMode = mode;
}

/**
 * Concurrency-safe, transactional order placement
 * 1. Checks honeypot bot trap
 * 2. Checks idempotency
 * 3. Authoritative price & inventory check (Enforces server-authoritative B2B pricing)
 * 4. Recalculates discount on server (never trust browser math)
 * 5. Atomic stock decrement
 * 6. Generates sequential order number: LT-00001
 * 7. Generates 48-char cryptographically secure tracking token
 * 8. Returns order snapshot with pricingMode ('retail' | 'wholesale')
 */
export async function placeOrder(input: CheckoutFormInput): Promise<{
  success: boolean;
  order?: OrderRecord;
  error?: string;
}> {
  // 1. Bot spam protection: honeypot verification
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { success: false, error: 'Automated submission rejected.' };
  }

  // 2. Idempotency check
  if (input.idempotencyKey) {
    const existing = state.orders.find((o) => o.idempotencyKey === input.idempotencyKey);
    if (existing) {
      return { success: true, order: existing };
    }
  }

  // Authoritative zone calculation (NEVER trust client delivery fees)
  const zone = state.deliveryZones.find((z) => z.id === input.deliveryZoneId) || state.deliveryZones[0];
  const deliveryCharge = zone.baseFee;

  // Authoritative B2B membership verification
  const cleanPhone = (input.customerPhone || '').trim();
  const b2bMember = state.b2bMemberships.find(
    (m) =>
      m.status === 'granted' &&
      (m.phone === cleanPhone || m.phone.endsWith(cleanPhone) || cleanPhone.endsWith(m.phone))
  );
  const isGrantedB2B = Boolean(b2bMember);

  let subtotal = 0;
  const itemSnapshots: OrderItemSnapshot[] = [];

  // Validate items and check stock atomically
  for (const requestedItem of input.items) {
    let foundVariant: ProductVariant | undefined;
    let parentProduct: Product | undefined;

    for (const p of state.products) {
      const v = p.variants.find((v) => v.id === requestedItem.variantId);
      if (v) {
        foundVariant = v;
        parentProduct = p;
        break;
      }
    }

    if (!foundVariant || !parentProduct) {
      return {
        success: false,
        error: `Variant ${requestedItem.variantId} not found in catalog`,
      };
    }

    if (!foundVariant.isAvailable) {
      return {
        success: false,
        error: `${parentProduct.name} (Size ${foundVariant.size}) is currently unavailable`,
      };
    }

    if (foundVariant.stockQuantity < requestedItem.quantity) {
      return {
        success: false,
        error: `Insufficient stock for ${parentProduct.name} (${foundVariant.size}). Requested: ${requestedItem.quantity}, Available: ${foundVariant.stockQuantity}`,
      };
    }

    // Authoritative dual-pricing resolution:
    // Only granted B2B partners who meet the variant MOQ receive wholesale pricing.
    // All other users (retail, pending, restricted, or below MOQ) are strictly charged retail price.
    const moq = foundVariant.wholesaleMoq || 20;
    const canUseWholesale =
      isGrantedB2B &&
      requestedItem.quantity >= moq &&
      foundVariant.wholesalePrice != null &&
      foundVariant.wholesalePrice > 0;

    const unitPrice = canUseWholesale ? foundVariant.wholesalePrice! : foundVariant.price;
    const pricingMode: 'retail' | 'wholesale' = canUseWholesale ? 'wholesale' : 'retail';

    const lineSubtotal = unitPrice * requestedItem.quantity;
    subtotal += lineSubtotal;

    itemSnapshots.push({
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: parentProduct.id,
      variantId: foundVariant.id,
      productName: parentProduct.name,
      size: foundVariant.size,
      packCount: foundVariant.packCount,
      sku: foundVariant.sku,
      unitPrice,
      quantity: requestedItem.quantity,
      discount: 0,
      subtotal: lineSubtotal,
      pricingMode,
    });
  }

  // Authoritative coupon recalculation on server-side
  let discount = 0;
  if (input.couponCode) {
    const couponResult = validateCoupon(
      input.couponCode,
      subtotal,
      itemSnapshots.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }))
    );
    if (couponResult.valid) {
      discount = couponResult.discountAmount;
      if (couponResult.coupon) {
        couponResult.coupon.usedCount++;
      }
    }
  }

  // Atomic stock decrement and movement logging
  for (const requestedItem of input.items) {
    for (const p of state.products) {
      const v = p.variants.find((v) => v.id === requestedItem.variantId);
      if (v) {
        const prev = v.stockQuantity;
        v.stockQuantity -= requestedItem.quantity;
        v.isAvailable = v.stockQuantity > 0;

        state.inventoryMovements.push({
          id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          variantId: v.id,
          changeQuantity: -requestedItem.quantity,
          reason: 'order_placed',
          previousStock: prev,
          newStock: v.stockQuantity,
          timestamp: new Date().toISOString(),
        });
        break;
      }
    }
  }

  // Sequential order number allocation (LT-00001)
  const orderNumber = `LT-${String(orderSequenceCounter++).padStart(5, '0')}`;
  // 48-char cryptographically secure tracking token (24 random bytes hex)
  const guestTrackingToken = generateSecureTrackingToken();
  const now = new Date().toISOString();
  const finalTotal = Math.max(0, subtotal - discount) + deliveryCharge;

  const newOrder: OrderRecord = {
    id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    orderNumber,
    idempotencyKey: input.idempotencyKey,
    guestTrackingToken,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    deliveryAddress: input.deliveryAddress,
    deliveryZoneId: zone.id,
    deliveryZoneName: zone.name,
    additionalNote: input.additionalNote,
    subtotal,
    discount,
    deliveryCharge,
    total: finalTotal,
    orderStatus: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: 'cash_on_delivery',
    fulfillmentStatus: 'awaiting_preparation',
    isWhatsappOrder: input.isWhatsappOrder || false,
    createdAt: now,
    updatedAt: now,
    items: itemSnapshots,
    statusHistory: [
      {
        oldStatus: null,
        newStatus: 'pending',
        changedAt: now,
        notes: input.isWhatsappOrder ? 'Order received via WhatsApp handoff' : 'Order placed via storefront checkout',
      },
    ],
  };

  state.orders.unshift(newOrder);

  // Link to customer profile automatically
  const customer = getOrCreateCustomerProfile(input.customerPhone, input.customerName);
  const hasAddr = customer.addresses.some((a) => a.address === input.deliveryAddress);
  if (!hasAddr) {
    customer.addresses.push({
      id: `addr-${Date.now()}`,
      title: customer.addresses.length === 0 ? 'Primary Address' : `Delivery Address ${customer.addresses.length + 1}`,
      recipientName: input.customerName,
      phone: input.customerPhone,
      address: input.deliveryAddress,
      zoneId: zone.id,
      isDefault: customer.addresses.length === 0,
    });
  }

  return { success: true, order: newOrder };
}

export async function getOrderByTracking(orderNumber: string, token: string): Promise<OrderRecord | null> {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const order = state.orders.find(
    (o) => o.orderNumber.toUpperCase() === cleanOrderNum && o.guestTrackingToken === token.trim()
  );
  return order || null;
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderRecord | null> {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const order = state.orders.find((o) => o.orderNumber.toUpperCase() === cleanOrderNum);
  return order || null;
}

export async function getOrderByToken(token: string): Promise<OrderRecord | null> {
  const clean = token.trim();
  const order = state.orders.find((o) => o.guestTrackingToken === clean);
  return order || null;
}

export async function getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<OrderRecord | null> {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.trim();
  const order = state.orders.find(
    (o) =>
      o.orderNumber.toUpperCase() === cleanOrderNum &&
      (o.customerPhone === cleanPhone || o.customerPhone.endsWith(cleanPhone) || cleanPhone.endsWith(o.customerPhone))
  );
  return order || null;
}

export async function getAllOrdersAdmin(params?: {
  search?: string;
  status?: string;
  deliveryZone?: string;
}) {
  let list = [...state.orders];

  if (params?.status && params.status !== 'all') {
    list = list.filter((o) => o.orderStatus === params.status);
  }

  if (params?.deliveryZone && params.deliveryZone !== 'all') {
    list = list.filter((o) => o.deliveryZoneId === params.deliveryZone);
  }

  if (params?.search) {
    const s = params.search.toLowerCase().trim();
    list = list.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.customerPhone.includes(s)
    );
  }

  return list;
}

export async function updateOrderStatusAdmin(
  orderId: string,
  newStatus: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const order = state.orders.find((o) => o.id === orderId);
  if (!order) return { success: false, error: 'Order not found' };

  const oldStatus = order.orderStatus;
  order.orderStatus = newStatus;
  order.updatedAt = new Date().toISOString();

  // If order is cancelled, restore stock safely (EXACTLY ONCE)
  if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
    for (const item of order.items) {
      for (const p of state.products) {
        const v = p.variants.find((v) => v.id === item.variantId);
        if (v) {
          const prev = v.stockQuantity;
          v.stockQuantity += item.quantity;
          v.isAvailable = true;

          state.inventoryMovements.push({
            id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            variantId: v.id,
            orderId: order.id,
            changeQuantity: item.quantity,
            reason: 'order_cancelled',
            previousStock: prev,
            newStock: v.stockQuantity,
            timestamp: new Date().toISOString(),
          });
          break;
        }
      }
    }
  }

  order.statusHistory.push({
    oldStatus,
    newStatus,
    changedAt: new Date().toISOString(),
    notes: notes || `Status changed from ${oldStatus} to ${newStatus}`,
  });

  return { success: true };
}

export async function saveProductAdmin(
  input: ProductInput,
  id?: string
): Promise<{ success: boolean; product?: Product; error?: string }> {
  const now = new Date().toISOString();

  if (id) {
    const idx = state.products.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, error: 'Product not found' };

    const existing = state.products[idx];
    const updatedVariants: ProductVariant[] = input.variants.map((v, i) => ({
      id: v.id || `v-${Date.now()}-${i}`,
      productId: existing.id,
      sku: v.sku,
      size: v.size,
      packCount: v.packCount,
      price: v.price,
      regularPrice: v.regularPrice,
      stockQuantity: v.stockQuantity,
      isAvailable: v.isAvailable && v.stockQuantity > 0,
      barcode: v.barcode,
      variantImageUrl: v.variantImageUrl,
    }));

    const updatedProduct: Product = {
      ...existing,
      name: input.name,
      slug: input.slug,
      description: input.description,
      shortDescription: input.shortDescription || '',
      basePrice: input.basePrice,
      salePrice: input.salePrice,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished,
      seoTitle: input.seoTitle || '',
      seoDescription: input.seoDescription || '',
      tags: input.tags || [],
      searchKeywords: input.searchKeywords || '',
      weightGrams: input.weightGrams || 0,
      variants: updatedVariants,
    };

    state.products[idx] = updatedProduct;
    return { success: true, product: updatedProduct };
  } else {
    const newId = `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const variants: ProductVariant[] = input.variants.map((v, i) => ({
      id: `v-${Date.now()}-${i}`,
      productId: newId,
      sku: v.sku,
      size: v.size,
      packCount: v.packCount,
      price: v.price,
      regularPrice: v.regularPrice,
      stockQuantity: v.stockQuantity,
      isAvailable: v.isAvailable && v.stockQuantity > 0,
      barcode: v.barcode,
      variantImageUrl: v.variantImageUrl,
    }));

    const newProduct: Product = {
      id: newId,
      name: input.name,
      slug: input.slug,
      brand: 'Twinkle',
      brandSlug: 'twinkle',
      category: 'Diaper Pants',
      categorySlug: 'diaper-pants',
      sku: input.sku || `SKU-${Date.now().toString().slice(-6)}`,
      shortDescription: input.shortDescription || '',
      description: input.description,
      basePrice: input.basePrice,
      salePrice: input.salePrice,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished,
      seoTitle: input.seoTitle || '',
      seoDescription: input.seoDescription || '',
      tags: input.tags || [],
      searchKeywords: input.searchKeywords || '',
      weightGrams: input.weightGrams || 0,
      mainImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'],
      averageRating: 5.0,
      reviewCount: 0,
      createdAt: now,
      variants,
    };

    state.products.unshift(newProduct);
    return { success: true, product: newProduct };
  }
}

/**
 * Bulk product & variant importer with SKU deduplication and bounded batching
 */
export const importProductsCsvAdmin = importProductsBatch;

export async function importProductsBatch(rows: ImportRow[]): Promise<{
  created: number;
  updated: number;
  failed: number;
  errors: Array<{ sku: string; error: string }>;
}> {
  let created = 0;
  let updated = 0;
  let failed = 0;
  const errors: Array<{ sku: string; error: string }> = [];

  for (const row of rows) {
    try {
      // Find matching variant by SKU or product by name
      let found = false;
      for (const p of state.products) {
        const v = p.variants.find((v) => v.sku.toUpperCase() === row.variant_sku.toUpperCase());
        if (v) {
          // Update existing variant price and stock
          v.price = row.price;
          if (row.regular_price) v.regularPrice = row.regular_price;
          v.stockQuantity = row.stock_quantity;
          v.isAvailable = row.stock_quantity > 0;
          updated++;
          found = true;
          break;
        }
      }

      if (!found) {
        // Check if parent product exists
        let parent = state.products.find(
          (p) => p.name.toLowerCase() === row.product_name.toLowerCase()
        );

        if (!parent) {
          // Create new product
          const pId = `p-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          parent = {
            id: pId,
            name: row.product_name,
            slug: (row.product_slug || row.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/(^-|-$)/g, ''),
            brand: row.brand_name || 'Twinkle',
            brandSlug: (row.brand_name || 'twinkle').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: row.category_name || 'Diaper Pants',
            categorySlug: (row.category_name || 'diaper-pants').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            sku: `IMP-${row.variant_sku}`,
            shortDescription: row.description || '',
            description: row.description || `${row.product_name} available at Lashker Traders.`,
            basePrice: row.price,
            salePrice: row.regular_price ? row.price : null,
            isFeatured: false,
            isPublished: true,
            tags: ['imported'],
            weightGrams: 900,
            mainImage: row.image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
            galleryImages: [row.image_url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'],
            averageRating: 5.0,
            reviewCount: 0,
            createdAt: new Date().toISOString(),
            variants: [],
          };
          state.products.push(parent);
        }

        // Add variant to parent
        parent.variants.push({
          id: `v-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: parent.id,
          sku: row.variant_sku,
          size: row.size,
          packCount: row.pack_count,
          price: row.price,
          regularPrice: row.regular_price,
          stockQuantity: row.stock_quantity,
          isAvailable: row.stock_quantity > 0,
          barcode: row.barcode,
        });

        created++;
      }
    } catch (err: unknown) {
      failed++;
      errors.push({
        sku: row.variant_sku,
        error: err instanceof Error ? err.message : 'Unknown import error',
      });
    }
  }

  return { created, updated, failed, errors };
}

export async function getProductReviews(productId: string) {
  return state.reviews.filter((r) => r.productId === productId && r.status === 'approved');
}

export async function submitReview(input: {
  productId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  isVerifiedPurchase?: boolean;
}) {
  const newRev: ReviewRecord = {
    id: `rev-${Date.now()}`,
    productId: input.productId,
    customerName: input.customerName,
    rating: input.rating,
    reviewText: input.reviewText,
    isVerifiedPurchase: input.isVerifiedPurchase || false,
    status: 'pending', // Requires staff approval
    createdAt: new Date().toISOString(),
  };

  state.reviews.unshift(newRev);
  return { success: true, message: 'Review submitted for staff moderation' };
}

export async function getAdminStats() {
  const totalProducts = state.products.length;
  let totalVariants = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const p of state.products) {
    for (const v of p.variants) {
      totalVariants++;
      if (v.stockQuantity === 0) outOfStockCount++;
      else if (v.stockQuantity <= 15) lowStockCount++;
    }
  }

  const pendingOrders = state.orders.filter((o) => o.orderStatus === 'pending').length;
  const totalOrders = state.orders.length;
  const totalRevenue = state.orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return {
    totalProducts,
    totalVariants,
    activeProducts: state.products.filter((p) => p.isPublished).length,
    draftProducts: state.products.filter((p) => !p.isPublished).length,
    lowStockCount,
    outOfStockCount,
    pendingOrders,
    totalOrders,
    totalRevenue,
    recentOrders: state.orders.slice(0, 5),
  };
}
