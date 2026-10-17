# Lashker Traders — Security, Authentication & RLS Architecture

## 1. Authentication Configuration

Lashker Traders uses **Supabase Auth** with support for:
1. **Google OAuth 2.0**: For 1-click customer login and staff access.
2. **Email Magic Links / Password**: For standard customer accounts.
3. **Guest Checkout**: Customers can place orders without account creation.

### Google OAuth Setup in Supabase Dashboard
1. Go to **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google**.
2. Enable Google provider.
3. In Google Cloud Console, configure OAuth Consent Screen and create Web Application credentials.
4. Set Authorized redirect URI to:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret into Supabase.

---

## 2. Authorization & Role-Based Access Control (RBAC)

Authorization is **strictly verified in PostgreSQL and server-side endpoints**, never via client-editable user metadata or hidden client URLs.

### Roles Matrix:
- `super_admin`: Full system control, role assignment, billing configuration.
- `admin`: Product management, stock adjustment, order lifecycle, reviews moderation, CSV imports.
- `manager`: Order fulfillment, courier dispatch, inventory updates.
- `staff`: Order tracking, customer support note additions.
- `customer`: Own profile, saved addresses, personal orders, review submission.

### Prevention of Privilege Escalation:
- Profiles have `role user_role DEFAULT 'customer'`.
- The RLS policy on `profiles` allows users to update only their own name and phone:
  ```sql
  CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (role = (SELECT role FROM profiles WHERE id = auth.uid()));
  ```
- Promoting an account to `admin` requires an explicit database query or super_admin action. Customers cannot alter their own `role` field.

---

## 3. Server-Side Protection Rules

1. **Client Price Tampering Immunity**:
   - The browser never submits `total`, `unit_price`, or `delivery_fee`.
   - The server reads authoritative variant prices and authoritative delivery zone fees from PostgreSQL.
2. **Guest Order Privacy**:
   - Sequential order numbers (`LT-00001`) are public references.
   - Guest order tracking requires a high-entropy 48-character cryptographic token (`guest_tracking_token`) generated via `encode(gen_random_bytes(24), 'hex')`.
   - Knowing an order number does NOT grant access to order contents or personal details without the matching token or authenticated ownership.
3. **Idempotent Checkout**:
   - Every checkout submission accepts an optional `idempotency_key`. Retrying a failed connection returns the previously created order rather than creating a duplicate.
4. **Service Role Secret Isolation**:
   - `SUPABASE_SERVICE_ROLE_KEY` is strictly excluded from `NEXT_PUBLIC_*` prefixes and only accessed inside server actions and route handlers.
