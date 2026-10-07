import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'mag_plant.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for high performance and durability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  // 1. Users table (Admin accounts)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
  `);

  // 2. Site settings table (Key-Value JSON store for page contents)
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      gallery TEXT DEFAULT '[]',
      short_desc TEXT NOT NULL,
      description TEXT NOT NULL,
      specs TEXT DEFAULT '[]',
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Inquiries table (Customer requests / quotes)
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      company TEXT,
      product_name TEXT,
      message TEXT,
      status TEXT DEFAULT 'new',
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Audit logs table (Security monitoring)
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default admin if none exists
  const adminCheck = db.prepare('SELECT count(*) as count FROM users').get();
  if (adminCheck.count === 0) {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync('mag2026admin', salt);
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
      .run('admin', hash, 'superadmin');
    console.log('[DB] Created initial admin user: admin / mag2026admin');
  }

  // Seed default site settings if empty
  seedSiteSettings();

  // Seed default products if empty
  seedProducts();
}

function seedSiteSettings() {
  const getSetting = db.prepare('SELECT value FROM site_settings WHERE key = ?');

  // Home Page Settings
  if (!getSetting.get('home')) {
    const defaultHome = {
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
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('home', JSON.stringify(defaultHome));
  }

  // About Page Settings
  if (!getSetting.get('about')) {
    const defaultAbout = {
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
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('about', JSON.stringify(defaultAbout));
  }

  // Contacts Page Settings
  if (!getSetting.get('contacts')) {
    const defaultContacts = {
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
    db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)').run('contacts', JSON.stringify(defaultContacts));
  }
}

function seedProducts() {
  const count = db.prepare('SELECT count(*) as count FROM products').get().count;
  if (count > 0) return;

  const insertProduct = db.prepare(`
    INSERT INTO products (
      slug, name, category, image, gallery, short_desc, description, specs, is_featured, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialProducts = [
    {
      slug: "paleta-blochna-gumova-mag-heavy-block-1200x800",
      name: "Палета блочна гумова MAG Heavy Block 1200x800",
      category: "Гумові палети та блоки",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
      ]),
      short_desc: "Надміцна монолітна блочна гумова палета з інтегрованими сталевими напрямними для вилкових навантажувачів.",
      description: "Блочна палета MAG Heavy Block виготовлена методом гарячого компресійного пресування під тиском 500 тонн. Спеціально розроблена для зберігання та транспортування надважких вантажів у суворих промислових умовах: металургія, хімічні заводи, порти та відкриті майданчики.\n\nНа відміну від дерев'яних або пластикових аналогів, гумова блочна палета не розколюється при падінні вантажу, повністю стійка до лугів, мастил та дорожніх реагентів. Інтегровані сталеві ребра жорсткості виключають деформацію при тривалому статичному навантаженні до 6500 кг.",
      specs: JSON.stringify([
        { label: "Габаритні розміри", value: "1200 x 800 x 155 мм" },
        { label: "Власна вага", value: "48 кг" },
        { label: "Статичне навантаження", value: "до 6 500 кг" },
        { label: "Динамічне навантаження", value: "до 2 800 кг" },
        { label: "Конструкція опор", value: "9 суцільнолитих гумових блоків" },
        { label: "Армування", value: "Внутрішній сталевий зварний пояс 4 мм" },
        { label: "Твердість за Шором А", value: "70 ± 5 од." },
        { label: "Робоча температура", value: "від -45°C до +90°C" },
        { label: "Термін служби", value: "не менше 15 років" }
      ]),
      is_featured: 1,
      sort_order: 1
    },
    {
      slug: "gumovo-metalevyi-oporniy-bufer-mag-steel-core",
      name: "Гумово-металевий опорний демпфер MAG Steel-Core 400x200",
      category: "Гумово-металеві вироби",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
      ]),
      short_desc: "Демпферний блок підвищеної пружності з впресованими різьбовими сталевими шпильками М24 для важкого обладнання.",
      description: "Опорний буфер MAG Steel-Core використовується для гасіння вібрацій та ударних імпульсів великих дробарок, штампувальних пресів, насосних станцій та компресорів. Металеві закладні піддаються хімічному травленню та нанесенню клейового шару Chemosil перед вулканізацією, що унеможливлює відшарування металу від гумової матриці при навантаженнях до 40 тонн.",
      specs: JSON.stringify([
        { label: "Розміри корпусу", value: "400 x 200 x 160 мм" },
        { label: "Вага блоку", value: "24.5 кг" },
        { label: "Закладні деталі", value: "Сталь 40Х, різьбові шпильки М24 (4 шт)" },
        { label: "Енергоємність", value: "до 52 кДж" },
        { label: "Коефіцієнт демпфування", value: "0.85" },
        { label: "Твердість", value: "75 од. Шор А" }
      ]),
      is_featured: 1,
      sort_order: 2
    },
    {
      slug: "modulna-plyta-mag-armorfloor-1000x1000",
      name: "Модульна плита високого навантаження MAG ArmorFloor 1000x1000",
      category: "Плити та покриття",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
      ]),
      short_desc: "Товстостінна замкова плита товщиною 40 мм для логістичних терміналів, майстерень та цехів.",
      description: "Плита MAG ArmorFloor розроблена для захисту бетонної підлоги та створення зносостійкого, протиковзкого покриття. З'єднання «ластівчин хвіст» забезпечує монолітність полотна без використання додаткового клею. Легко демонтується та переноситься в нову зону робіт.",
      specs: JSON.stringify([
        { label: "Розмір плити", value: "1000 x 1000 мм" },
        { label: "Товщина", value: "40 мм (під замовлення від 20 до 50 мм)" },
        { label: "Вага 1 м²", value: "39 кг" },
        { label: "Тип з'єднання", value: "Прихований пазовий замок" },
        { label: "Стійкість до шипованої техніки", value: "Висока (не кришиться)" },
        { label: "Шумопоглинання", value: "до 28 дБ" }
      ]),
      is_featured: 1,
      sort_order: 3
    },
    {
      slug: "blok-vidbiynyi-prichalniy-mag-dock-safe",
      name: "Блок відбійний причальний з закладними MAG Dock-Safe",
      category: "Гумово-металеві вироби",
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
      ]),
      short_desc: "Масивний причальний брус для морських терміналів та рамп логістичних комплексів з внутрішньою сталевою анкерною плитою.",
      description: "Відбійники MAG Dock-Safe призначені для захисту причальних стінок та вантажних рамп від ударів суден і вантажівок. Всередині виробу впресована оцинкована сталева пластина товщиною 8 мм з отворами під анкерні болти.",
      specs: JSON.stringify([
        { label: "Довжина", value: "1500 мм" },
        { label: "Профіль", value: "D-подібний 250 x 250 мм" },
        { label: "Вага", value: "86 кг" },
        { label: "Матеріал вставки", value: "Сталь конструкційна Ст3сп (8 мм)" },
        { label: "Стійкість до солоної води", value: "Абсолютна (100%)" }
      ]),
      is_featured: 0,
      sort_order: 4
    },
    {
      slug: "gumova-kryhta-fraktsiyna-mag-ecocrumb",
      name: "Гумова крихта фракційна очищена MAG EcoCrumb (0.8 - 2.5 мм)",
      category: "Гумова крихта та гранулят",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
      ]),
      short_desc: "Високоочищена гумова крихта без металокорду для виробництва безшовних покриттів, плит та модифікації бітуму.",
      description: "Крихта MAG EcoCrumb виробляється на лініях механічного шредування з триступеневою магнітною сепарацією. Має низький вміст пилу, відмінну геометрію гранул для оптимальної витрати поліуретанового зв'язуючого.",
      specs: JSON.stringify([
        { label: "Фракційний склад", value: "0.8 — 2.5 мм (також доступні 2-4 мм, 4-6 мм)" },
        { label: "Ступінь очищення від металу", value: "99.98%" },
        { label: "Вміст текстилю", value: "менше 0.03%" },
        { label: "Вологість", value: "не більше 0.8%" },
        { label: "Упаковка", value: "Біг-бег 1000 кг або мішки по 25 кг" }
      ]),
      is_featured: 0,
      sort_order: 5
    },
    {
      slug: "zaliznychnyi-nastyil-mag-rail-transit",
      name: "Залізничний настил переїзний армований MAG Rail-Transit",
      category: "Гумово-металеві вироби",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
      ]),
      short_desc: "Комплект великогабаритних плит з внутрішнім просторовим металевим каркасом для безстикового переїзду автотранспорту.",
      description: "Настил MAG Rail-Transit забезпечує плавний і безпечний проїзд автотранспорту через залізничні та трамвайні колії. Внутрішній зварний сталевий каркас витримує осьове навантаження великовантажних автомобілів до 30 тонн.",
      specs: JSON.stringify([
        { label: "Ширина колії", value: "1520 мм" },
        { label: "Товщина плити", value: "165 мм" },
        { label: "Армування", value: "Просторовий сталевий каркас зі швелера та арматури" },
        { label: "Осьове навантаження", value: "до 300 кН (30 тонн)" },
        { label: "Гарантійний ресурс", value: "10 років або 500 000 переїздів" }
      ]),
      is_featured: 1,
      sort_order: 6
    }
  ];

  for (const p of initialProducts) {
    insertProduct.run(
      p.slug, p.name, p.category, p.image, p.gallery, p.short_desc, p.description, p.specs, p.is_featured, p.sort_order
    );
  }
  console.log('[DB] Seeded initial MAG products successfully.');
}

export default db;
