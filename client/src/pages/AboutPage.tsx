import React, { useState, useEffect } from 'react';
import {
  Factory,
  Recycle,
  ShieldCheck,
  Award,
  ChevronRight,
  Maximize2,
  X,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { AboutSettings } from '../types';

interface AboutPageProps {
  onOpenQuote: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenQuote }) => {
  const [content, setContent] = useState<AboutSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await api.getAboutContent();
        setContent(data);
      } catch (err) {
        console.error('Error fetching about page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const about = content || {
    heading: "Завод MAG: Новий стандарт переробки та пресування гуми",
    subheading: "Відповідальне споживання, безвідходне виробництво та інженерна точність у кожному виробі.",
    history: "Завод «MAG» заснований як сучасне виробниче підприємство закритого циклу. Ми не просто утилізуємо шини — ми повертаємо цінний полімерний ресурс у важку промисловість України.\n\nЗавдяки новітнім дробильним установкам та потужним гідравлічним пресам із зусиллям до 500 тонн, ми отримуємо гумові вироби найвищої щільності та стійкості, що в рази перевершують традиційне дерево або бетон.",
    mission: "Створення замкнутої циркулярної економіки: захистити довкілля від звалищ покришок та забезпечити промисловість України надійними ударостійкими гумотехнічними виробами.",
    stats: [
      { label: "Річна потужність переробки", value: "15 000 т" },
      { label: "Площа виробничих цехів", value: "4 800 м²" },
      { label: "Максимальне зусилля пресів", value: "500 т" },
      { label: "Власна лабораторія контролю якості", value: "ISO 9001" }
    ],
    steps: [
      {
        num: "01",
        title: "Прийом та радіологічний контроль",
        text: "Вхідне сканування шин на відсутність сторонніх включень, радіаційний контроль та сортування за типом корду."
      },
      {
        num: "02",
        title: "Багатоступеневе шредування",
        text: "Подрібнення покришок на масивних роторних шредерах до стану гумових чіпсів без термічного розпаду полімеру."
      },
      {
        num: "03",
        title: "Магнітна та повітряна сепарація",
        text: "Вилучення до 99.9% сталевого корду неодимовими магнітними барабанами та видалення текстилю циклонними фільтрами."
      },
      {
        num: "04",
        title: "Впресування сталевих закладних",
        text: "Точне позиціонування металевих пластин, каркасів та шпильок у прес-формі перед подачею гумової маси."
      },
      {
        num: "05",
        title: "Вулканізація під тиском 500 тонн",
        text: "Гаряче запікання при контрольованій температурі. Утворення монолітної структури високої густини без внутрішніх порожнин."
      }
    ],
    certifications: [
      "Державний стандарт якості ДСТУ ISO 9001:2015",
      "Офіційний дозвіл Міністерства захисту довкілля на поводження з небезпечними відходами",
      "Сертифікат санітарно-епідеміологічної безпеки продукції",
      "Протоколи випробувань на межу міцності та стирання Інституту електрозварювання ім. Патона"
    ],
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
    ]
  };

  return (
    <div className="pt-28 pb-20 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. HEADER SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Factory className="w-3.5 h-3.5" />
          <span>Про підприємство MAG</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          {about.heading}
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          {about.subheading}
        </p>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {about.stats?.map((st, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-1 hover:border-emerald-500/40 transition-colors"
          >
            <div className="text-3xl sm:text-4xl font-black font-heading text-gradient-emerald">
              {st.value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-400">
              {st.label}
            </div>
          </div>
        ))}
      </div>

      {/* 3. STORY & MISSION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-500/20">
              Наша історія
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Виробництво повного циклу в Україні
            </h2>
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
              {about.history}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Власні виробничі потужності у Києві. Приймання сировини та відвантаження продукції 6 днів на тиждень.</span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Recycle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">
              Екологічна місія заводу MAG
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {about.mission}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase text-emerald-400 font-heading">
              Що ми вилучаємо з шини:
            </span>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Гумова крихта (рециклінг):</span>
                <span className="font-bold text-white">70 - 75%</span>
              </div>
              <div className="flex justify-between">
                <span>Високолегований сталевий корд:</span>
                <span className="font-bold text-white">15 - 20%</span>
              </div>
              <div className="flex justify-between">
                <span>Текстильне волокно (кордна нитка):</span>
                <span className="font-bold text-white">5 - 10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TECHNOLOGICAL CYCLE (5 STEPS) */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-500/20">
            Технологія
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-white">
            5 етапів виробничого процесу MAG
          </h2>
          <p className="text-slate-400 text-sm">
            Від відпрацьованої покришки до сертифікованого гумово-металевого виробу надвисокої міцності.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {about.steps?.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 transition-all relative flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl font-black font-heading text-emerald-500/40 group-hover:text-emerald-400 transition-colors">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold font-heading text-white mt-2 group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. QUALITY ASSURANCE & CERTIFICATIONS */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 tracking-wider">
              <Award className="w-4 h-4" />
              <span>Контроль якості</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1">
              Державні стандарти та сертифікація
            </h2>
          </div>
          <button
            onClick={onOpenQuote}
            className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shrink-0"
          >
            <span>Запитати сертифікати якості</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {about.certifications?.map((cert, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-950/60 border border-slate-850 text-xs sm:text-sm text-slate-200"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FACTORY PHOTO GALLERY */}
      {about.gallery && about.gallery.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-md border border-emerald-500/20">
                Фотогалерея
              </span>
              <h2 className="text-2xl font-bold font-heading text-white mt-2">
                Виробничі цехи та устаткування заводу
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {about.gallery.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setPreviewImage(imgUrl)}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all"
              >
                <img
                  src={imgUrl}
                  alt={`MAG Plant Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 bg-slate-900/90 rounded-full text-emerald-400 border border-emerald-500/30 shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Enlarged photo"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
