import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from '@/i18n';
import { RouterProvider } from '@/router';
import { AuthProvider } from '@/lib/context/auth-context';
import { CartProvider } from '@/lib/context/cart-context';
import { WishlistProvider } from '@/lib/context/wishlist-context';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppContent } from './App';

// Import modular design system stylesheets
import '@/styles/variables.css';
import '@/styles/main.css';
import '@/styles/b2b.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <I18nProvider>
          <AuthProvider>
            <RouterProvider>
              <WishlistProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
              </WishlistProvider>
            </RouterProvider>
          </AuthProvider>
        </I18nProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
