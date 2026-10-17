# Lashker Traders — Supabase Storage Architecture & Setup

## 1. Storage Buckets

Lashker Traders utilizes four distinct Supabase Storage buckets:

| Bucket ID | Access Level | Purpose | Max File Size | Allowed MIME Types |
|---|---|---|---|---|
| `product-images` | **Public Read** | High-resolution diaper product and variant photos | 5 MB | `image/jpeg`, `image/png`, `image/webp` |
| `category-images`| **Public Read** | Category cover banners and thumbnails | 5 MB | `image/jpeg`, `image/png`, `image/webp` |
| `brand-logos`    | **Public Read** | Brand logos (Twinkle, Huggies, Pampers, etc.) | 2 MB | `image/jpeg`, `image/png`, `image/svg+xml`, `image/webp` |
| `import-files`   | **Private**     | Administrative bulk import spreadsheets (CSV, XLSX) | 10 MB | `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.ms-excel` |

---

## 2. Row Level Security Policies for Storage

The storage schema uses the following security rules:

1. **Public Read**: Anyone can retrieve and view files in `product-images`, `category-images`, and `brand-logos`.
2. **Staff Only Upload/Update/Delete**: Only authenticated users whose `profiles.role` is `admin`, `manager`, or `super_admin` can insert, mutate, or delete catalog media.
3. **Restricted Admin Files**: Files inside `import-files` can only be read or written by authorized administrative staff.

---

## 3. Storage Migration Execution

The SQL migration file [`supabase/migrations/20261017000000_core_lashker_schema.sql`](file:///t:/Data%20Tool/King%20Lashker%20Traders.com/supabase/migrations/20261017000000_core_lashker_schema.sql) contains the bucket registration and security policies.

To apply via the Supabase CLI:
```bash
npx supabase db push
```
Or paste the migration contents into the Supabase Dashboard SQL Editor.
