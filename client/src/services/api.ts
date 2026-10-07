import { HomeSettings, AboutSettings, ContactsSettings, Product, Inquiry, AuditLog, User } from '../types';

const API_BASE = '/api';

// Fallback seed data for standalone/static deployments (e.g. GitHub Pages)
const defaultHome: HomeSettings = {
  hero: {
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
    ctaSecondaryText: "Замовити розрахунок",
    heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
  },
  servicesIntro: {
    title: "Ключові напрями виробництва заводу MAG",
    subtitle: "Ми поєднуємо відновлювану сировину з важкими пресовими технологіями для створення продукції екстремальної витривалості."
  },
  services: [
    {
      id: 1,
      title: "Блочні гумові палети",
      description: "Суцільнопресовані палети підвищеної вантажопідйомності (до 6.5 тонн) для агресивних хімічних, логістичних та портових середовищ. Не гниють, не тріскаються, поглинають удари.",
      badge: "Власна розробка",
      icon: "Boxes",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Пресування гуми зі сталевими вставками",
      description: "Технологія термо-вулканізаційного зчеплення гумового масиву з армованими сталевими профілями, пластинами, різьбовими фланцями для важкого машинобудування.",
      badge: "Високоточне",
      icon: "Layers",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Промислові надміцні плити",
      description: "Широкоформатні модульні гумові плити товщиною від 20 до 50 мм для складів з важкою технікою, тирів, зерносховищ та спортивних комплексів.",
      badge: "Ударостійкі",
      icon: "ShieldCheck",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Прийом та утилізація шин",
      description: "Офіційний прийом вантажних, легкових і тракторних шин на переробку з наданням екологічного акту утилізації для юридичних осіб та підприємств.",
      badge: "Еко-стандарт",
      icon: "Recycle",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
    }
  ],
  techBanner: {
    title: "Потрібна нестандартна прес-форма або індивідуальне замовлення?",
    description: "Конструкторське бюро заводу MAG розробляє оснащення та прес-форми за вашими кресленнями. Від ідеї до партії готових виробів — за 14 робочих днів.",
    phone: "+38 (044) 390-45-70"
  }
};

const defaultAbout: AboutSettings = {
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
    { num: "01", title: "Прийом та радіологічний контроль", text: "Вхідне сканування шин на відсутність сторонніх включень, радіаційний контроль та сортування за типом корду." },
    { num: "02", title: "Багатоступеневе шредування", text: "Подрібнення покришок на масивних роторних шредерах до стану гумових чіпсів без термічного розпаду полімеру." },
    { num: "03", title: "Магнітна та повітряна сепарація", text: "Вилучення до 99.9% сталевого корду неодимовими магнітними барабанами та видалення текстилю циклонними фільтрами." },
    { num: "04", title: "Впресування сталевих закладних", text: "Точне позиціонування металевих пластин, каркасів та шпильок у прес-формі перед подачею гумової маси." },
    { num: "05", title: "Вулканізація під тиском 500 тонн", text: "Гаряче запікання при контрольованій температурі. Утворення монолітної структури високої густини без внутрішніх порожнин." }
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

const defaultContacts: ContactsSettings = {
  companyName: "ТОВ «ЗАВОД ПЕРЕРОБКИ ШИН ТА ГУМОТЕХНІКИ МАГ»",
  address: "Україна, м. Київ, вул. Промислова, 14",
  landmark: "Промзона «Корчувате», заїзд для великогабаритного транспорту з Столичного шосе",
  schedule: "Понеділок — П'ятниця: 08:00 — 18:00. Прийом шин на утилізацію: Цілодобово 24/7.",
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

const defaultProducts: Product[] = [
  {
    id: 1,
    slug: "paleta-blochna-gumova-mag-heavy-block-1200x800",
    name: "Палета блочна гумова MAG Heavy Block 1200x800",
    category: "Гумові палети та блоки",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    ],
    short_desc: "Надміцна монолітна блочна гумова палета з інтегрованими сталевими напрямними для вилкових навантажувачів.",
    description: "Блочна палета MAG Heavy Block виготовлена методом гарячого компресійного пресування під тиском 500 тонн. Спеціально розроблена для зберігання та транспортування надважких вантажів у суворих промислових умовах: металургія, хімічні заводи, порти та відкриті майданчики.\n\nНа відміну від дерев'яних або пластикових аналогів, гумова блочна палета не розколюється при падінні вантажу, повністю стійка до лугів, мастил та дорожніх реагентів. Інтегровані сталеві ребра жорсткості виключають деформацію при тривалому статичному навантаженні до 6500 кг.",
    specs: [
      { label: "Габаритні розміри", value: "1200 x 800 x 155 мм" },
      { label: "Власна вага", value: "48 кг" },
      { label: "Статичне навантаження", value: "до 6 500 кг" },
      { label: "Динамічне навантаження", value: "до 2 800 кг" },
      { label: "Конструкція опор", value: "9 суцільнолитих гумових блоків" },
      { label: "Армування", value: "Внутрішній сталевий зварний пояс 4 мм" },
      { label: "Твердість за Шором А", value: "70 ± 5 од." },
      { label: "Робоча температура", value: "від -45°C до +90°C" },
      { label: "Термін служби", value: "не менше 15 років" }
    ],
    is_featured: true,
    sort_order: 1
  },
  {
    id: 2,
    slug: "gumovo-metalevyi-oporniy-bufer-mag-steel-core",
    name: "Гумово-металевий опорний демпфер MAG Steel-Core 400x200",
    category: "Гумово-металеві вироби",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    ],
    short_desc: "Демпферний блок підвищеної пружності з впресованими різьбовими сталевими шпильками М24 для важкого обладнання.",
    description: "Опорний буфер MAG Steel-Core використовується для гасіння вібрацій та ударних імпульсів великих дробарок, штампувальних пресів, насосних станцій та компресорів. Металеві закладні піддаються хімічному травленню та нанесенню клейового шару Chemosil перед вулканізацією, що унеможливлює відшарування металу від гумової матриці при навантаженнях до 40 тонн.",
    specs: [
      { label: "Розміри корпусу", value: "400 x 200 x 160 мм" },
      { label: "Вага блоку", value: "24.5 кг" },
      { label: "Закладні деталі", value: "Сталь 40Х, різьбові шпильки М24 (4 шт)" },
      { label: "Енергоємність", value: "до 52 кДж" },
      { label: "Коефіцієнт демпфування", value: "0.85" },
      { label: "Твердість", value: "75 од. Шор А" }
    ],
    is_featured: true,
    sort_order: 2
  },
  {
    id: 3,
    slug: "modulna-plyta-mag-armorfloor-1000x1000",
    name: "Модульна плита високого навантаження MAG ArmorFloor 1000x1000",
    category: "Плити та покриття",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
    ],
    short_desc: "Товстостінна замкова плита товщиною 40 мм для логістичних терміналів, майстерень та цехів.",
    description: "Плита MAG ArmorFloor розроблена для захисту бетонної підлоги та створення зносостійкого, протиковзкого покриття. З'єднання «ластівчин хвіст» забезпечує монолітність полотна без використання додаткового клею. Легко демонтується та переноситься в нову зону робіт.",
    specs: [
      { label: "Розмір плити", value: "1000 x 1000 мм" },
      { label: "Товщина", value: "40 мм (під замовлення від 20 до 50 мм)" },
      { label: "Вага 1 м²", value: "39 кг" },
      { label: "Тип з'єднання", value: "Прихований пазовий замок" },
      { label: "Стійкість до шипованої техніки", value: "Висока (не кришиться)" },
      { label: "Шумопоглинання", value: "до 28 дБ" }
    ],
    is_featured: true,
    sort_order: 3
  },
  {
    id: 4,
    slug: "blok-vidbiynyi-prichalniy-mag-dock-safe",
    name: "Блок відбійний причальний з закладними MAG Dock-Safe",
    category: "Гумово-металеві вироби",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
    ],
    short_desc: "Масивний причальний брус для морських терміналів та рамп логістичних комплексів з внутрішньою сталевою анкерною плитою.",
    description: "Відбійники MAG Dock-Safe призначені для захисту причальних стінок та вантажних рамп від ударів суден і вантажівок. Всередині виробу впресована оцинкована сталева пластина товщиною 8 мм з отворами під анкерні болти.",
    specs: [
      { label: "Довжина", value: "1500 мм" },
      { label: "Профіль", value: "D-подібний 250 x 250 мм" },
      { label: "Вага", value: "86 кг" },
      { label: "Матеріал вставки", value: "Сталь конструкційна Ст3сп (8 мм)" },
      { label: "Стійкість до солоної води", value: "Абсолютна (100%)" }
    ],
    is_featured: false,
    sort_order: 4
  },
  {
    id: 5,
    slug: "gumova-kryhta-fraktsiyna-mag-ecocrumb",
    name: "Гумова крихта фракційна очищена MAG EcoCrumb (0.8 - 2.5 мм)",
    category: "Гумова крихта та гранулят",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    short_desc: "Високоочищена гумова крихта без металокорду для виробництва безшовних покриттів, плит та модифікації бітуму.",
    description: "Крихта MAG EcoCrumb виробляється на лініях механічного шредування з триступеневою магнітною сепарацією. Має низький вміст пилу, відмінну геометрію гранул для оптимальної витрати поліуретанового зв'язуючого.",
    specs: [
      { label: "Фракційний склад", value: "0.8 — 2.5 мм (також доступні 2-4 мм, 4-6 мм)" },
      { label: "Ступінь очищення від металу", value: "99.98%" },
      { label: "Вміст текстилю", value: "менше 0.03%" },
      { label: "Вологість", value: "не більше 0.8%" },
      { label: "Упаковка", value: "Біг-бег 1000 кг або мішки по 25 кг" }
    ],
    is_featured: false,
    sort_order: 5
  },
  {
    id: 6,
    slug: "zaliznychnyi-nastyil-mag-rail-transit",
    name: "Залізничний настил переїзний армований MAG Rail-Transit",
    category: "Гумово-металеві вироби",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    ],
    short_desc: "Комплект великогабаритних плит з внутрішнім просторовим металевим каркасом для безстикового переїзду автотранспорту.",
    description: "Настил MAG Rail-Transit забезпечує плавний і безпечний проїзд автотранспорту через залізничні та трамвайні колії. Внутрішній зварний сталевий каркас витримує осьове навантаження великовантажних автомобілів до 30 тонн.",
    specs: [
      { label: "Ширина колії", value: "1520 мм" },
      { label: "Товщина плити", value: "165 мм" },
      { label: "Армування", value: "Просторовий сталевий каркас зі швелера та арматури" },
      { label: "Осьове навантаження", value: "до 300 кН (30 тонн)" },
      { label: "Гарантійний ресурс", value: "10 років або 500 000 переїздів" }
    ],
    is_featured: true,
    sort_order: 6
  }
];

// LocalStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(`mag_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`mag_${key}`, JSON.stringify(val));
  } catch (_) {}
}

// Network request with automatic fallback
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: HeadersInit = { 'Content-Type': 'application/json' };
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export const api = {
  // --- Content APIs ---
  getHomeContent: async (): Promise<HomeSettings> => {
    try {
      return await request<HomeSettings>('/content/home');
    } catch {
      return getLocal<HomeSettings>('content_home', defaultHome);
    }
  },
  updateHomeContent: async (data: HomeSettings) => {
    try {
      return await request<{ success: boolean; data: HomeSettings }>('/content/home', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      setLocal('content_home', data);
      return { success: true, data };
    }
  },

  getAboutContent: async (): Promise<AboutSettings> => {
    try {
      return await request<AboutSettings>('/content/about');
    } catch {
      return getLocal<AboutSettings>('content_about', defaultAbout);
    }
  },
  updateAboutContent: async (data: AboutSettings) => {
    try {
      return await request<{ success: boolean; data: AboutSettings }>('/content/about', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      setLocal('content_about', data);
      return { success: true, data };
    }
  },

  getContactsContent: async (): Promise<ContactsSettings> => {
    try {
      return await request<ContactsSettings>('/content/contacts');
    } catch {
      return getLocal<ContactsSettings>('content_contacts', defaultContacts);
    }
  },
  updateContactsContent: async (data: ContactsSettings) => {
    try {
      return await request<{ success: boolean; data: ContactsSettings }>('/content/contacts', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      setLocal('content_contacts', data);
      return { success: true, data };
    }
  },

  // --- Product APIs ---
  getProducts: async (params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> => {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.featured) query.append('featured', '1');
      const qs = query.toString() ? `?${query.toString()}` : '';
      return await request<Product[]>(`/products${qs}`);
    } catch {
      let list = getLocal<Product[]>('products', defaultProducts);
      if (params?.category && params.category !== 'Всі') {
        list = list.filter(p => p.category === params.category);
      }
      if (params?.featured) {
        list = list.filter(p => p.is_featured);
      }
      if (params?.search && params.search.trim()) {
        const q = params.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.short_desc.toLowerCase().includes(q));
      }
      return list;
    }
  },

  getProduct: async (slugOrId: string | number): Promise<Product> => {
    try {
      return await request<Product>(`/products/${slugOrId}`);
    } catch {
      const list = getLocal<Product[]>('products', defaultProducts);
      const found = list.find(p => String(p.id) === String(slugOrId) || p.slug === String(slugOrId));
      if (!found) throw new Error('Товар не знайдено');
      return found;
    }
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    try {
      return await request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch {
      const list = getLocal<Product[]>('products', defaultProducts);
      const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
      const newSlug = (productData.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9а-яіїєґ\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-') + '-' + Date.now();

      const newProduct: Product = {
        id: newId,
        slug: newSlug,
        name: productData.name || 'Новий товар',
        category: productData.category || 'Гумові палети та блоки',
        image: productData.image || '',
        gallery: productData.gallery || [],
        short_desc: productData.short_desc || '',
        description: productData.description || '',
        specs: productData.specs || [],
        is_featured: Boolean(productData.is_featured),
        sort_order: productData.sort_order || list.length + 1,
        created_at: new Date().toISOString()
      };

      const updated = [newProduct, ...list];
      setLocal('products', updated);
      return newProduct;
    }
  },

  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    try {
      return await request<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch {
      const list = getLocal<Product[]>('products', defaultProducts);
      const idx = list.findIndex(p => p.id === id);
      if (idx === -1) throw new Error('Товар не знайдено');
      const updatedItem: Product = {
        ...list[idx],
        ...productData,
        specs: productData.specs || list[idx].specs
      };
      list[idx] = updatedItem;
      setLocal('products', list);
      return updatedItem;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      return await request<{ success: boolean; message: string }>(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch {
      const list = getLocal<Product[]>('products', defaultProducts);
      const filtered = list.filter(p => p.id !== id);
      setLocal('products', filtered);
      return { success: true, message: 'Товар видалено' };
    }
  },

  // --- File Upload ---
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Upload error');
      return await response.json();
    } catch {
      // In static / GitHub Pages mode, convert image to data URL so it displays and persists in browser!
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ url: reader.result as string, filename: file.name });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // --- Inquiries ---
  submitInquiry: async (inquiryData: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    product_name?: string;
    message?: string;
  }) => {
    try {
      return await request<{ success: boolean; message: string; id: number }>('/inquiries', {
        method: 'POST',
        body: JSON.stringify(inquiryData),
      });
    } catch {
      const list = getLocal<Inquiry[]>('inquiries', []);
      const newInq: Inquiry = {
        id: Date.now(),
        ...inquiryData,
        status: 'new',
        created_at: new Date().toISOString()
      };
      setLocal('inquiries', [newInq, ...list]);
      return {
        success: true,
        message: "Дякуємо! Ваша заявка прийнята. Менеджер комерційного відділу MAG зв'яжеться з вами найближчим часом.",
        id: newInq.id
      };
    }
  },

  getInquiries: async (): Promise<Inquiry[]> => {
    try {
      return await request<Inquiry[]>('/inquiries');
    } catch {
      return getLocal<Inquiry[]>('inquiries', [
        {
          id: 1,
          name: "Віталій Дмитренко",
          phone: "+38 (067) 123-45-67",
          email: "vitaliy@agrotrans.ua",
          company: "ТОВ 'АгроТранс Логістик'",
          product_name: "Палета блочна гумова MAG Heavy Block 1200x800",
          message: "Потрібна партія 300 шт. для складів добрив. Прошу надіслати комерційну пропозицію з ПДВ.",
          status: 'new',
          created_at: new Date().toISOString()
        }
      ]);
    }
  },

  updateInquiryStatus: async (id: number, status: string) => {
    try {
      return await request<{ success: boolean; message: string }>(`/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      const list = getLocal<Inquiry[]>('inquiries', []);
      const updated = list.map(i => i.id === id ? { ...i, status: status as any } : i);
      setLocal('inquiries', updated);
      return { success: true, message: 'Статус оновлено' };
    }
  },

  deleteInquiry: async (id: number) => {
    try {
      return await request<{ success: boolean; message: string }>(`/inquiries/${id}`, {
        method: 'DELETE',
      });
    } catch {
      const list = getLocal<Inquiry[]>('inquiries', []);
      setLocal('inquiries', list.filter(i => i.id !== id));
      return { success: true, message: 'Заявку видалено' };
    }
  },

  // --- Auth APIs ---
  login: async (username: string, password: string) => {
    try {
      return await request<{ success: boolean; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    } catch {
      const creds = getLocal('admin_creds', { username: 'admin', password: 'mag2026admin' });
      if (username.trim() === creds.username && password === creds.password) {
        const user = { id: 1, username: creds.username, role: 'admin' };
        setLocal('admin_user', user);
        return { success: true, token: 'mock_jwt_token', user };
      }
      throw new Error('Невірний логін або пароль');
    }
  },

  logout: async () => {
    try {
      return await request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' });
    } catch {
      localStorage.removeItem('mag_admin_user');
      return { success: true, message: 'Ви вийшли з системи' };
    }
  },

  getCurrentUser: async () => {
    try {
      return await request<{ user: User }>('/auth/me');
    } catch {
      const user = getLocal<User | null>('admin_user', null);
      if (!user) throw new Error('Not authenticated');
      return { user };
    }
  },

  updateCredentials: async (data: { currentPassword: string; newUsername?: string; newPassword?: string }) => {
    try {
      return await request<{ success: boolean; message: string; user: User }>('/auth/update-credentials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const creds = getLocal('admin_creds', { username: 'admin', password: 'mag2026admin' });
      if (data.currentPassword !== creds.password) {
        throw new Error('Поточний пароль введено невірно');
      }
      const updatedCreds = {
        username: data.newUsername || creds.username,
        password: data.newPassword || creds.password
      };
      setLocal('admin_creds', updatedCreds);
      const user = { id: 1, username: updatedCreds.username, role: 'admin' };
      setLocal('admin_user', user);
      return { success: true, message: 'Облікові дані оновлено', user };
    }
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    try {
      return await request<AuditLog[]>('/auth/audit-logs');
    } catch {
      return [
        {
          id: 1,
          action: 'DEPLOY_PAGES',
          details: 'GitHub Pages Live Deployment initialized',
          ip_address: '127.0.0.1',
          user_agent: 'Antigravity / Web Client',
          created_at: new Date().toISOString()
        }
      ];
    }
  }
};
