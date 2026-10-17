import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from '@/i18n';
import { RouterProvider } from '@/router';
import { CartProvider } from '@/lib/context/cart-context';
import { AppContent } from './App';

// Import modular design system stylesheets
import '@/styles/variables.css';
import '@/styles/main.css';
import '@/styles/admin.css';
import '@/styles/b2b.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <I18nProvider>
        <RouterProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </RouterProvider>
      </I18nProvider>
    </React.StrictMode>
  );
}
