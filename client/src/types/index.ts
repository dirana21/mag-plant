export interface StatItem {
  value: string;
  label: string;
  sub?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  badge?: string;
  icon?: string;
  image?: string;
}

export interface HomeSettings {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    stats: StatItem[];
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    heroImage: string;
  };
  servicesIntro: {
    title: string;
    subtitle: string;
  };
  services: ServiceItem[];
  techBanner: {
    title: string;
    description: string;
    phone: string;
  };
}

export interface StepItem {
  num: string;
  title: string;
  text: string;
}

export interface AboutSettings {
  heading: string;
  subheading: string;
  history: string;
  mission: string;
  stats: { label: string; value: string }[];
  steps: StepItem[];
  certifications: string[];
  gallery: string[];
}

export interface ContactsSettings {
  companyName: string;
  address: string;
  landmark: string;
  schedule: string;
  commercialDepartment: {
    title: string;
    phone1: string;
    phone2: string;
    email: string;
    contactPerson: string;
  };
  recyclingDepartment: {
    title: string;
    phone: string;
    email: string;
    contactPerson: string;
  };
  coordinates: {
    lat: number;
    lng: number;
    zoom: number;
  };
  requisites: {
    edrpou: string;
    ipn: string;
    iban: string;
    bank: string;
  };
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  gallery: string[];
  short_desc: string;
  description: string;
  specs: ProductSpec[];
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  product_name?: string;
  message?: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  ip_address?: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuditLog {
  id: number;
  action: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}
