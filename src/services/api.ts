import {
  Activity,
  Agenda,
  Official,
  GalleryAlbum,
  Announcement,
  ProfileData,
  SiteSettings,
  ContactMessage,
} from '../types';

const TOKEN_KEY = 'korpri_admin_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getHeaders = (isAuthRequired = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (isAuthRequired) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal.');
    if (data.token) setAuthToken(data.token);
    return data;
  },

  async verifyAuth() {
    const token = getAuthToken();
    if (!token) return { valid: false };
    const res = await fetch('/api/auth/verify', {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      clearAuthToken();
      return { valid: false };
    }
    return await res.json();
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(true),
      });
    } finally {
      clearAuthToken();
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah password.');
    return data;
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Gagal memuat pengaturan situs');
    return await res.json();
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<any> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengaturan');
    return data;
  },

  // Profile
  async getProfile(): Promise<ProfileData> {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Gagal memuat profil organisasi');
    return await res.json();
  },

  async updateProfile(profile: Partial<ProfileData>): Promise<any> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui profil');
    return data;
  },

  // Officials / Pengurus
  async getOfficials(): Promise<Official[]> {
    const res = await fetch('/api/officials');
    if (!res.ok) throw new Error('Gagal memuat susunan pengurus');
    return await res.json();
  },

  async createOfficial(official: Partial<Official>): Promise<Official> {
    const res = await fetch('/api/officials', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(official),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menambah pengurus');
    return data;
  },

  async updateOfficial(id: string, official: Partial<Official>): Promise<Official> {
    const res = await fetch(`/api/officials/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(official),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengurus');
    return data;
  },

  async deleteOfficial(id: string): Promise<any> {
    const res = await fetch(`/api/officials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengurus');
    return data;
  },

  // Activities
  async getActivities(params?: {
    search?: string;
    category?: string;
    year?: string;
    admin?: boolean;
  }): Promise<Activity[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.year) query.set('year', params.year);
    if (params?.admin) query.set('admin', 'true');

    const res = await fetch(`/api/activities?${query.toString()}`);
    if (!res.ok) throw new Error('Gagal memuat kegiatan');
    return await res.json();
  },

  async getActivity(slugOrId: string): Promise<Activity> {
    const res = await fetch(`/api/activities/${encodeURIComponent(slugOrId)}`);
    if (!res.ok) throw new Error('Kegiatan tidak ditemukan');
    return await res.json();
  },

  async createActivity(activity: Partial<Activity>): Promise<Activity> {
    const res = await fetch('/api/activities', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(activity),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat kegiatan');
    return data;
  },

  async updateActivity(id: string, activity: Partial<Activity>): Promise<Activity> {
    const res = await fetch(`/api/activities/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(activity),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui kegiatan');
    return data;
  },

  async deleteActivity(id: string): Promise<any> {
    const res = await fetch(`/api/activities/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus kegiatan');
    return data;
  },

  // Agendas
  async getAgendas(): Promise<Agenda[]> {
    const res = await fetch('/api/agendas');
    if (!res.ok) throw new Error('Gagal memuat agenda');
    return await res.json();
  },

  async createAgenda(agenda: Partial<Agenda>): Promise<Agenda> {
    const res = await fetch('/api/agendas', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(agenda),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menambah agenda');
    return data;
  },

  async updateAgenda(id: string, agenda: Partial<Agenda>): Promise<Agenda> {
    const res = await fetch(`/api/agendas/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(agenda),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui agenda');
    return data;
  },

  async deleteAgenda(id: string): Promise<any> {
    const res = await fetch(`/api/agendas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus agenda');
    return data;
  },

  // Galleries
  async getGalleries(): Promise<GalleryAlbum[]> {
    const res = await fetch('/api/galleries');
    if (!res.ok) throw new Error('Gagal memuat galeri');
    return await res.json();
  },

  async createGallery(album: Partial<GalleryAlbum>): Promise<GalleryAlbum> {
    const res = await fetch('/api/galleries', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(album),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat album galeri');
    return data;
  },

  async updateGallery(id: string, album: Partial<GalleryAlbum>): Promise<GalleryAlbum> {
    const res = await fetch(`/api/galleries/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(album),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui album galeri');
    return data;
  },

  async deleteGallery(id: string): Promise<any> {
    const res = await fetch(`/api/galleries/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus album galeri');
    return data;
  },

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch('/api/announcements');
    if (!res.ok) throw new Error('Gagal memuat pengumuman');
    return await res.json();
  },

  async createAnnouncement(announcement: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(announcement),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat pengumuman');
    return data;
  },

  async updateAnnouncement(id: string, announcement: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(announcement),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengumuman');
    return data;
  },

  async deleteAnnouncement(id: string): Promise<any> {
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengumuman');
    return data;
  },

  // Contact Messages
  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/messages', {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Gagal memuat pesan masuk');
    return await res.json();
  },

  async sendMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Gagal mengirim pesan');
    return result;
  },

  async deleteMessage(id: string): Promise<any> {
    const res = await fetch(`/api/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return await res.json();
  },

  // Upload image
  async uploadImage(dataUrl: string): Promise<{ url: string }> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ dataUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah gambar');
    return data;
  },

  // Stats
  async getStats() {
    const res = await fetch('/api/stats', {
      headers: getHeaders(true),
    });
    if (!res.ok) throw new Error('Gagal memuat statistik');
    return await res.json();
  },

  // Backup & Restore
  async restoreBackup(backupData: any) {
    const res = await fetch('/api/backup/restore', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ backupData }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memulihkan database');
    return data;
  },
};
