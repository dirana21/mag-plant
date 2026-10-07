import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  Search,
  Package,
  Check,
  Star,
  ExternalLink,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { api } from '../../../services/api';
import { Product, ProductSpec } from '../../../types';

interface AdminCatalogTabProps {
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminCatalogTab: React.FC<AdminCatalogTabProps> = ({ onNotify }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const defaultCategories = [
    'Гумові палети та блоки',
    'Гумово-металеві вироби',
    'Плити та покриття',
    'Гумова крихта та гранулят'
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      onNotify('Помилка завантаження списку товарів', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingProduct({
      name: '',
      category: defaultCategories[0],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      gallery: [],
      short_desc: '',
      description: '',
      specs: [
        { label: 'Габаритні розміри', value: '1200 x 800 x 150 мм' },
        { label: 'Власна вага', value: '45 кг' },
        { label: 'Максимальне навантаження', value: 'до 5 000 кг' },
        { label: 'Твердість за Шором А', value: '70 од.' }
      ],
      is_featured: false,
      sort_order: products.length + 1
    });
    setIsCreating(true);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct({ ...p, specs: [...(p.specs || [])] });
    setIsCreating(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name?.trim() || !editingProduct.short_desc?.trim() || !editingProduct.image?.trim()) {
      onNotify('Заповніть назву, короткий опис та фото товару', 'error');
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        const created = await api.createProduct(editingProduct);
        onNotify(`Товар "${created.name}" успішно створено!`);
      } else if (editingProduct.id) {
        const updated = await api.updateProduct(editingProduct.id, editingProduct);
        onNotify(`Товар "${updated.name}" успішно оновлено!`);
      }
      setEditingProduct(null);
      await loadProducts();
    } catch (err: any) {
      onNotify(err.message || 'Помилка збереження товару', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteProduct(id);
      onNotify('Товар успішно видалено з каталогу');
      setDeleteConfirmId(null);
      await loadProducts();
    } catch (err: any) {
      onNotify(err.message || 'Помилка видалення', 'error');
    }
  };

  const handleImageFileUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setEditingProduct(prev => ({ ...prev, image: res.url }));
      onNotify('Головне фото товару завантажено!');
    } catch (err: any) {
      onNotify(err.message || 'Помилка завантаження фото', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (file: File) => {
    try {
      const res = await api.uploadImage(file);
      setEditingProduct(prev => ({
        ...prev,
        gallery: [...(prev?.gallery || []), res.url]
      }));
      onNotify('Фото додано до галереї товару!');
    } catch (err: any) {
      onNotify(err.message || 'Помилка завантаження фото', 'error');
    }
  };

  // Specs helpers
  const addSpecRow = () => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      specs: [...(editingProduct.specs || []), { label: '', value: '' }]
    });
  };

  const updateSpecRow = (index: number, key: 'label' | 'value', val: string) => {
    if (!editingProduct) return;
    const newSpecs = [...(editingProduct.specs || [])];
    newSpecs[index][key] = val;
    setEditingProduct({ ...editingProduct, specs: newSpecs });
  };

  const removeSpecRow = (index: number) => {
    if (!editingProduct) return;
    const newSpecs = (editingProduct.specs || []).filter((_, idx) => idx !== index);
    setEditingProduct({ ...editingProduct, specs: newSpecs });
  };

  const filteredProducts = products.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">
            Каталог продукції заводу MAG
          </h2>
          <p className="text-xs text-slate-400">
            Створюйте нові товари, завантажуйте фотографії, змінюйте характеристики та описи в реальному часі.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Додати новий товар</span>
        </button>
      </div>

      {/* MODAL / SLIDE-OVER FORM FOR PRODUCT CREATE / EDIT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  {isCreating ? 'Створення нової позиції' : 'Редагування товару'}
                </span>
                <h3 className="text-2xl font-black font-heading text-white mt-2">
                  {isCreating ? 'Новий товар каталогу' : editingProduct.name}
                </h3>
              </div>

              {/* Basic Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Повна назва товару <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Наприклад: Палета блочна гумова MAG Heavy Block 1200x800"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Категорія продукції
                    </label>
                    <select
                      value={editingProduct.category || defaultCategories[0]}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      {defaultCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.is_featured)}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400"
                      />
                      <span>Показувати на Головній сторінці як Топ-товар</span>
                    </label>
                  </div>
                </div>

                {/* Main Product Image */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Головне фото товару (квадратний формат)
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {editingProduct.image && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Введіть URL фото або завантажте файл справа..."
                          value={editingProduct.image || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                        />
                        <label className="cursor-pointer px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingImage ? 'Завантаження...' : 'Завантажити фото'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleImageFileUpload(e.target.files[0]);
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Рекомендовано квадратні зображення (1:1) гарної якості (JPG, PNG, WEBP).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional gallery photos */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Додаткові фотографії (галерея товару)
                    </label>
                    <label className="cursor-pointer px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs transition-colors flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>+ Додати фото</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleGalleryUpload(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editingProduct.gallery?.map((imgUrl, gIdx) => (
                      <div key={gIdx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 group">
                        <img src={imgUrl} alt={`gallery ${gIdx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const newG = (editingProduct.gallery || []).filter((_, i) => i !== gIdx);
                            setEditingProduct({ ...editingProduct, gallery: newG });
                          }}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Короткий опис (відображається в списку товарів) <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Коротке резюме про продукт..."
                    value={editingProduct.short_desc || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, short_desc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Повний інженерний опис (на окремій сторінці товару)
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Детальний опис технології пресування, матеріалу, стійкості, сфери застосування..."
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Dynamic Specs Builder */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white">
                        Таблиця технічних характеристик
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Додавайте параметри: розмір, вага, тип армування, температура, навантаження
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addSpecRow}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Додати параметр</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingProduct.specs?.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Параметр (наприклад: Вага)"
                          value={spec.label}
                          onChange={(e) => updateSpecRow(sIdx, 'label', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Значення (наприклад: 48 кг)"
                          value={spec.value}
                          onChange={(e) => updateSpecRow(sIdx, 'value', e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpecRow(sIdx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded"
                          title="Видалити рядок"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                >
                  Скасувати
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Збереження...' : isCreating ? 'Створити товар' : 'Оновити товар'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white font-heading">
              Видалити товар?
            </h3>
            <p className="text-xs text-slate-400">
              Цю дію неможливо скасувати. Позиція зникне з каталогу та сайту.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
              >
                Скасувати
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white"
              >
                Так, видалити
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Search & List */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Пошук товарів за назвою чи категорією..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Всього товарів: {products.length}
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Завантаження товарів...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
          Товарів не знайдено. Натисніть «Додати новий товар».
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                    {p.category}
                  </span>
                  {p.is_featured && (
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      <span>Топ</span>
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-sm text-white line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {p.short_desc}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={`/catalog/${p.slug || p.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center gap-1"
                  title="Відкрити на сайті"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Редагувати</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(p.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-colors"
                    title="Видалити товар"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
