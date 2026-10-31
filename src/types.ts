export interface Activity {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  location: string;
  coverImage: string;
  content: string;
  galleryImages: string[];
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

export interface Agenda {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: 'akan_datang' | 'selesai';
}

export interface Official {
  id: string;
  name: string;
  titleSuffix?: string;
  role: string; // e.g. "Ketua", "Wakil Ketua I", "Koordinator"
  category: 'penasihat' | 'pembina' | 'harian' | 'bidang';
  division?: string; // e.g. "Bidang Organisasi dan Kelembagaan"
  agency?: string; // Jabatan Kedinasan, e.g. "Asisten Pemerintahan dan Kesra Sekda"
  order: number;
  photoUrl: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  description: string;
  category: string;
  images: GalleryPhoto[];
}

export interface Announcement {
  id: string;
  title: string;
  category: 'pengumuman' | 'surat_edaran' | 'dokumen';
  documentNumber?: string;
  date: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  description: string;
  downloadCount: number;
}

export interface ProfileData {
  aboutKorpri: string;
  profileSemarang: string;
  pancaPrasetya: string[];
  vision: string;
  missions: string[];
  tasks: string[];
  functions: string[];
  workPrograms: {
    title: string;
    description: string;
    items: string[];
  }[];
  secretariatInfo: {
    office: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
}

export interface SiteSettings {
  siteName: string;
  shortName: string;
  tagline: string;
  logoUrl: string;
  heroBanner: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  operationalHours: string;
  copyright: string;
  memberCount: number;
  unitCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface UserSession {
  username: string;
  name: string;
  token: string;
}
