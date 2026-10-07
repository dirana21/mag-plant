import React, { useState, useEffect } from 'react';
import { Save, Upload, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';
import { HomeSettings } from '../../../types';

interface AdminHomeTabProps {
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminHomeTab: React.FC<AdminHomeTabProps> = ({ onNotify }) => {
  const [data, setData] = useState<HomeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const res = await api.getHomeContent();
      setData(res);
    } catch (err) {
      onNotify('Помилка завантаження даних головної сторінки', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    try {
      await api.updateHomeContent(data);
      onNotify('Зміни на Головній сторінці успішно збережено!');
    } catch (err: any) {
      onNotify(err.message || 'Помилка збереження', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleServiceImageUpload = async (file: File, index: number) => {
    setUploadingIdx(index);
    try {
      const res = await api.uploadImage(file);
      const updatedServices = [...data!.services];
      updatedServices[index].image = res.url;
      setData({ ...data!, services: updatedServices });
      onNotify('Фото послуги завантажено успішно!');
    } catch (err: any) {
      onNotify(err.message || 'Помилка завантаження фото', 'error');
    } finally {
      setUploadingIdx(null);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Завантаження налаштувань Головної сторінки...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">
            Редагування Головної сторінки
          </h2>
          <p className="text-xs text-slate-400">
            Змінюйте тексти першого екрану, ключові цифри, описи послуг та банери.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Збереження...' : 'Зберегти зміни'}</span>
        </button>
      </div>

      {/* 1. Hero Block */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          1. Перший екран (Hero секція)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Верхній бейдж (слоган)
            </label>
            <input
              type="text"
              value={data.hero.badge}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Головний заголовок сайту
            </label>
            <input
              type="text"
              value={data.hero.title}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Підзаголовок / Опис заводу
            </label>
            <textarea
              rows={3}
              value={data.hero.subtitle}
              onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Текст головної кнопки (Каталог)
              </label>
              <input
                type="text"
                value={data.hero.ctaPrimaryText}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaPrimaryText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Текст другої кнопки (Замовити дзвінок)
              </label>
              <input
                type="text"
                value={data.hero.ctaSecondaryText}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaSecondaryText: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Stats */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          2. Ключові цифри та показники (4 блоки)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.hero.stats?.map((st, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Блок {idx + 1}</span>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Число / Значення</label>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => {
                    const newStats = [...data.hero.stats];
                    newStats[idx].value = e.target.value;
                    setData({ ...data, hero: { ...data.hero, stats: newStats } });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Підпис</label>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => {
                    const newStats = [...data.hero.stats];
                    newStats[idx].label = e.target.value;
                    setData({ ...data, hero: { ...data.hero, stats: newStats } });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Services / Production Directions */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
            3. Ключові напрями виробництва
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Заголовок розділу напрямів</label>
              <input
                type="text"
                value={data.servicesIntro.title}
                onChange={(e) => setData({ ...data, servicesIntro: { ...data.servicesIntro, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Опис розділу напрямів</label>
              <input
                type="text"
                value={data.servicesIntro.subtitle}
                onChange={(e) => setData({ ...data, servicesIntro: { ...data.servicesIntro, subtitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {data.services?.map((srv, idx) => (
            <div key={srv.id || idx} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Напрям #{idx + 1}: {srv.title}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Іконка: {srv.icon}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Назва напряму</label>
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => {
                        const newS = [...data.services];
                        newS[idx].title = e.target.value;
                        setData({ ...data, services: newS });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Опис</label>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => {
                        const newS = [...data.services];
                        newS[idx].description = e.target.value;
                        setData({ ...data, services: newS });
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-slate-400 mb-1">Фото або банер</label>
                  {srv.image && (
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-24 object-cover rounded-lg border border-slate-800"
                    />
                  )}
                  <label className="cursor-pointer block text-center py-2 px-3 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 rounded-lg border border-slate-800 transition-colors">
                    {uploadingIdx === idx ? 'Завантаження...' : 'Змінити фото (файл)'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleServiceImageUpload(e.target.files[0], idx);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Tech & Custom Orders Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          4. Банер індивідуального виготовлення
        </h3>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Заголовок банера</label>
          <input
            type="text"
            value={data.techBanner.title}
            onChange={(e) => setData({ ...data, techBanner: { ...data.techBanner, title: e.target.value } })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Опис банера</label>
          <textarea
            rows={2}
            value={data.techBanner.description}
            onChange={(e) => setData({ ...data, techBanner: { ...data.techBanner, description: e.target.value } })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Контактний телефон технолога</label>
          <input
            type="text"
            value={data.techBanner.phone}
            onChange={(e) => setData({ ...data, techBanner: { ...data.techBanner, phone: e.target.value } })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
          />
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
          <span>{saving ? 'Збереження...' : 'Зберегти всі зміни на Головній'}</span>
        </button>
      </div>
    </form>
  );
};
