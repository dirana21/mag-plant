import React, { useState, useEffect } from 'react';
import { Save, Upload, Plus, Trash2, X } from 'lucide-react';
import { api } from '../../../services/api';
import { AboutSettings } from '../../../types';

interface AdminAboutTabProps {
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminAboutTab: React.FC<AdminAboutTabProps> = ({ onNotify }) => {
  const [data, setData] = useState<AboutSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const res = await api.getAboutContent();
      setData(res);
    } catch (err) {
      onNotify('Помилка завантаження даних сторінки Про нас', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    try {
      await api.updateAboutContent(data);
      onNotify('Інформацію про компанію успішно збережено!');
    } catch (err: any) {
      onNotify(err.message || 'Помилка збереження', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setUploadingGallery(true);
    try {
      const res = await api.uploadImage(file);
      setData({
        ...data,
        gallery: [...(data.gallery || []), res.url]
      });
      onNotify('Нове фото додано до галереї заводу!');
    } catch (err: any) {
      onNotify(err.message || 'Помилка завантаження фото', 'error');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    if (!data) return;
    const newGallery = data.gallery.filter((_, idx) => idx !== index);
    setData({ ...data, gallery: newGallery });
  };

  const addCertificate = () => {
    if (!data) return;
    setData({
      ...data,
      certifications: [...(data.certifications || []), 'Новий сертифікат або стандарт ДСТУ']
    });
  };

  const removeCertificate = (index: number) => {
    if (!data) return;
    const newC = data.certifications.filter((_, idx) => idx !== index);
    setData({ ...data, certifications: newC });
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Завантаження налаштувань сторінки Про нас...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">
            Редагування сторінки «Про нас»
          </h2>
          <p className="text-xs text-slate-400">
            Оновлюйте історію компанії, етапи технологічного циклу, стандарти та фото цехів.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Збереження...' : 'Зберегти зміни «Про нас»'}</span>
        </button>
      </div>

      {/* 1. Headings & Main Text */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          1. Загальна інформація та історія
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Головний заголовок сторінки</label>
          <input
            type="text"
            value={data.heading}
            onChange={(e) => setData({ ...data, heading: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Підзаголовок</label>
          <input
            type="text"
            value={data.subheading}
            onChange={(e) => setData({ ...data, subheading: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Історія та опис виробництва</label>
          <textarea
            rows={5}
            value={data.history}
            onChange={(e) => setData({ ...data, history: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Екологічна місія підприємства</label>
          <textarea
            rows={3}
            value={data.mission}
            onChange={(e) => setData({ ...data, mission: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
          />
        </div>
      </div>

      {/* 2. Technological Process Steps */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
          2. Етапи технологічного циклу (5 кроків)
        </h3>

        <div className="space-y-4">
          {data.steps?.map((st, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-850 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-1 text-center font-bold text-lg text-emerald-400 font-heading">
                {st.num}
              </div>
              <div className="sm:col-span-4">
                <label className="block text-[11px] text-slate-400 mb-1">Назва етапу</label>
                <input
                  type="text"
                  value={st.title}
                  onChange={(e) => {
                    const newSteps = [...data.steps];
                    newSteps[idx].title = e.target.value;
                    setData({ ...data, steps: newSteps });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                />
              </div>
              <div className="sm:col-span-7">
                <label className="block text-[11px] text-slate-400 mb-1">Детальний опис</label>
                <input
                  type="text"
                  value={st.text}
                  onChange={(e) => {
                    const newSteps = [...data.steps];
                    newSteps[idx].text = e.target.value;
                    setData({ ...data, steps: newSteps });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Standards and Certifications */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
            3. Сертифікати та стандарти якості
          </h3>
          <button
            type="button"
            onClick={addCertificate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Додати сертифікат</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {data.certifications?.map((cert, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <input
                type="text"
                value={cert}
                onChange={(e) => {
                  const newC = [...data.certifications];
                  newC[idx] = e.target.value;
                  setData({ ...data, certifications: newC });
                }}
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeCertificate(idx)}
                className="text-slate-500 hover:text-red-400 p-1"
                title="Видалити"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Factory Photo Gallery */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold font-heading text-emerald-400 uppercase tracking-wider">
              4. Фотогалерея заводу
            </h3>
            <p className="text-xs text-slate-400">
              Завантажуйте реальні фотографії цехів, шредерів та пресів.
            </p>
          </div>

          <label className="cursor-pointer px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>{uploadingGallery ? 'Завантаження...' : '+ Додати фото в галерею'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleGalleryUpload}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data.gallery?.map((img, idx) => (
            <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
              <img src={img} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Видалити фото"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
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
          <span>{saving ? 'Збереження...' : 'Зберегти всі зміни «Про нас»'}</span>
        </button>
      </div>
    </form>
  );
};
