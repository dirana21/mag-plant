import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Phone, Building, User, Mail, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  onSuccessToast?: (msg: string) => void;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  isOpen,
  onClose,
  productName = '',
  onSuccessToast
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    product_name: productName,
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (productName) {
      setFormData(prev => ({ ...prev, product_name: productName }));
    }
  }, [productName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Будь ласка, заповніть ваше ім\'я та контактний телефон');
      return;
    }

    setLoading(true);
    try {
      await api.submitInquiry(formData);
      setSubmitted(true);
      
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#38bdf8', '#ffffff']
        });
      } catch (_) {}

      if (onSuccessToast) {
        onSuccessToast('Ваша заявка успішно надіслана до комерційного відділу MAG!');
      }

      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', phone: '', email: '', company: '', product_name: '', message: '' });
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Помилка при відправці заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">
              Заявку прийнято!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Інженер комерційного відділу заводу MAG вже отримав ваш запит і зателефонує вам для узгодження параметрів та розрахунку вартості.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                Комерційний відділ
              </span>
              <h3 className="text-2xl font-bold font-heading text-white mt-2">
                {productName ? `Запит на: ${productName}` : 'Замовити розрахунок або послугу'}
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Заповніть форму — розрахуємо партію, виготовлення прес-форми або вартість утилізації за 15 хвилин.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 text-red-200 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ваше ім'я / Представник компанії <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Наприклад: Віталій або ТОВ 'Логістик'"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Контактний телефон <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+38 (0__) ___-__-__"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email для КП (необов'язково)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="info@company.ua"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Компанія або підприємство
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Назва компанії"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Деталі замовлення / Кількість / Питання
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Опишіть потрібну кількість блоків, палет, розміри або питання щодо утилізації шин..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Надсилаємо...' : 'Відправити запит на прорахунок'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                🔒 Ваші дані захищені. Ми використовуємо їх виключно для надання комерційної пропозиції.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
