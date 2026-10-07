import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Package,
  Layers,
  FileText,
  Share2,
  Check,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';

interface ProductDetailPageProps {
  onOpenQuote: (productName?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onOpenQuote }) => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(slug);
        setProduct(data);
        setActiveImage(data.image);

        // Fetch related products in the same category
        const all = await api.getProducts({ category: data.category });
        setRelatedProducts(all.filter((p) => p.id !== data.id).slice(0, 3));
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-24 text-center max-w-7xl mx-auto px-4">
        <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Завантаження специфікації товару...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-36 pb-24 text-center max-w-lg mx-auto px-4 space-y-4">
        <Package className="w-16 h-16 text-slate-600 mx-auto" />
        <h2 className="text-2xl font-bold font-heading text-white">Товар не знайдено</h2>
        <p className="text-slate-400 text-sm">
          Можливо, позицію було переміщено або знято з виробництва.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-black font-bold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Повернутися до каталогу</span>
        </Link>
      </div>
    );
  }

  const galleryImages = [
    product.image,
    ...(product.gallery || []).filter((g) => g !== product.image)
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-emerald-400 transition-colors">
          Головна
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/catalog" className="hover:text-emerald-400 transition-colors">
          Каталог товарів
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-semibold truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* 2. Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visuals & Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Photo Display */}
          <div className="relative aspect-square sm:aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="text-xs font-bold text-slate-200 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-lg uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 border-2 shrink-0 transition-all ${
                    activeImage === imgUrl
                      ? 'border-emerald-400 scale-95 shadow-lg shadow-emerald-500/20'
                      : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Quality & Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">Гаряче пресування 500Т</p>
                <p className="text-slate-400">Монолітна вулканізація</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">ДСТУ ISO 9001:2015</p>
                <p className="text-slate-400">Заводська гарантія якості</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Specs & Order Button */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-md">
                Промислова серія MAG
              </span>
              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs"
                title="Поділитися посиланням"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Скопійовано!' : 'Поділитися'}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white mt-3 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Short description callout */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300 text-sm leading-relaxed">
            {product.short_desc}
          </div>

          {/* Action CTA Block */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Виготовлення під замовлення
                </p>
                <p className="text-base font-extrabold text-white">
                  Оптовий прорахунок вартості
                </p>
              </div>
              <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                Партії від 1 шт.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onOpenQuote(product.name)}
                className="flex-1 py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Замовити розрахунок на цей товар</span>
              </button>

              <Link
                to="/contacts"
                className="py-3.5 px-5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center"
              >
                <span>Контакти комерційного відділу</span>
              </Link>
            </div>
          </div>

          {/* Technical Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Технічні характеристики виробу:</span>
              </h3>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/50">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody>
                    {product.specs.map((spec, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-slate-900/80' : 'bg-slate-950/60'}
                      >
                        <td className="py-3 px-4 text-slate-400 font-medium border-b border-slate-850 w-1/2">
                          {spec.label}
                        </td>
                        <td className="py-3 px-4 text-white font-semibold border-b border-slate-850">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Detailed Description Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold font-heading text-white">
          Повний опис та інженерні особливості
        </h2>
        <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
          {product.description}
        </div>
      </div>

      {/* 4. Related Products in the same category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-heading text-white">
              Інші вироби в категорії «{product.category}»
            </h3>
            <Link
              to="/catalog"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Всі товари →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={`/catalog/${rel.slug || rel.id}`}
                className="group bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all flex flex-col"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-950">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {rel.short_desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
