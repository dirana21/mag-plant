import React, { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Mail, Building, FileText } from 'lucide-react';
import { api } from '../../../services/api';
import { ContactsSettings } from '../../../types';

interface AdminContactsTabProps {
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminContactsTab: React.FC<AdminContactsTabProps> = ({ onNotify }) => {
  const [data, setData] = useState<ContactsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContactsData();
  }, []);

  const loadContactsData = async () => {
    try {
      const res = await api.getContactsContent();
      setData(res);
    } catch (err) {
      onNotify('Помилка завантаження контактів', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    try {
      await api.updateContactsContent(data);
      onNotify('Контактну інформацію та реквізити успішно збережено!');
    } catch (err: any) {
      onNotify(err.message || 'Помилка збереження', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Завантаження налаштувань контактів...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">
            Редагування контактів та карти
          </h2>
          <p className="text-xs text-slate-400">
            Оновлюйте телефони відділів збуту, адресу заводу, координати карти та банківські реквізити.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Збереження...' : 'Зберегти зміни контактів'}</span>
        </button>
      </div>

      {/* 1. General Factory Address & Logistics */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          1. Адреса та графік роботи заводу
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Повна назва компанії</label>
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => setData({ ...data, companyName: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Фактична адреса заводу</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Орієнтир для вантажівок / Логістика</label>
            <input
              type="text"
              value={data.landmark}
              onChange={(e) => setData({ ...data, landmark: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Графік роботи та прийому шин</label>
          <input
            type="text"
            value={data.schedule}
            onChange={(e) => setData({ ...data, schedule: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
          />
        </div>

        {/* Map Coordinates */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3">
          <span className="text-xs font-bold text-slate-200">
            Географічні координати для інтерактивної карти
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Широта (Latitude)</label>
              <input
                type="number"
                step="0.0001"
                value={data.coordinates?.lat || 50.3660}
                onChange={(e) => setData({
                  ...data,
                  coordinates: { ...data.coordinates, lat: parseFloat(e.target.value) || 0 }
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Довгота (Longitude)</label>
              <input
                type="number"
                step="0.0001"
                value={data.coordinates?.lng || 30.5600}
                onChange={(e) => setData({
                  ...data,
                  coordinates: { ...data.coordinates, lng: parseFloat(e.target.value) || 0 }
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Масштаб карти за замовчуванням</label>
              <input
                type="number"
                min="1"
                max="18"
                value={data.coordinates?.zoom || 15}
                onChange={(e) => setData({
                  ...data,
                  coordinates: { ...data.coordinates, zoom: parseInt(e.target.value) || 15 }
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Commercial Department */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          2. Комерційний відділ (Продаж продукції)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Телефон №1 (багатоканальний)</label>
            <input
              type="text"
              value={data.commercialDepartment.phone1}
              onChange={(e) => setData({
                ...data,
                commercialDepartment: { ...data.commercialDepartment, phone1: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Телефон №2 (мобільний)</label>
            <input
              type="text"
              value={data.commercialDepartment.phone2}
              onChange={(e) => setData({
                ...data,
                commercialDepartment: { ...data.commercialDepartment, phone2: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email комерційного відділу</label>
            <input
              type="email"
              value={data.commercialDepartment.email}
              onChange={(e) => setData({
                ...data,
                commercialDepartment: { ...data.commercialDepartment, email: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Контактна особа / Керівник відділу</label>
            <input
              type="text"
              value={data.commercialDepartment.contactPerson}
              onChange={(e) => setData({
                ...data,
                commercialDepartment: { ...data.commercialDepartment, contactPerson: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Recycling & Raw Material Reception Department */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold font-heading text-cyan-400 uppercase tracking-wider">
          3. Відділ утилізації та прийому шин
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Телефон прийому шин</label>
            <input
              type="text"
              value={data.recyclingDepartment.phone}
              onChange={(e) => setData({
                ...data,
                recyclingDepartment: { ...data.recyclingDepartment, phone: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email відділу утилізації</label>
            <input
              type="email"
              value={data.recyclingDepartment.email}
              onChange={(e) => setData({
                ...data,
                recyclingDepartment: { ...data.recyclingDepartment, email: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Головний технолог / Відповідальний</label>
            <input
              type="text"
              value={data.recyclingDepartment.contactPerson}
              onChange={(e) => setData({
                ...data,
                recyclingDepartment: { ...data.recyclingDepartment, contactPerson: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Official Requisites */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          4. Юридичні та банківські реквізити (ПДВ)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Код ЄДРПОУ</label>
            <input
              type="text"
              value={data.requisites.edrpou}
              onChange={(e) => setData({
                ...data,
                requisites: { ...data.requisites, edrpou: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Індивідуальний податковий номер (ІПН)</label>
            <input
              type="text"
              value={data.requisites.ipn}
              onChange={(e) => setData({
                ...data,
                requisites: { ...data.requisites, ipn: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Рахунок у форматі IBAN</label>
            <input
              type="text"
              value={data.requisites.iban}
              onChange={(e) => setData({
                ...data,
                requisites: { ...data.requisites, iban: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Назва обслуговуючого банку</label>
            <input
              type="text"
              value={data.requisites.bank}
              onChange={(e) => setData({
                ...data,
                requisites: { ...data.requisites, bank: e.target.value }
              })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-4 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Збереження...' : 'Зберегти всі контакти'}</span>
        </button>
      </div>
    </form>
  );
};
