import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building, Calendar, Trash2, CheckCircle2, Clock, Search, Filter } from 'lucide-react';
import { api } from '../../../services/api';
import { Inquiry } from '../../../types';

interface AdminInquiriesTabProps {
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({ onNotify }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await api.getInquiries();
      setInquiries(data);
    } catch (err) {
      onNotify('Помилка завантаження заявок', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.updateInquiryStatus(id, newStatus);
      onNotify('Статус заявки оновлено');
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus as any } : inq));
    } catch (err: any) {
      onNotify(err.message || 'Помилка оновлення статусу', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити цю заявку?')) return;
    try {
      await api.deleteInquiry(id);
      onNotify('Заявку видалено');
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (err: any) {
      onNotify(err.message || 'Помилка видалення заявки', 'error');
    }
  };

  const filtered = inquiries.filter(inq => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inq.name.toLowerCase().includes(q) ||
      inq.phone.toLowerCase().includes(q) ||
      (inq.company && inq.company.toLowerCase().includes(q)) ||
      (inq.product_name && inq.product_name.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>Нова заявка</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <span>В обробці</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Завершено</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span>Скасовано</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">
            Заявки та запити клієнтів з сайту
          </h2>
          <p className="text-xs text-slate-400">
            Усі вхідні контакти з форми зв'язку та модального вікна прорахунку вартості.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Всього заявок: <strong className="text-white">{inquiries.length}</strong>
          </span>
          <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
            Нових: {inquiries.filter(i => i.status === 'new').length}
          </span>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Пошук за ім'ям, номером телефону або компанією..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Статус:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="all">Усі заявки</option>
            <option value="new">Нові</option>
            <option value="in_progress">В обробці</option>
            <option value="completed">Завершені</option>
            <option value="cancelled">Скасовані</option>
          </select>
        </div>
      </div>

      {/* Inquiries list */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Завантаження заявок...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
          Заявок за вказаними критеріями не знайдено.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={`p-5 rounded-2xl border transition-all ${
                inq.status === 'new'
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(inq.status)}

                  <span className="font-bold text-sm text-white">
                    {inq.name}
                  </span>

                  {inq.company && (
                    <span className="text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>{inq.company}</span>
                    </span>
                  )}

                  {inq.product_name && (
                    <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      Товар: {inq.product_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(inq.created_at).toLocaleString('uk-UA')}</span>
                  </span>

                  <button
                    onClick={() => handleDelete(inq.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    title="Видалити заявку"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8 space-y-2">
                  <div className="flex flex-wrap gap-4 text-xs">
                    <a
                      href={`tel:${inq.phone}`}
                      className="font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{inq.phone}</span>
                    </a>

                    {inq.email && (
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
                      >
                        <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{inq.email}</span>
                      </a>
                    )}
                  </div>

                  {inq.message && (
                    <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-850 whitespace-pre-wrap leading-relaxed">
                      {inq.message}
                    </p>
                  )}
                </div>

                {/* Status selector */}
                <div className="sm:col-span-4 flex sm:justify-end items-center gap-2">
                  <label className="text-xs text-slate-400">Змінити статус:</label>
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="new">Нова</option>
                    <option value="in_progress">В обробці</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Скасована</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
