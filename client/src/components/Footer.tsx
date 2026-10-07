import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Shield, Recycle, Award, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12 relative overflow-hidden">
      {/* Background glow element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-850">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img src="/logo.svg" alt="MAG Logo" className="w-7 h-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-2xl tracking-wider text-white">MAG</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                  Rubber Tech Plant
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Сучасний виробничий комплекс повного циклу: екологічна утилізація зношених шин, пресування монолітних гумових блоків та виготовлення армованих гумово-металевих виробів під ключ.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Recycle className="w-4 h-4 shrink-0" />
              <span>100% безвідходна переробка</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-heading">
              Розділи сайту
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Головна сторінка</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Про завод та технологію</span>
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Каталог продукції</span>
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Зв'язатися з нами / Контакти</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-500 hover:text-slate-300">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Панель адміністратора</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Products */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-heading">
              Виробнича номенклатура
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-slate-200 transition-colors">
                • Гумові блочні палети (Heavy Block)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                • Гумово-металеві буфери зі вставками
              </li>
              <li className="hover:text-slate-200 transition-colors">
                • Модульні плити ArmorFloor 1000x1000
              </li>
              <li className="hover:text-slate-200 transition-colors">
                • Причальні та рампові відбійники
              </li>
              <li className="hover:text-slate-200 transition-colors">
                • Гумова крихта високого очищення (0.8-2.5 мм)
              </li>
              <li className="hover:text-slate-200 transition-colors">
                • Виготовлення прес-форм за кресленнями
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Factory Address */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-heading">
              Комерційний відділ
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>м. Київ, вул. Промислова, 14 (Промзона «Корчувате»)</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+380443904570" className="hover:text-emerald-400 transition-colors">
                  +38 (044) 390-45-70
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:sales@mag-plant.com.ua" className="hover:text-emerald-400 transition-colors">
                  sales@mag-plant.com.ua
                </a>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Пн-Пт: 08:00 - 18:00 (Прийом шин: цілодобово 24/7)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} ТОВ «ЗАВОД МАГ». Всі права захищено.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Сертифіковано згідно ISO 9001:2015
            </span>
            <Link to="/admin" className="hover:text-emerald-400 transition-colors">
              Вхід для персоналу
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
