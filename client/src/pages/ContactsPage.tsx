import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  Send,
  CheckCircle2,
  AlertCircle,
  Truck,
  FileText,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { ContactsSettings } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';

export const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactsSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Contact form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    product_name: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await api.getContactsContent();
        setContacts(data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg('Будь ласка, введіть ваше ім\'я та контактний телефон');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry(form);
      setSuccessMsg(res.message || 'Дякуємо! Ваша заявка передана в комерційний відділ заводу MAG.');
      
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#10b981', '#34d399', '#38bdf8']
        });
      } catch (_) {}

      setForm({ name: '', phone: '', email: '', company: '', product_name: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Помилка при відправці форми. Спробуйте зв\'язатися з нами телефоном.');
    } finally {
      setSubmitting(false);
    }
  };

  const defaultContacts: ContactsSettings = {
    companyName: "ТОВ «ЗАВОД ПЕРЕРОБКИ ШИН ТА ГУМОТЕХНІКИ МАГ»",
    address: "Україна, м. Київ, вул. Промислова, 14",
    landmark: "Промзона «Корчувате», зручний заїзд для вантажного транспорту",
    schedule: "Понеділок — П'ятниця: 08:00 — 18:00. Прийом шин на утилізацію: 24/7 цілодобово.",
    commercialDepartment: {
      title: "Комерційний відділ (Замовлення продукції)",
      phone1: "+38 (044) 390-45-70",
      phone2: "+38 (067) 540-22-11",
      email: "sales@mag-plant.com.ua",
      contactPerson: "Олександр Коваленко (Керівник збуту)"
    },
    recyclingDepartment: {
      title: "Відділ прийому сировини та утилізації шин",
      phone: "+38 (050) 880-33-44",
      email: "eco@mag-plant.com.ua",
      contactPerson: "Сергій Мельник (Головний технолог)"
    },
    coordinates: {
      lat: 50.3660,
      lng: 30.5600,
      zoom: 15
    },
    requisites: {
      edrpou: "41893201",
      ipn: "418932026551",
      iban: "UA543052990000026001234567890",
      bank: "АТ КБ «ПриватБанк»"
    }
  };

  const data = contacts || defaultContacts;

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-3.5 h-3.5" />
          <span>Контакти комерційного відділу та заводу</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          Зв'язатися з заводом MAG
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Прямий зв'язок з відділом збуту, лабораторією та пунктом приймання шин на утилізацію.
        </p>
      </div>

      {/* 2. Direct Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Commercial Department */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-7 space-y-5 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Продаж та замовлення
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                {data.commercialDepartment.title}
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="space-y-1">
                <a href={`tel:${data.commercialDepartment.phone1}`} className="block text-white font-bold hover:text-emerald-400 transition-colors">
                  {data.commercialDepartment.phone1}
                </a>
                <a href={`tel:${data.commercialDepartment.phone2}`} className="block text-slate-300 text-xs hover:text-emerald-400 transition-colors">
                  {data.commercialDepartment.phone2}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`mailto:${data.commercialDepartment.email}`} className="text-slate-300 hover:text-emerald-400 transition-colors">
                {data.commercialDepartment.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <User className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{data.commercialDepartment.contactPerson}</span>
            </div>
          </div>
        </div>

        {/* Recycling & Raw Materials Reception */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-7 space-y-5 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Утилізація шин
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                {data.recyclingDepartment.title}
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <a href={`tel:${data.recyclingDepartment.phone}`} className="text-white font-bold hover:text-cyan-400 transition-colors">
                {data.recyclingDepartment.phone}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <a href={`mailto:${data.recyclingDepartment.email}`} className="text-slate-300 hover:text-cyan-400 transition-colors">
                {data.recyclingDepartment.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <User className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{data.recyclingDepartment.contactPerson}</span>
            </div>
          </div>
        </div>

        {/* Plant Address & Logistics */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-7 space-y-5 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Локація цехів
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                Адреса та графік роботи
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-white font-medium">{data.address}</span>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{data.schedule}</span>
            </div>

            <div className="text-xs text-emerald-400 font-semibold pt-2 border-t border-slate-800">
              ✓ {data.landmark}
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE MAP SECTION (as explicitly required) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-500/20">
              Карта розташування
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-2">
              Завод MAG на карті
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Координати: {data.coordinates.lat}, {data.coordinates.lng}
          </span>
        </div>

        {/* Leaflet map component with custom marker */}
        <InteractiveMap
          lat={data.coordinates.lat}
          lng={data.coordinates.lng}
          address={data.address}
          companyName={data.companyName}
        />
      </div>

      {/* 4. Contact / Inquiry Form and Legal Requisites */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Зворотний зв'язок
            </span>
            <h3 className="text-2xl font-bold font-heading text-white mt-1">
              Надіслати запит або креслення інженерам
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Залиште заявку — ми зробимо технічний прорахунок та надішлемо КП протягом 15 хвилин.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 text-sm rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Ваше ім'я <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Олександр"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Контактний телефон <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+38 (0__) ___-__-__"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="info@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Назва підприємства
                </label>
                <input
                  type="text"
                  placeholder="ТОВ або ФОП"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Повідомлення / Специфікація замовлення
              </label>
              <textarea
                rows={4}
                placeholder="Вкажіть необхідну номенклатуру, кількість, технічні вимоги чи питання..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Надсилання...' : 'Надіслати запит до комерційного відділу'}</span>
            </button>
          </form>
        </div>

        {/* Right: Legal & Banking Requisites */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Офіційна інформація
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                Юридичні та банківські реквізити
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-xs">Повна юридична назва:</span>
              <span className="text-white font-semibold">{data.companyName}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-slate-400 block text-xs">Код ЄДРПОУ:</span>
                <span className="text-white font-mono font-bold">{data.requisites.edrpou}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                <span className="text-slate-400 block text-xs">ІПН платника ПДВ:</span>
                <span className="text-white font-mono font-bold">{data.requisites.ipn}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-xs">Розрахунковий рахунок (IBAN):</span>
              <span className="text-white font-mono font-bold break-all">{data.requisites.iban}</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-xs">Обслуговуючий банк:</span>
              <span className="text-white font-semibold">{data.requisites.bank}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
            Працюємо з юридичними та фізичними особами з ПДВ. Надаємо повний пакет бухгалтерських та екологічних документів (акти приймання-передачі відходів, ТТН, податкові накладні).
          </p>
        </div>
      </div>
    </div>
  );
};
