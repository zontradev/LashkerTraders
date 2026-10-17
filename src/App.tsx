import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useRouter } from '@/router';
import { HomeView } from '@/views/HomeView';
import { ShopView } from '@/views/ShopView';
import { CategoryView } from '@/views/CategoryView';
import { ProductView } from '@/views/ProductView';
import { CartView } from '@/views/CartView';
import { CheckoutView } from '@/views/CheckoutView';
import { TrackOrderView } from '@/views/TrackOrderView';
import { B2BWholesaleView } from '@/views/B2BWholesaleView';
import { AccountView } from '@/views/AccountView';
import { AdminView } from '@/views/AdminView';
import {
  AboutView,
  ContactView,
  ShippingPolicyView,
  ReturnPolicyView,
  PrivacyPolicyView,
  TermsView,
} from '@/views/StaticPolicyViews';

export function AppContent() {
  const { path } = useRouter();

  const renderCurrentView = () => {
    // Normalization
    const normalized = path.replace(/\/$/, '') || '/';

    if (normalized === '/') return <HomeView />;
    if (normalized === '/shop') return <ShopView />;
    if (normalized.startsWith('/category/')) return <CategoryView />;
    if (normalized.startsWith('/product/')) return <ProductView />;
    if (normalized === '/cart') return <CartView />;
    if (normalized === '/checkout') return <CheckoutView />;
    if (normalized === '/track-order') return <TrackOrderView />;
    if (normalized === '/b2b') return <B2BWholesaleView />;
    if (normalized === '/account') return <AccountView />;
    if (normalized.startsWith('/admin')) return <AdminView />;
    if (normalized === '/about') return <AboutView />;
    if (normalized === '/contact') return <ContactView />;
    if (normalized === '/shipping-policy') return <ShippingPolicyView />;
    if (normalized === '/return-policy') return <ReturnPolicyView />;
    if (normalized === '/privacy-policy') return <PrivacyPolicyView />;
    if (normalized === '/terms') return <TermsView />;

    // Fallback to Home
    return <HomeView />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <CartDrawer />
      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
