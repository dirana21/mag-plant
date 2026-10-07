import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home,
  Info,
  Package,
  Phone,
  Mail,
  Shield,
  ExternalLink,
  LogOut,
  User,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, ToastMessage } from '../../components/Toast';
import { AdminHomeTab } from './tabs/AdminHomeTab';
import { AdminAboutTab } from './tabs/AdminAboutTab';
import { AdminCatalogTab } from './tabs/AdminCatalogTab';
import { AdminContactsTab } from './tabs/AdminContactsTab';
import { AdminInquiriesTab } from './tabs/AdminInquiriesTab';
import { AdminSecurityTab } from './tabs/AdminSecurityTab';

type AdminTab = 'home' | 'about' | 'catalog' | 'contacts' | 'inquiries' | 'security';

export const AdminDashboard: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  const notify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'home' as AdminTab, label: 'Головна', icon: <Home className="w-4 h-4" /> },
    { id: 'about' as AdminTab, label: 'Про нас', icon: <Info className="w-4 h-4" /> },
    { id: 'catalog' as AdminTab, label: 'Каталог товарів', icon: <Package className="w-4 h-4" /> },
    { id: 'contacts' as AdminTab, label: 'Контакти та Карта', icon: <Phone className="w-4 h-4" /> },
    { id: 'inquiries' as AdminTab, label: 'Заявки з сайту', icon: <Mail className="w-4 h-4" /> },
    { id: 'security' as AdminTab, label: 'Безпека', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Admin Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img src="/logo.svg" alt="MAG Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-heading font-black text-xl text-white tracking-wider">MAG</span>
            </Link>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
              CMS Панель
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Переглянути сайт</span>
            </a>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 text-xs text-slate-400">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">{user.username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              title="Вийти з системи"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2 border-t border-slate-900">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-emerald-400 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && <AdminHomeTab onNotify={notify} />}
        {activeTab === 'about' && <AdminAboutTab onNotify={notify} />}
        {activeTab === 'catalog' && <AdminCatalogTab onNotify={notify} />}
        {activeTab === 'contacts' && <AdminContactsTab onNotify={notify} />}
        {activeTab === 'inquiries' && <AdminInquiriesTab onNotify={notify} />}
        {activeTab === 'security' && <AdminSecurityTab onNotify={notify} />}
      </main>
    </div>
  );
};
