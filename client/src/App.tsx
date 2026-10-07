import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QuickQuoteModal } from './components/QuickQuoteModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ContactsPage } from './pages/ContactsPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Helper component to scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteProductName, setQuoteProductName] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleOpenQuote = (productName?: string) => {
    setQuoteProductName(productName || '');
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
    setQuoteProductName('');
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AuthProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {/* Global Toast Container */}
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

        {/* Global Quick Quote / Order Modal */}
        <QuickQuoteModal
          isOpen={quoteModalOpen}
          onClose={handleCloseQuote}
          productName={quoteProductName}
          onSuccessToast={(msg) => showToast(msg, 'success')}
        />

        {/* Public Header (hidden on /admin pages) */}
        {!isAdminRoute && <Navbar onOpenQuote={() => handleOpenQuote()} />}

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onOpenQuote={handleOpenQuote} />} />
            <Route path="/about" element={<AboutPage onOpenQuote={() => handleOpenQuote()} />} />
            <Route path="/catalog" element={<CatalogPage onOpenQuote={handleOpenQuote} />} />
            <Route path="/catalog/:slug" element={<ProductDetailPage onOpenQuote={handleOpenQuote} />} />
            <Route path="/contacts" element={<ContactsPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Public Footer (hidden on /admin pages) */}
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
}
