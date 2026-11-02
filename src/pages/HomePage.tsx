import React, { useState } from 'react';
import { Activity, Agenda, GalleryAlbum, SiteSettings, ProfileData } from '../types';
import { KorpriLogo } from '../components/KorpriLogo';
import { LightboxModal, LightboxItem } from '../components/LightboxModal';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Instagram,
  Heart,
  MessageCircle,
  ExternalLink,
  Users,
  ChevronRight,
  Megaphone,
  FileText,
} from 'lucide-react';

interface HomePageProps {
  settings: SiteSettings;
  profile: ProfileData;
  activities: Activity[];
  agendas: Agenda[];
  galleries: GalleryAlbum[];
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  profile,
  activities,
  agendas,
  galleries,
  onNavigate,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter 3 latest activities
  const recentActivities = activities.slice(0, 3);

  // Filter 3 upcoming agendas
  const upcomingAgendas = agendas
    .filter((a) => a.status === 'akan_datang')
    .slice(0, 3);

  // Flatten sample photos for gallery preview
  const previewPhotos: { url: string; caption: string; title: string }[] = [];
  galleries.forEach((album) => {
    album.images.forEach((img) => {
      if (previewPhotos.length < 6) {
        previewPhotos.push({
          url: img.url,
          caption: img.caption,
          title: album.title,
        });
      }
    });
  });

  const openLightbox = (index: number) => {
    setLightboxItems(previewPhotos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800">
      {/* 1. HERO SECTION - MATCHING ATTACHMENT DESIGN */}
      <section className="relative overflow-hidden bg-[#002d54] text-white">
        {/* Background Image: Kantor Bupati Semarang & ASN with Official Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/aistudio/Upacara_Bendera_di_Gedung_Pemerintahan__1__0b8c6b33.png"
            alt="Dewan Pengurus KORPRI Kabupaten Semarang"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Soft responsive darkening gradient for text readability on the left */}
          <div className="absolute inset-0 bg-linear-to-r from-[#001f3d]/85 via-[#002d54]/45 to-transparent sm:via-[#002d54]/25"></div>
        </div>

        {/* Hero Interactive Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 min-h-[380px] sm:min-h-[460px] flex items-center">
          <div className="max-w-2xl">
            {/* Elegant Script Kicker: "Dewan Pengurus" */}
            <div className="font-['Caveat',cursive] text-2xl sm:text-3xl lg:text-4xl text-white font-semibold tracking-wide italic mb-0.5 drop-shadow-sm select-none">
              Dewan Pengurus
            </div>

            {/* Huge Bold KORPRI */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none drop-shadow-md">
              KORPRI
            </h1>

            {/* Vibrant Golden Yellow KABUPATEN SEMARANG */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#f1b82d] leading-tight mt-1 mb-3 drop-shadow-md">
              KABUPATEN SEMARANG
            </h2>

            {/* Subtitle / Slogan */}
            <p className="text-sm sm:text-base lg:text-lg font-bold text-white leading-snug drop-shadow-sm">
              ASN Bersatu, KORPRI Kuat, Indonesia Maju
            </p>

            {/* Tagline */}
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mt-1 mb-7 drop-shadow-xs">
              Wadah ASN untuk Berkarya, Mengabdi, dan Melayani
            </p>

            {/* Action Buttons matching the reference design */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('/profil')}
                className="px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-slate-900 bg-[#f1b82d] hover:bg-[#e0a820] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Tentang KORPRI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/kegiatan')}
                className="px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#002d54]/70 hover:bg-[#002d54] border border-white/70 backdrop-blur-xs shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Kegiatan Terbaru</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR QUICK ACTION CARDS STRIP - MATCHING REFERENCE BOTTOM BAR */}
      <section className="bg-white border-b border-slate-200 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Card 1: Berita Terbaru */}
            <button
              onClick={() => onNavigate('/kegiatan')}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-lg transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#002d54] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#002d54] transition-colors leading-tight">
                    Berita Terbaru
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Informasi terkini seputar KORPRI
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002d54] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>

            {/* Card 2: Agenda Kegiatan */}
            <button
              onClick={() => onNavigate('/agenda')}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-lg transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#f1b82d] text-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#002d54] transition-colors leading-tight">
                    Agenda Kegiatan
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Jadwal kegiatan dan agenda penting
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002d54] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>

            {/* Card 3: Pengumuman */}
            <button
              onClick={() => onNavigate('/informasi')}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-lg transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#002d54] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#002d54] transition-colors leading-tight">
                    Pengumuman
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Informasi penting untuk anggota
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002d54] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>

            {/* Card 4: Layanan Anggota */}
            <button
              onClick={() => onNavigate('/profil')}
              className="flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50/80 rounded-lg transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#f1b82d] text-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#002d54] transition-colors leading-tight">
                    Layanan Anggota
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Akses layanan dan informasi anggota
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#002d54] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. TENTANG KAMI SECTION */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Visual Emblem & Info Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-linear-to-b from-[#0b2d4c] to-[#071d33] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl"></div>

                <div className="flex items-center gap-4 mb-6">
                  <KorpriLogo size="xl" light />
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                      PANCA PRASETYA KORPRI
                    </h3>
                    <p className="text-xs text-amber-300 font-medium">
                      Ikrar Janji Pegawai Republik Indonesia
                    </p>
                  </div>
                </div>

                <ol className="space-y-3 text-xs text-slate-200 leading-relaxed border-t border-white/10 pt-4">
                  <li className="flex gap-2.5">
                    <span className="font-bold text-amber-400">1.</span>
                    <span>Setia dan taat kepada Negara Kesatuan dan Pemerintah RI berlandaskan Pancasila & UUD 1945.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-bold text-amber-400">2.</span>
                    <span>Menjunjung tinggi kehormatan bangsa dan negara serta memegang teguh rahasia jabatan.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-bold text-amber-400">3.</span>
                    <span>Mengutamakan kepentingan negara dan masyarakat di atas kepentingan pribadi dan golongan.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-bold text-amber-400">4.</span>
                    <span>Memelihara persatuan dan kesatuan bangsa serta kesetiakawanan KORPRI.</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-bold text-amber-400">5.</span>
                    <span>Menegakkan kejujuran, keadilan, dan disiplin serta meningkatkan kesejahteraan & profesionalisme.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Right Column: Editorial Explanation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                Profil Organisasi
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                Membangun Jiwa Korps yang Solid, Berintegritas, dan Berdaya Saing
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {profile.profileSemarang}
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Di bawah kepengurusan yang berorientasi pada pengabdian dan kemaslahatan bersama, DP KORPRI Kabupaten Semarang senantiasa menjamin transparansi pengelolaan iuran, memfasilitasi santunan tali asih purna tugas, dan mempererat kesetiakawanan segenap ASN di seluruh penjuru Kabupaten Semarang.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/profil')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#0b2d4c] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Selengkapnya Mengenai Profil & Visi Misi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEGIATAN TERBARU */}
      <section className="py-16 bg-[#f4f5f8] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider mb-1">
                Kabar Terkini
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Kegiatan Terbaru
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/kegiatan')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b2d4c] hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>Lihat Semua Kegiatan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentActivities.map((act) => (
              <article
                key={act.id}
                onClick={() => onNavigate(`/kegiatan/${act.slug || act.id}`)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={act.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg'}
                    alt={act.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#0b2d4c]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                    {act.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Unboxed clean metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(act.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[140px]">{act.location}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0b2d4c] transition-colors mb-2.5">
                      {act.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {act.content.replace(/\n+/g, ' ')}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0b2d4c] group-hover:underline">
                      Selengkapnya
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#0b2d4c] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AGENDA TERDEKAT */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider mb-1">
                Jadwal & Agenda
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Agenda Terdekat
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/agenda')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b2d4c] hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>Lihat Seluruh Agenda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingAgendas.map((item) => {
              const dateObj = new Date(item.date);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleDateString('id-ID', { month: 'short' });
              const year = dateObj.getFullYear();

              return (
                <div
                  key={item.id}
                  className="p-6 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Date Block */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0">
                        <span className="text-base font-extrabold text-amber-900 leading-none">
                          {day}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-amber-700 leading-none mt-0.5">
                          {month}
                        </span>
                      </div>
                      <div>
                        <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                          Akan Datang
                        </span>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{year}</div>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => onNavigate('/agenda')}
                      className="text-xs font-semibold text-[#0b2d4c] hover:underline cursor-pointer"
                    >
                      Detail Agenda →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. GALERI KEGIATAN */}
      <section className="py-16 bg-[#fafafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider mb-1">
                Dokumentasi Visual
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Galeri Kegiatan
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/galeri')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#0b2d4c] hover:text-blue-800 transition-colors cursor-pointer"
            >
              <span>Lihat Semua Galeri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {previewPhotos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-square rounded-lg overflow-hidden bg-slate-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="text-[11px] font-medium text-white line-clamp-2">
                    {photo.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM SECTION: "Ikuti Kegiatan Kami @korprikabsemarang" */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-linear-to-r from-slate-900 via-[#0b2d4c] to-slate-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">
                  <Instagram className="w-4 h-4" />
                  <span>Media Sosial Resmi</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                  Ikuti Kegiatan Kami di Instagram
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  Dapatkan informasi paling mutakhir, dokumentasi foto kegiatan, siaran langsung upacara bendera, dan serba-serbi pengabdian ASN Kabupaten Semarang melalui akun Instagram resmi <strong>@korprikabsemarang</strong>.
                </p>
                <a
                  href="https://instagram.com/korprikabsemarang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold text-white bg-linear-to-r from-[#d62976] via-[#fa7e1e] to-[#962fbf] hover:opacity-90 transition-opacity shadow-md"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Buka Akun @korprikabsemarang</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Mock Instagram Feed Cards with authentic captions */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
                <a
                  href="https://instagram.com/korprikabsemarang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 transition-all text-left block w-44 sm:w-48 group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-black/20 mb-2">
                    <img
                      src="/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg"
                      alt="Instagram Post"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400 fill-red-400" /> 184
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-slate-300" /> 19
                    </span>
                  </div>
                  <p className="text-[11px] text-white line-clamp-2 leading-tight">
                    Penyerahan tali asih & santunan purna tugas KORPRI Kab. Semarang di Pendopo Bupati...
                  </p>
                </a>

                <a
                  href="https://instagram.com/korprikabsemarang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/15 transition-all text-left block w-44 sm:w-48 group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-black/20 mb-2">
                    <img
                      src="/src/assets/images/kegiatan_donor_darah_1793022976420.jpg"
                      alt="Instagram Post"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-300 mb-1">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400 fill-red-400" /> 230
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-slate-300" /> 34
                    </span>
                  </div>
                  <p className="text-[11px] text-white line-clamp-2 leading-tight">
                    Aksi donor darah KORPRI Peduli Sesama memperingati HUT KORPRI di aula Setda Ungaran...
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxItems.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < lightboxItems.length - 1 ? prev + 1 : 0))}
      />
    </div>
  );
};
