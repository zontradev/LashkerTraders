// ==============================================================================
// Lashker Traders — Generated Database Schema Types for Supabase
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'failed_delivery';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'partially_refunded';

export type FulfillmentStatus =
  | 'awaiting_preparation'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'returned';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          origin_country: string | null;
          description: string | null;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          origin_country?: string | null;
          description?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          origin_country?: string | null;
          description?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          brand_id: string | null;
          category_id: string | null;
          sku: string | null;
          short_description: string | null;
          description: string | null;
          base_price: number;
          sale_price: number | null;
          is_featured: boolean;
          is_published: boolean;
          seo_title: string | null;
          seo_description: string | null;
          canonical_url: string | null;
          social_preview_url: string | null;
          tags: string[];
          search_keywords: string | null;
          weight_grams: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          brand_id?: string | null;
          category_id?: string | null;
          sku?: string | null;
          short_description?: string | null;
          description?: string | null;
          base_price?: number;
          sale_price?: number | null;
          is_featured?: boolean;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          canonical_url?: string | null;
          social_preview_url?: string | null;
          tags?: string[];
          search_keywords?: string | null;
          weight_grams?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          brand_id?: string | null;
          category_id?: string | null;
          sku?: string | null;
          short_description?: string | null;
          description?: string | null;
          base_price?: number;
          sale_price?: number | null;
          is_featured?: boolean;
          is_published?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          canonical_url?: string | null;
          social_preview_url?: string | null;
          tags?: string[];
          search_keywords?: string | null;
          weight_grams?: number;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: string;
          pack_count: number;
          price: number;
          regular_price: number | null;
          stock_quantity: number;
          is_available: boolean;
          barcode: string | null;
          weight_grams: number;
          variant_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          size: string;
          pack_count: number;
          price: number;
          regular_price?: number | null;
          stock_quantity?: number;
          is_available?: boolean;
          barcode?: string | null;
          weight_grams?: number;
          variant_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          size?: string;
          pack_count?: number;
          price?: number;
          regular_price?: number | null;
          stock_quantity?: number;
          is_available?: boolean;
          barcode?: string | null;
          weight_grams?: number;
          variant_image_url?: string | null;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          storage_path: string;
          public_url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          storage_path: string;
          public_url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          storage_path?: string;
          public_url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          name: string;
          code: string;
          base_fee: number;
          description: string | null;
          estimated_delivery_days: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          base_fee: number;
          description?: string | null;
          estimated_delivery_days?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          base_fee?: number;
          description?: string | null;
          estimated_delivery_days?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          idempotency_key: string | null;
          user_id: string | null;
          guest_tracking_token: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          delivery_zone_id: string | null;
          additional_note: string | null;
          subtotal: number;
          discount: number;
          delivery_charge: number;
          total: number;
          order_status: OrderStatus;
          payment_status: PaymentStatus;
          payment_method: string;
          fulfillment_status: FulfillmentStatus;
          is_whatsapp_order: boolean;
          staff_internal_notes: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          idempotency_key?: string | null;
          user_id?: string | null;
          guest_tracking_token?: string;
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
          delivery_zone_id?: string | null;
          additional_note?: string | null;
          subtotal: number;
          discount?: number;
          delivery_charge?: number;
          total: number;
          order_status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: string;
          fulfillment_status?: FulfillmentStatus;
          is_whatsapp_order?: boolean;
          staff_internal_notes?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_address?: string;
          delivery_zone_id?: string | null;
          additional_note?: string | null;
          subtotal?: number;
          discount?: number;
          delivery_charge?: number;
          total?: number;
          order_status?: OrderStatus;
          payment_status?: PaymentStatus;
          payment_method?: string;
          fulfillment_status?: FulfillmentStatus;
          staff_internal_notes?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name_snapshot: string;
          variant_size_snapshot: string;
          pack_count_snapshot: number;
          sku_snapshot: string;
          unit_price: number;
          quantity: number;
          discount: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name_snapshot: string;
          variant_size_snapshot: string;
          pack_count_snapshot: number;
          sku_snapshot: string;
          unit_price: number;
          quantity: number;
          discount?: number;
          subtotal: number;
          created_at?: string;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          old_status: string | null;
          new_status: string;
          changed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          old_status?: string | null;
          new_status: string;
          changed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      inventory_movements: {
        Row: {
          id: string;
          variant_id: string;
          order_id: string | null;
          change_quantity: number;
          reason: string;
          previous_stock: number;
          new_stock: number;
          actor_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          variant_id: string;
          order_id?: string | null;
          change_quantity: number;
          reason: string;
          previous_stock: number;
          new_stock: number;
          actor_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      product_reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          order_id: string | null;
          customer_name: string;
          rating: number;
          review_text: string;
          is_verified_purchase: boolean;
          status: 'pending' | 'approved' | 'rejected';
          moderated_by: string | null;
          moderated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          order_id?: string | null;
          customer_name: string;
          rating: number;
          review_text: string;
          is_verified_purchase?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          moderated_by?: string | null;
          moderated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rating?: number;
          review_text?: string;
          status?: 'pending' | 'approved' | 'rejected';
          moderated_by?: string | null;
          moderated_at?: string | null;
          updated_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: Json;
          description: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          setting_value?: Json;
          description?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_data: Json | null;
          new_data: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
