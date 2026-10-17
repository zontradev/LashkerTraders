import { z } from 'zod';

// Bangladeshi phone regex supporting 01XXXXXXXXX, +8801XXXXXXXXX, 8801XXXXXXXXX
export const bangladeshPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;

export const checkoutItemSchema = z.object({
  variantId: z.string().uuid({ message: 'Invalid variant ID format' }),
  quantity: z
    .number()
    .int({ message: 'Quantity must be an integer' })
    .positive({ message: 'Quantity must be at least 1' })
    .max(50, { message: 'Maximum 50 packs per order variant' }),
});

export const checkoutFormSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, { message: 'Customer name must be at least 2 characters' })
    .max(150, { message: 'Customer name cannot exceed 150 characters' }),
  customerPhone: z
    .string()
    .trim()
    .regex(bangladeshPhoneRegex, {
      message: 'Please enter a valid 11-digit Bangladeshi phone number (e.g., 01797753722)',
    }),
  deliveryAddress: z
    .string()
    .trim()
    .min(5, { message: 'Delivery address must be at least 5 characters' })
    .max(300, { message: 'Delivery address cannot exceed 300 characters' }),
  deliveryZoneId: z
    .string()
    .uuid({ message: 'Please select a valid delivery zone' })
    .or(z.string().min(1, { message: 'Please select a delivery zone' })),
  additionalNote: z
    .string()
    .trim()
    .max(500, { message: 'Additional note cannot exceed 500 characters' })
    .optional()
    .or(z.literal('')),
  items: z
    .array(checkoutItemSchema)
    .min(1, { message: 'Your cart is empty. Please add at least one item.' }),
  couponCode: z.string().trim().max(30).optional(),
  honeypot: z.string().max(0, { message: 'Spam detected' }).optional(),
  idempotencyKey: z.string().optional(),
  isWhatsappOrder: z.boolean().default(false),
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
export type CheckoutItemInput = z.infer<typeof checkoutItemSchema>;
