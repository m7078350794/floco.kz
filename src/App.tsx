import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToastContainer from '@/components/ui/Toast';
import { CartDrawerProvider } from '@/components/cart/CartDrawerProvider';
import CartDrawer from '@/components/cart/CartDrawer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AdminPage from '@/pages/AdminPage';
import ContactsPage from '@/pages/ContactsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import { useSettingsStore } from '@/store/settingsStore';
import { useProductStore } from '@/store/productStore';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadProducts = useProductStore((s) => s.loadProducts);

  useEffect(() => {
    loadSettings();
    loadProducts();
  }, [loadSettings, loadProducts]);

  return (
    <CartDrawerProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow page-transition">
          <AppRoutes />
        </main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
      </div>
    </CartDrawerProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
