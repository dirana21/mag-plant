import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Layers,
  ShieldCheck,
  Recycle,
  Cpu,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Zap,
  Hammer
} from 'lucide-react';
import { IndustrialHeroCanvas } from '../components/IndustrialHeroCanvas';
import { api } from '../services/api';
import { HomeSettings, Product } from '../types';

interface HomePageProps {
  onOpenQuote: (productName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuote }) => {
  const [content, setContent] = useState<HomeSettings | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, prodRes] = await Promise.all([
          api.getHomeContent().catch(() => null),
          api.getProducts({ featured: true }).catch(() => [])
        ]);

        if (homeRes) setContent(homeRes);
        if (prodRes && prodRes.length > 0) {
          setFeaturedProducts(prodRes);
        } else {
          // If no featured, get all products limit to 4
          const allProds = await api.getProducts().catch(() => []);
          setFeaturedProducts(allProds.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Icon selector mapping
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Boxes': return <Boxes className="w-7 h-7 text-emerald-400" />;
      case 'Layers': return <Layers className="w-7 h-7 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-7 h-7 text-emerald-400" />;
      case 'Recycle': return <Recycle className="w-7 h-7 text-emerald-400" />;
      default: return <Cpu className="w-7 h-7 text-emerald-400" />;
    }
  };

  const hero = content?.hero || {
    badge: "ЕКОЛОГІЧНЕ ТА ВАЖКЕ ВИРОБНИЦТВО",
    title: "Переробка шин та виробництво надміцної гумотехніки",
    subtitle: "Завод MAG — повний технологічний цикл: від утилізації відпрацьованих покришок до гарячого пресування монолітних гумових блоків, палет та виробів з впресованими металевими вставками.",
    stats: [
      { value: "15 000+", label: "Тонн шин на рік", sub: "Обсяг переробки" },
      { value: "500 Т", label: "Зусилля пресів", sub: "Гідравлічні лінії" },
      { value: "100%", label: "Безвідходність", sub: "Повний рециклінг" },
      { value: "25+ років", label: "Експлуатації", sub: "Ресурс виробів" }
    ],
    ctaPrimaryText: "Каталог продукції",
    ctaSecondaryText: "Замовити розрахунок"
  };

  const services = content?.services || [];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION WITH INDUSTRIAL ANIMATION */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-12 overflow-hidden bg-[#0b0f17]">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{hero.badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-white leading-[1.1]">
                {hero.title.split('надміцної')[0]}
                <span className="text-gradient-emerald"> надміцної </span>
                {hero.title.split('надміцної')[1] || 'гумотехніки'}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="px-7 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95"
                >
                  <span>{hero.ctaPrimaryText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => onOpenQuote()}
                  className="px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex items-center gap-2 backdrop-blur-md active:scale-95"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>{hero.ctaSecondaryText}</span>
                </button>
              </div>

              {/* Key Quick Points */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
                {hero.stats?.map((stat, idx) => (
                  <div key={idx} className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 backdrop-blur-sm">
                    <div className="text-2xl font-black font-heading text-white text-gradient-emerald">
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-slate-300 mt-0.5 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Interactive Animation Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-700/40 via-emerald-500/20 to-slate-800/40 shadow-2xl overflow-hidden group">
                <div className="rounded-[22px] bg-[#0b0f17] overflow-hidden border border-slate-800/90 relative">
                  {/* The interactive canvas representing the tire recycling press */}
                  <IndustrialHeroCanvas />

                  {/* Corner branding watermark */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-wider text-slate-200 font-mono">
                      MAG TECH-SIMULATION v2.6
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE PRODUCTION DIRECTIONS (SERVICES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Виробничий комплекс</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            {content?.servicesIntro?.title || "Ключові напрями виробництва заводу MAG"}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {content?.servicesIntro?.subtitle || "Ми поєднуємо відновлювану сировину з важкими пресовими технологіями для створення продукції екстремальної витривалості."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="group relative bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {renderIcon(srv.icon)}
                  </div>
                  {srv.badge && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {srv.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold font-heading text-white mb-2.5 group-hover:text-emerald-400 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {srv.description}
                </p>
              </div>

              <button
                onClick={() => onOpenQuote(srv.title)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-black bg-slate-950 group-hover:bg-emerald-400 border border-slate-800 group-hover:border-emerald-400 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Замовити розрахунок</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (SQUARE CARDS GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Популярні позиції
            </span>
            <h2 className="text-3xl font-extrabold font-heading text-white mt-2">
              Продукція з каталогу заводу MAG
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Блочні гумові палети, віброгасники та плити з можливістю замовлення під індивідуальні параметри.
            </p>
          </div>

          <Link
            to="/catalog"
            className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-slate-900 border border-slate-800 hover:border-emerald-500/40 px-4 py-2.5 rounded-xl shrink-0"
          >
            <span>Переглянути весь каталог</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Square Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <Link
              key={p.id}
              to={`/catalog/${p.slug || p.id}`}
              className="group block bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col"
            >
              {/* Product Photo - Square aspect ratio as requested */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Category tag */}
                <span className="absolute top-3 left-3 text-[10px] font-bold text-slate-200 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {p.category}
                </span>

                {p.is_featured && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    ★ Топ
                  </span>
                )}
              </div>

              {/* Title & Short Details below image */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {p.short_desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    Детальні характеристики
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CUSTOM PRESSING & TOOLING BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/70 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          {/* Subtle decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-md">
                <Hammer className="w-3.5 h-3.5" />
                <span>Індивідуальне виробництво</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                {content?.techBanner?.title || "Потрібна нестандартна прес-форма або виріб за вашими кресленнями?"}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {content?.techBanner?.description || "Конструкторське бюро заводу MAG розробляє оснащення та прес-форми за вашими ТУ. Впресовуємо металеві деталі будь-якої складності безпосередньо у масив резини."}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenQuote("Індивідуальне виготовлення за кресленнями")}
                  className="px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Надіслати креслення на прорахунок</span>
                </button>

                <a
                  href={`tel:${content?.techBanner?.phone || '+380443904570'}`}
                  className="px-5 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-950/80 border border-slate-800 transition-colors flex items-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Консультація технолога: {content?.techBanner?.phone || '+38 (044) 390-45-70'}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-md space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Гарантії заводу MAG:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Відповідність ДСТУ та ISO 9001:2015</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Пресування із зусиллям до 500 тонн</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Монолітна адгезія метал-гума (Chemosil)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Повна екологічна документація</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
