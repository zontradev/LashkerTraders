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
    if (normalized === '/about') return <AboutView />;
    if (normalized === '/contact') return <ContactView />;
    if (normalized === '/shipping-policy') return <ShippingPolicyView />;
    if (normalized === '/return-policy') return <ReturnPolicyView />;
    if (normalized === '/privacy-policy') return <PrivacyPolicyView />;
    if (normalized === '/terms') return <TermsView />;
    if (normalized === '/admin' || normalized === '/client' || normalized === '/management' || normalized === '/client-server') {
      if (typeof window !== 'undefined') {
        window.location.href = 'http://localhost:3001';
      }
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Opening Lashker Traders Client Server...</h2>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>Connecting to Executive Management Console on port 3001</p>
          <a href="http://localhost:3001" style={{ padding: '10px 20px', background: '#0284c7', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            Click here to open Client Server (:3001)
          </a>
        </div>
      );
    }

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
