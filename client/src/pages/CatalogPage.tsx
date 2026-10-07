import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Package, Check, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';

interface CatalogPageProps {
  onOpenQuote: (productName?: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onOpenQuote }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Всі');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'Всі',
    'Гумові палети та блоки',
    'Гумово-металеві вироби',
    'Плити та покриття',
    'Гумова крихта та гранулят'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory !== 'Всі' ? selectedCategory : undefined,
      });
      setProducts(data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter in client by search query
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.short_desc.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Package className="w-3.5 h-3.5" />
          <span>Каталог продукції заводу MAG</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
          Вироби з пресованої гуми та металу
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Всі позиції виготовляються на гідравлічних лініях під тиском до 500 тонн. Оберіть товар для перегляду креслень, характеристик та сертифікатів.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 font-bold scale-105'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Пошук за назвою або параметром..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white"
            >
              Очистити
            </button>
          )}
        </div>
      </div>

      {/* Grid of Square Products */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span>Завантаження каталогу товарів...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4">
          <Package className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white font-heading">
            За вашим запитом нічого не знайдено
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Спробуйте змінити категорію або звернутися до нас для виготовлення нестандартного виробу за вашими кресленнями.
          </p>
          <button
            onClick={() => onOpenQuote("Нестандартне замовлення з каталогу")}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 transition-colors"
          >
            Замовити прорахунок за кресленням
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              to={`/catalog/${p.slug || p.id}`}
              className="group bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col"
            >
              {/* Product Photo: Strict Square Aspect Ratio as requested */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity" />

                {/* Category badge on image */}
                <span className="absolute top-3 left-3 text-[10px] font-bold text-slate-200 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {p.category}
                </span>

                {p.is_featured && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400 bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 px-2 py-0.5 rounded-md">
                    ★ Топ позиція
                  </span>
                )}
              </div>

              {/* Title cleanly below the square photo */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {p.short_desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Переглянути опис</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Завод MAG
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom Custom Manufacturing Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400 tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Індивідуальна вулканізація</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Не знайшли потрібний розмір або конфігурацію закладних?
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Виготовимо дослідний зразок або серійну партію виробів за вашими ТУ та кресленнями.
          </p>
        </div>

        <button
          onClick={() => onOpenQuote("Індивідуальне замовлення за кресленнями")}
          className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
        >
          Замовити консультацію інженера
        </button>
      </div>
    </div>
  );
};
