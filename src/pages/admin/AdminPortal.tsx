import React, { useState, useEffect } from 'react';
import { api, getAuthToken, clearAuthToken } from '../../services/api';
import {
  Activity,
  Agenda,
  Official,
  GalleryAlbum,
  Announcement,
  ProfileData,
  SiteSettings,
  ContactMessage,
} from '../../types';
import { KorpriLogo } from '../../components/KorpriLogo';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  Images,
  FileText,
  Building,
  Settings,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  Check,
  AlertCircle,
  ExternalLink,
  Upload,
  Download,
  Lock,
  User,
  Save,
  Clock,
  MapPin,
  RefreshCw,
  KeyRound,
} from 'lucide-react';

interface AdminPortalProps {
  onNavigatePublic: (path: string) => void;
  onDataRefresh: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onNavigatePublic,
  onDataRefresh,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'activities'
    | 'agendas'
    | 'officials'
    | 'galleries'
    | 'announcements'
    | 'profile'
    | 'settings'
    | 'messages'
  >('dashboard');

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [galleries, setGalleries] = useState<GalleryAlbum[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Modals & form states
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Activity Modal
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Partial<Activity> | null>(null);

  // Agenda Modal
  const [agendaModalOpen, setAgendaModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<Partial<Agenda> | null>(null);

  // Official Modal
  const [officialModalOpen, setOfficialModalOpen] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Partial<Official> | null>(null);

  // Gallery Modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Partial<GalleryAlbum> | null>(null);

  // Announcement Modal
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement> | null>(null);

  // Password Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const res = await api.verifyAuth();
      if (res.valid) {
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await api.login(username, password);
      setIsAuthenticated(true);
      loadAdminData();
      notify('Selamat datang di Dashboard Admin DP KORPRI Kabupaten Semarang');
    } catch (err: any) {
      setLoginError(err.message || 'Login gagal.');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
  };

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const notifyError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(null), 4000);
  };

  const loadAdminData = async () => {
    try {
      const [
        statsData,
        actsData,
        agesData,
        offsData,
        galsData,
        annsData,
        profData,
        settData,
        msgsData,
      ] = await Promise.all([
        api.getStats().catch(() => null),
        api.getActivities({ admin: true }).catch(() => []),
        api.getAgendas().catch(() => []),
        api.getOfficials().catch(() => []),
        api.getGalleries().catch(() => []),
        api.getAnnouncements().catch(() => []),
        api.getProfile().catch(() => null),
        api.getSettings().catch(() => null),
        api.getMessages().catch(() => []),
      ]);

      setStats(statsData);
      setActivities(actsData);
      setAgendas(agesData);
      setOfficials(offsData);
      setGalleries(galsData);
      setAnnouncements(annsData);
      setProfile(profData);
      setSettings(settData);
      setMessages(msgsData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  // 1. Activity Handlers
  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity || !editingActivity.title) return;
    try {
      if (editingActivity.id) {
        await api.updateActivity(editingActivity.id, editingActivity);
        notify('Kegiatan berhasil diperbarui.');
      } else {
        await api.createActivity(editingActivity);
        notify('Kegiatan baru berhasil diterbitkan.');
      }
      setActivityModalOpen(false);
      setEditingActivity(null);
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message || 'Gagal menyimpan kegiatan.');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) return;
    try {
      await api.deleteActivity(id);
      notify('Kegiatan telah dihapus.');
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message || 'Gagal menghapus kegiatan.');
    }
  };

  // 2. Agenda Handlers
  const handleSaveAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgenda || !editingAgenda.title) return;
    try {
      if (editingAgenda.id) {
        await api.updateAgenda(editingAgenda.id, editingAgenda);
        notify('Agenda berhasil diperbarui.');
      } else {
        await api.createAgenda(editingAgenda);
        notify('Agenda baru berhasil ditambahkan.');
      }
      setAgendaModalOpen(false);
      setEditingAgenda(null);
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message || 'Gagal menyimpan agenda.');
    }
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!window.confirm('Hapus agenda ini?')) return;
    try {
      await api.deleteAgenda(id);
      notify('Agenda telah dihapus.');
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  // 3. Official Handlers
  const handleSaveOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficial || !editingOfficial.name) return;
    try {
      if (editingOfficial.id) {
        await api.updateOfficial(editingOfficial.id, editingOfficial);
        notify('Data pengurus berhasil diperbarui.');
      } else {
        await api.createOfficial(editingOfficial);
        notify('Pengurus baru berhasil ditambahkan.');
      }
      setOfficialModalOpen(false);
      setEditingOfficial(null);
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  const handleDeleteOfficial = async (id: string) => {
    if (!window.confirm('Hapus pengurus ini dari susunan?')) return;
    try {
      await api.deleteOfficial(id);
      notify('Data pengurus telah dihapus.');
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  // 4. Gallery Handlers
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery || !editingGallery.title) return;
    try {
      if (editingGallery.id) {
        await api.updateGallery(editingGallery.id, editingGallery);
        notify('Album galeri berhasil diperbarui.');
      } else {
        await api.createGallery(editingGallery);
        notify('Album galeri baru berhasil dibuat.');
      }
      setGalleryModalOpen(false);
      setEditingGallery(null);
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Hapus album dokumentasi ini?')) return;
    try {
      await api.deleteGallery(id);
      notify('Album dokumentasi telah dihapus.');
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  // 5. Announcement Handlers
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement || !editingAnnouncement.title) return;
    try {
      if (editingAnnouncement.id) {
        await api.updateAnnouncement(editingAnnouncement.id, editingAnnouncement);
        notify('Pengumuman / dokumen berhasil diperbarui.');
      } else {
        await api.createAnnouncement(editingAnnouncement);
        notify('Pengumuman / dokumen baru berhasil diterbitkan.');
      }
      setAnnouncementModalOpen(false);
      setEditingAnnouncement(null);
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('Hapus dokumen ini?')) return;
    try {
      await api.deleteAnnouncement(id);
      notify('Dokumen telah dihapus.');
      loadAdminData();
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  // 6. Settings & Profile Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      notify('Pengaturan website berhasil disimpan.');
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      await api.updateProfile(profile);
      notify('Profil organisasi berhasil diperbarui.');
      onDataRefresh();
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  // 7. Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.changePassword(currentPass, newPass);
      notify('Password administrator berhasil diubah.');
      setPasswordModalOpen(false);
      setCurrentPass('');
      setNewPass('');
    } catch (err: any) {
      notifyError(err.message);
    }
  };

  // 8. Image upload helper
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await api.uploadImage(dataUrl);
        onUploaded(res.url);
        notify('Gambar berhasil diunggah.');
      } catch (err: any) {
        notifyError(err.message || 'Gagal mengunggah gambar');
      }
    };
    reader.readAsDataURL(file);
  };

  // 9. Backup & Restore
  const handleDownloadBackup = () => {
    window.open('/api/backup/export', '_blank');
  };

  const handleRestoreBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        await api.restoreBackup(json);
        notify('Database berhasil dipulihkan dari cadangan.');
        loadAdminData();
        onDataRefresh();
      } catch (err: any) {
        notifyError('File cadangan tidak valid: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
          <span className="text-sm font-medium">Memeriksa autentikasi administrator...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl border border-slate-700/50">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <KorpriLogo size="xl" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Portal Administrator
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Dewan Pengurus KORPRI Kabupaten Semarang
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username Administrator
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-[#0b2d4c] hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                Masuk ke Dashboard Admin
              </button>
            </div>
          </form>

          {/* Helper Credentials Hint for Testing & Verification */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-900 space-y-1">
              <span className="font-bold">Akses Default Administrator:</span>
              <div>Username: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded">admin</code></div>
              <div>Password: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded">korprikabsemarang2024</code></div>
            </div>

            <button
              onClick={() => onNavigatePublic('/')}
              className="mt-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Kembali ke Halaman Publik
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#f3f4f7] text-slate-800 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-[#071d33] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <KorpriLogo size="sm" light />
            <div>
              <span className="text-xs font-bold tracking-tight uppercase">
                Panel Administrator
              </span>
              <span className="text-[11px] text-amber-400 font-medium block">
                DP KORPRI Kabupaten Semarang
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigatePublic('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setPasswordModalOpen(true)}
              title="Ganti Password Admin"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              title="Keluar (Logout)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-200 bg-red-900/40 hover:bg-red-800/60 border border-red-700/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Body Grid: Sidebar Nav + Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-2 shadow-xs space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'activities', label: 'Kelola Kegiatan', icon: Newspaper, count: activities.length },
            { id: 'agendas', label: 'Kelola Agenda', icon: Calendar, count: agendas.length },
            { id: 'officials', label: 'Kelola Pengurus', icon: Users, count: officials.length },
            { id: 'galleries', label: 'Kelola Galeri', icon: Images, count: galleries.length },
            { id: 'announcements', label: 'Kelola Informasi', icon: FileText, count: announcements.length },
            { id: 'profile', label: 'Kelola Profil & Visi', icon: Building },
            { id: 'messages', label: 'Pesan Masuk', icon: Mail, count: messages.filter((m) => !m.read).length, highlight: true },
            { id: 'settings', label: 'Pengaturan & Backup', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0b2d4c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.highlight
                        ? 'bg-amber-100 text-amber-900 font-bold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Workspace (9 cols) */}
        <main className="lg:col-span-9 space-y-6">
          {/* Action notices */}
          {actionNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}
          {actionError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* 1. TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Total Kegiatan</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                    {activities.length}
                  </div>
                  <span className="text-[11px] text-emerald-600 mt-1 block font-medium">Terpublikasi</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Agenda Terjadwal</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                    {agendas.length}
                  </div>
                  <span className="text-[11px] text-blue-600 mt-1 block font-medium">
                    {agendas.filter((a) => a.status === 'akan_datang').length} Akan Datang
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Susunan Pengurus</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                    {officials.length}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Pejabat & Koordinator</span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Album Galeri</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                    {galleries.length}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">Dokumentasi Foto</span>
                </div>
              </div>

              {/* Quick Actions & Recent Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Kegiatan Terbaru
                    </h3>
                    <button
                      onClick={() => setActiveTab('activities')}
                      className="text-xs font-semibold text-[#0b2d4c] hover:underline cursor-pointer"
                    >
                      Kelola Semua
                    </button>
                  </div>
                  <div className="space-y-3">
                    {activities.slice(0, 4).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs"
                      >
                        <div className="truncate mr-3">
                          <div className="font-semibold text-slate-800 truncate">
                            {act.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {act.date} · {act.category}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setEditingActivity(act);
                            setActivityModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#0b2d4c] rounded cursor-pointer shrink-0"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Agendas */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Agenda Terdekat
                    </h3>
                    <button
                      onClick={() => setActiveTab('agendas')}
                      className="text-xs font-semibold text-[#0b2d4c] hover:underline cursor-pointer"
                    >
                      Kelola Semua
                    </button>
                  </div>
                  <div className="space-y-3">
                    {agendas.slice(0, 4).map((ag) => (
                      <div
                        key={ag.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs"
                      >
                        <div className="truncate mr-3">
                          <div className="font-semibold text-slate-800 truncate">
                            {ag.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {ag.date} · {ag.time}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setEditingAgenda(ag);
                            setAgendaModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-[#0b2d4c] rounded cursor-pointer shrink-0"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. TAB: KELOLA KEGIATAN */}
          {activeTab === 'activities' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Kelola Berita & Kegiatan
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tambah, perbarui, dan atur dokumentasi kegiatan KORPRI Kabupaten Semarang
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingActivity({
                      title: '',
                      category: 'Sosial & Kesejahteraan',
                      date: new Date().toISOString().split('T')[0],
                      location: 'Kabupaten Semarang',
                      coverImage: '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
                      content: '',
                      galleryImages: [],
                      author: 'Humas DP KORPRI Kab. Semarang',
                      isPublished: true,
                    });
                    setActivityModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kegiatan Baru</span>
                </button>
              </div>

              {/* Activities Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Cover</th>
                      <th className="p-3">Judul Kegiatan</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/80">
                        <td className="p-3">
                          <img
                            src={act.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg'}
                            alt={act.title}
                            className="w-12 h-9 object-cover rounded-md"
                          />
                        </td>
                        <td className="p-3 font-semibold text-slate-900 max-w-xs">
                          <div className="line-clamp-2">{act.title}</div>
                        </td>
                        <td className="p-3 text-slate-600">{act.category}</td>
                        <td className="p-3 font-mono text-slate-500">{act.date}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                              act.isPublished !== false
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {act.isPublished !== false ? 'Terbit' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingActivity(act);
                              setActivityModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#0b2d4c] rounded cursor-pointer mr-1"
                            title="Edit Kegiatan"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded cursor-pointer"
                            title="Hapus Kegiatan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. TAB: KELOLA AGENDA */}
          {activeTab === 'agendas' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Kelola Agenda Kegiatan
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atur jadwal pertemuan, upacara, dan kegiatan DP KORPRI Kabupaten Semarang
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAgenda({
                      title: '',
                      date: new Date().toISOString().split('T')[0],
                      time: '08.00 WIB - Selesai',
                      location: 'Kompleks Kantor Bupati Semarang, Ungaran',
                      description: '',
                      status: 'akan_datang',
                    });
                    setAgendaModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Agenda Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Nama Agenda</th>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Lokasi</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {agendas.map((ag) => (
                      <tr key={ag.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono text-slate-600 font-medium">{ag.date}</td>
                        <td className="p-3 font-semibold text-slate-900 max-w-xs">
                          {ag.title}
                        </td>
                        <td className="p-3 text-slate-600">{ag.time}</td>
                        <td className="p-3 text-slate-600 max-w-xs truncate">{ag.location}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                              ag.status === 'selesai'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {ag.status === 'selesai' ? 'Selesai' : 'Akan Datang'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingAgenda(ag);
                              setAgendaModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#0b2d4c] rounded cursor-pointer mr-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAgenda(ag.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. TAB: KELOLA PENGURUS */}
          {activeTab === 'officials' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Kelola Susunan Pengurus
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Atur nama pejabat, jabatan KORPRI, jabatan kedinasan, urutan dan foto pengurus
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingOfficial({
                      name: '',
                      titleSuffix: '',
                      role: '',
                      category: 'bidang',
                      division: '',
                      agency: '',
                      order: officials.length + 1,
                      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
                    });
                    setOfficialModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengurus Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Urutan</th>
                      <th className="p-3">Foto</th>
                      <th className="p-3">Nama Lengkap & Gelar</th>
                      <th className="p-3">Jabatan KORPRI</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Jabatan Kedinasan</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {officials.map((off) => (
                      <tr key={off.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono font-bold text-slate-500">{off.order}</td>
                        <td className="p-3">
                          <img
                            src={off.photoUrl || '/src/assets/images/ketua_dp_korpri_1793023021428.jpg'}
                            alt={off.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </td>
                        <td className="p-3 font-bold text-slate-900">{off.name}</td>
                        <td className="p-3 font-medium text-[#0b2d4c]">{off.role}</td>
                        <td className="p-3 text-slate-500 uppercase text-[10px]">{off.category}</td>
                        <td className="p-3 text-slate-600 italic text-[11px]">{off.agency || '-'}</td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingOfficial(off);
                              setOfficialModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#0b2d4c] rounded cursor-pointer mr-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOfficial(off.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. TAB: KELOLA GALERI */}
          {activeTab === 'galleries' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Kelola Album Galeri
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Buat album kegiatan baru dan tambahkan koleksi foto dokumentasi
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingGallery({
                      title: '',
                      date: new Date().toISOString().split('T')[0],
                      category: 'Dokumentasi',
                      coverImage: '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
                      description: '',
                      images: [],
                    });
                    setGalleryModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Album Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleries.map((gal) => (
                  <div
                    key={gal.id}
                    className="border border-slate-200 rounded-xl p-4 flex gap-4 bg-slate-50/50"
                  >
                    <img
                      src={gal.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg'}
                      alt={gal.title}
                      className="w-24 h-20 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {gal.title}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {gal.date} · {gal.images.length} Foto
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            setEditingGallery(gal);
                            setGalleryModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-semibold cursor-pointer"
                        >
                          Edit Album
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(gal.id)}
                          className="px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-semibold cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TAB: KELOLA INFORMASI & DOKUMEN */}
          {activeTab === 'announcements' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Kelola Informasi & Dokumen Resmi
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Publikasi surat edaran, pengumuman, dan file unduhan resmi
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAnnouncement({
                      title: '',
                      category: 'pengumuman',
                      documentNumber: '',
                      date: new Date().toISOString().split('T')[0],
                      fileName: 'Surat_Resmi_KORPRI.pdf',
                      fileSize: '1.2 MB',
                      description: '',
                    });
                    setAnnouncementModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Dokumen Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Nomor Surat</th>
                      <th className="p-3">Judul Pengumuman</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {announcements.map((ann) => (
                      <tr key={ann.id} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono text-slate-500">{ann.date}</td>
                        <td className="p-3 font-mono font-medium text-slate-700">{ann.documentNumber || '-'}</td>
                        <td className="p-3 font-semibold text-slate-900 max-w-xs">
                          {ann.title}
                        </td>
                        <td className="p-3 uppercase text-[10px] font-bold text-[#0b2d4c]">
                          {ann.category}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              setEditingAnnouncement(ann);
                              setAnnouncementModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#0b2d4c] rounded cursor-pointer mr-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. TAB: KELOLA PROFIL */}
          {activeTab === 'profile' && profile && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Kelola Konten Profil & Visi Misi
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ubah penjelasan organisasi, rumusan visi, butir misi, serta program kerja
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Profil Singkat DP KORPRI Kabupaten Semarang
                  </label>
                  <textarea
                    rows={4}
                    value={profile.profileSemarang}
                    onChange={(e) => setProfile({ ...profile, profileSemarang: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tentang KORPRI (Sejarah & Landasan)
                  </label>
                  <textarea
                    rows={3}
                    value={profile.aboutKorpri}
                    onChange={(e) => setProfile({ ...profile, aboutKorpri: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Visi Organisasi
                  </label>
                  <textarea
                    rows={2}
                    value={profile.vision}
                    onChange={(e) => setProfile({ ...profile, vision: e.target.value })}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Misi Organisasi (Satu per baris)
                  </label>
                  <textarea
                    rows={5}
                    value={profile.missions.join('\n')}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        missions: e.target.value.split('\n').filter((l) => l.trim()),
                      })
                    }
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Profil</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 8. TAB: PESAN MASUK */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Kotak Masuk Pesan Publik ({messages.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aspirasi dan pertanyaan yang dikirimkan oleh warga atau anggota ASN melalui formulir kontak
                </p>
              </div>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{msg.name}</span>
                        <span className="text-slate-400">({msg.email})</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(msg.createdAt).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="font-semibold text-[#0b2d4c]">
                      Perihal: {msg.subject}
                    </div>

                    {msg.phone && (
                      <div className="text-slate-500">No. WhatsApp / HP: {msg.phone}</div>
                    )}

                    <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={async () => {
                          if (!window.confirm('Hapus pesan ini?')) return;
                          await api.deleteMessage(msg.id);
                          loadAdminData();
                          notify('Pesan berhasil dihapus.');
                        }}
                        className="text-red-600 hover:text-red-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Pesan</span>
                      </button>
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Belum ada pesan masuk dari pengunjung.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. TAB: PENGATURAN WEBSITE & BACKUP */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6">
              {/* Settings Form */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Pengaturan Identitas & Kontak Website
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Konfigurasi nama website, alamat kantor sekretariat, telepon, dan akun media sosial
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Resmi Organisasi
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Singkatan Nama
                      </label>
                      <input
                        type="text"
                        value={settings.shortName}
                        onChange={(e) => setSettings({ ...settings, shortName: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tagline Organisasi
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Sekretariat Lengkap
                    </label>
                    <textarea
                      rows={2}
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nomor Telepon
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Resmi
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Akun Instagram
                      </label>
                      <input
                        type="text"
                        value={settings.instagram}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan Website</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Database Backup & Restore Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Pencadangan & Pemulihan Database (Backup & Restore)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unduh snapshot seluruh data website untuk arsip atau impor kembali file JSON cadangan
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    onClick={handleDownloadBackup}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#0b2d4c]" />
                    <span>Unduh Cadangan JSON (Export)</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-slate-600" />
                    <span>Pulihkan dari File Cadangan (Restore)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreBackupFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: EDIT / TAMBAH KEGIATAN */}
      {activityModalOpen && editingActivity && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingActivity.id ? 'Edit Kegiatan KORPRI' : 'Tambah Kegiatan Baru'}
            </h3>

            <form onSubmit={handleSaveActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Berita / Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={editingActivity.title || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  placeholder="Contoh: Apel Peringatan HUT KORPRI Tingkat Kabupaten Semarang"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={editingActivity.category || 'Sosial & Kesejahteraan'}
                    onChange={(e) => setEditingActivity({ ...editingActivity, category: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                  >
                    <option value="Sosial & Kesejahteraan">Sosial & Kesejahteraan</option>
                    <option value="Upacara">Upacara</option>
                    <option value="Olahraga & Seni">Olahraga & Seni</option>
                    <option value="Rapat Kerja">Rapat Kerja</option>
                    <option value="Pendidikan & Pelatihan">Pendidikan & Pelatihan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Kegiatan</label>
                  <input
                    type="date"
                    required
                    value={editingActivity.date || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, date: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  value={editingActivity.location || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                  placeholder="Contoh: Pendopo Rumah Dinas Bupati Semarang di Ungaran"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Foto Utama (Cover) URL atau Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingActivity.coverImage || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, coverImage: e.target.value })}
                    placeholder="/src/assets/images/..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                  <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageFileChange(e, (url) =>
                          setEditingActivity({ ...editingActivity, coverImage: url })
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Isi Berita Lengkap *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editingActivity.content || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, content: e.target.value })}
                  placeholder="Tuliskan berita atau laporan kegiatan secara lengkap di sini..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#0b2d4c]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="actPublished"
                  checked={editingActivity.isPublished !== false}
                  onChange={(e) => setEditingActivity({ ...editingActivity, isPublished: e.target.checked })}
                  className="rounded text-[#0b2d4c]"
                />
                <label htmlFor="actPublished" className="font-semibold text-slate-700 cursor-pointer">
                  Terbitkan di Halaman Publik
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActivityModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-[#0b2d4c] hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Simpan Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH AGENDA */}
      {agendaModalOpen && editingAgenda && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingAgenda.id ? 'Edit Agenda' : 'Tambah Agenda Baru'}
            </h3>

            <form onSubmit={handleSaveAgenda} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Agenda Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={editingAgenda.title || ''}
                  onChange={(e) => setEditingAgenda({ ...editingAgenda, title: e.target.value })}
                  placeholder="Contoh: Upacara HUT KORPRI ke-55"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={editingAgenda.date || ''}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, date: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={editingAgenda.time || '08.00 WIB - Selesai'}
                    onChange={(e) => setEditingAgenda({ ...editingAgenda, time: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi</label>
                <input
                  type="text"
                  value={editingAgenda.location || ''}
                  onChange={(e) => setEditingAgenda({ ...editingAgenda, location: e.target.value })}
                  placeholder="Contoh: Halaman Kantor Bupati Semarang, Ungaran"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Singkat</label>
                <textarea
                  rows={3}
                  value={editingAgenda.description || ''}
                  onChange={(e) => setEditingAgenda({ ...editingAgenda, description: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAgendaModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-[#0b2d4c] hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH PENGURUS */}
      {officialModalOpen && editingOfficial && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingOfficial.id ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
            </h3>

            <form onSubmit={handleSaveOfficial} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap beserta Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={editingOfficial.name || ''}
                  onChange={(e) => setEditingOfficial({ ...editingOfficial, name: e.target.value })}
                  placeholder="Contoh: Drs. H. Djarot Supriyoto, M.M."
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jabatan di KORPRI *</label>
                  <input
                    type="text"
                    required
                    value={editingOfficial.role || ''}
                    onChange={(e) => setEditingOfficial({ ...editingOfficial, role: e.target.value })}
                    placeholder="Contoh: Ketua DP KORPRI"
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat / Kategori</label>
                  <select
                    value={editingOfficial.category || 'bidang'}
                    onChange={(e) => setEditingOfficial({ ...editingOfficial, category: e.target.value as any })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="harian">Pengurus Harian</option>
                    <option value="bidang">Bidang-Bidang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bidang / Divisi</label>
                  <input
                    type="text"
                    value={editingOfficial.division || ''}
                    onChange={(e) => setEditingOfficial({ ...editingOfficial, division: e.target.value })}
                    placeholder="Contoh: Bidang Organisasi & Kelembagaan"
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urutan Tampil (No)</label>
                  <input
                    type="number"
                    value={editingOfficial.order || 1}
                    onChange={(e) => setEditingOfficial({ ...editingOfficial, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jabatan Kedinasan / Instansi Pemerintah
                </label>
                <input
                  type="text"
                  value={editingOfficial.agency || ''}
                  onChange={(e) => setEditingOfficial({ ...editingOfficial, agency: e.target.value })}
                  placeholder="Contoh: Asisten Pemerintahan dan Kesra Sekda Kab. Semarang"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Foto Pengurus</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingOfficial.photoUrl || ''}
                    onChange={(e) => setEditingOfficial({ ...editingOfficial, photoUrl: e.target.value })}
                    placeholder="/src/assets/images/..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                  <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageFileChange(e, (url) =>
                          setEditingOfficial({ ...editingOfficial, photoUrl: url })
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setOfficialModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-[#0b2d4c] hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Simpan Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH INFORMASI & DOKUMEN */}
      {announcementModalOpen && editingAnnouncement && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingAnnouncement.id ? 'Edit Dokumen' : 'Tambah Dokumen / Pengumuman'}
            </h3>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Dokumen / Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={editingAnnouncement.title || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  placeholder="Contoh: Surat Edaran Pakaian Seragam KORPRI Terbaru"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={editingAnnouncement.category || 'pengumuman'}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value as any })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="pengumuman">Pengumuman</option>
                    <option value="surat_edaran">Surat Edaran</option>
                    <option value="dokumen">Dokumen PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={editingAnnouncement.date || ''}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Surat Resmi</label>
                <input
                  type="text"
                  value={editingAnnouncement.documentNumber || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, documentNumber: e.target.value })}
                  placeholder="Contoh: SE/028/DP-KORPRI/X/2024"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Isi Ringkas</label>
                <textarea
                  rows={3}
                  value={editingAnnouncement.description || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAnnouncementModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-[#0b2d4c] hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / TAMBAH ALBUM GALERI */}
      {galleryModalOpen && editingGallery && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingGallery.id ? 'Edit Album Galeri' : 'Buat Album Galeri Baru'}
            </h3>

            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Album Dokumentasi *
                </label>
                <input
                  type="text"
                  required
                  value={editingGallery.title || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, title: e.target.value })}
                  placeholder="Contoh: Apel Akbar HUT KORPRI Kabupaten Semarang"
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <input
                    type="text"
                    value={editingGallery.category || 'Dokumentasi'}
                    onChange={(e) => setEditingGallery({ ...editingGallery, category: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={editingGallery.date || ''}
                    onChange={(e) => setEditingGallery({ ...editingGallery, date: e.target.value })}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Foto Sampul (Cover)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingGallery.coverImage || ''}
                    onChange={(e) => setEditingGallery({ ...editingGallery, coverImage: e.target.value })}
                    placeholder="/src/assets/images/..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                  <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageFileChange(e, (url) =>
                          setEditingGallery({ ...editingGallery, coverImage: url })
                        )
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Singkat</label>
                <textarea
                  rows={3}
                  value={editingGallery.description || ''}
                  onChange={(e) => setEditingGallery({ ...editingGallery, description: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-[#0b2d4c] hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Simpan Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE ADMIN PASSWORD */}
      {passwordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Ganti Password Administrator
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password Saat Ini *
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password Baru (min. 6 karakter) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white bg-[#0b2d4c] hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
