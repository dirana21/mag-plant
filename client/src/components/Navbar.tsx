import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Shield, ArrowRight, Cog } from 'lucide-react';

interface NavbarProps {
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Головна', path: '/' },
    { label: 'Про нас', path: '/about' },
    { label: 'Каталог товарів', path: '/catalog' },
    { label: 'Зв\'язатися з нами', path: '/contacts' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:border-emerald-500/60 transition-all shadow-inner overflow-hidden">
              <img src="/logo.svg" alt="MAG Logo" className="w-8 h-8 object-contain" />
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl tracking-wider text-white leading-none">
                MAG
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-emerald-400 uppercase mt-0.5">
                Завод переробки шин
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone quick call */}
            <a
              href="tel:+380443904570"
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+38 (044) 390-45-70</span>
            </a>

            {/* Quick Quote modal trigger */}
            <button
              onClick={onOpenQuote}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <span>Замовити розрахунок</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Admin entry link */}
            <Link
              to="/admin"
              title="Панель керування"
              className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
            >
              <Cog className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 focus:outline-none"
              aria-label="Перемикач меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-4 pb-6 space-y-3 mt-2 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-emerald-400 bg-emerald-950/50 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-3">
            <a
              href="tel:+380443904570"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-slate-200 font-medium text-sm border border-slate-800"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+38 (044) 390-45-70 (Відділ збуту)</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3.5 rounded-xl text-center font-bold text-black bg-emerald-400 hover:bg-emerald-300 transition-colors uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20"
            >
              Замовити розрахунок / Консультація
            </button>

            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-400 hover:text-emerald-400 text-xs font-medium"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Вхід в адмін-панель</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
