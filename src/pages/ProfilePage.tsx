import React, { useState } from 'react';
import { ProfileData, SiteSettings } from '../types';
import { KorpriLogo } from '../components/KorpriLogo';
import {
  BookOpen,
  Award,
  Target,
  CheckCircle2,
  Briefcase,
  MapPin,
  Clock,
  Phone,
  Mail,
  Shield,
  Layers,
} from 'lucide-react';

interface ProfilePageProps {
  profile: ProfileData;
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  settings,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'tentang' | 'visimisi' | 'pancaprasetya' | 'tugasfungsi' | 'proker' | 'sekretariat'>('tentang');

  const tabs = [
    { id: 'tentang', label: 'Tentang KORPRI', icon: BookOpen },
    { id: 'visimisi', label: 'Visi & Misi', icon: Target },
    { id: 'pancaprasetya', label: 'Panca Prasetya', icon: Shield },
    { id: 'tugasfungsi', label: 'Tugas & Fungsi', icon: Award },
    { id: 'proker', label: 'Program Kerja', icon: Briefcase },
    { id: 'sekretariat', label: 'Sekretariat', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-[#071d33] text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <span>Profil Organisasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Profil Dewan Pengurus KORPRI Kabupaten Semarang
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Mengenal lebih dekat sejarah, landasan hukum, ikrar Panca Prasetya, visi misi, serta program pengabdian KORPRI di Kabupaten Semarang.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content with Horizontal Segmented Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Tab Controls */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-1.5 flex flex-wrap gap-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0b2d4c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          {/* TAB 1: TENTANG KORPRI & SEJARAH */}
          {activeTab === 'tentang' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                  Landasan Kelembagaan
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Tentang KORPRI & Profil Kabupaten Semarang
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-5 text-sm text-slate-700 leading-relaxed">
                  <h3 className="text-base font-bold text-slate-900">
                    Sejarah Singkat KORPRI
                  </h3>
                  <p>{profile.aboutKorpri}</p>

                  <h3 className="text-base font-bold text-slate-900 pt-3">
                    Dewan Pengurus KORPRI Kabupaten Semarang
                  </h3>
                  <p>{profile.profileSemarang}</p>

                  <p>
                    Sebagai pilar aparatur negara di daerah, DP KORPRI Kabupaten Semarang berkomitmen menjaga netralitas birokrasi, menguatkan integritas pencegahan gratifikasi dan korupsi, serta membina tali silaturahmi yang kokoh antar sesama aparatur dari berbagai dinas, badan, kecamatan, hingga kelurahan dan desa.
                  </p>
                </div>

                <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-center p-4">
                    <KorpriLogo size="xl" />
                  </div>
                  <div className="border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-semibold text-slate-700">Tanggal Berdiri:</span>
                      <span>29 November 1971</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-semibold text-slate-700">Dasar Hukum:</span>
                      <span>Keppres No. 82/1971</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-semibold text-slate-700">Cakupan Wilayah:</span>
                      <span>Kabupaten Semarang</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-slate-700">Ibukota:</span>
                      <span>Ungaran</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISI & MISI */}
          {activeTab === 'visimisi' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                  Arah Strategis
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Visi dan Misi KORPRI Kabupaten Semarang
                </h2>
              </div>

              {/* Visi Card */}
              <div className="bg-linear-to-r from-[#0b2d4c] to-[#071d33] rounded-xl p-6 sm:p-8 text-white shadow-sm">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                  VISI UTAMA
                </span>
                <p className="text-lg sm:text-xl font-medium italic mt-2 leading-relaxed">
                  "{profile.vision}"
                </p>
              </div>

              {/* Misi List */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Misi Dewan Pengurus KORPRI:
                </h3>
                <div className="space-y-3">
                  {profile.missions.map((misi, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-slate-50/50"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#0b2d4c] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-normal">
                        {misi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PANCA PRASETYA KORPRI */}
          {activeTab === 'pancaprasetya' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                  Janji Pengabdian
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Panca Prasetya Korps Pegawai Republik Indonesia
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Panca Prasetya Korpri adalah sumpah janji moral dan etika setiap Aparatur Sipil Negara dalam menjalankan amanat pelayanan bagi nusa, bangsa, dan segenap rakyat Indonesia:
              </p>

              <div className="space-y-4">
                {profile.pancaPrasetya.map((butir, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/20 transition-all flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-sm font-extrabold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 leading-relaxed">
                        {butir}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TUGAS & FUNGSI */}
          {activeTab === 'tugasfungsi' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                  Mandat Organisasi
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Tugas Pokok & Fungsi KORPRI
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tugas */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#0b2d4c]" />
                    <span>Tugas Pokok</span>
                  </h3>
                  <div className="space-y-3">
                    {profile.tasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-relaxed">
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fungsi */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#0b2d4c]" />
                    <span>Fungsi Organisasi</span>
                  </h3>
                  <div className="space-y-3">
                    {profile.functions.map((func, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-relaxed">
                          {func}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROGRAM KERJA */}
          {activeTab === 'proker' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                  Rencana Strategis
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Program Kerja Unggulan DP KORPRI Kabupaten Semarang
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.workPrograms.map((pro, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-[#0b2d4c] transition-all"
                  >
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {pro.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {pro.description}
                    </p>
                    <ul className="space-y-2 border-t border-slate-100 pt-3">
                      {pro.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2 text-xs text-slate-700"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SEKRETARIAT */}
          {activeTab === 'sekretariat' && (
            <div className="space-y-8 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                  Layanan & Fasilitas
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Sekretariat Dewan Pengurus KORPRI
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4 text-sm text-slate-700">
                  <p>
                    Sekretariat Dewan Pengurus KORPRI Kabupaten Semarang berlokasi strategis di pusat pemerintahan Kabupaten Semarang di Kota Ungaran. Sekretariat bertugas memberikan pelayanan harian keorganisasian, verifikasi klaim santunan duka & tali asih, serta koordinasi keanggotaan ASN.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#0b2d4c] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-900">Alamat Kantor:</div>
                        <div className="text-slate-600 mt-0.5">{profile.secretariatInfo.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#0b2d4c] shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Telepon: </span>
                        <span className="text-slate-600">{profile.secretariatInfo.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#0b2d4c] shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Email: </span>
                        <span className="text-slate-600">{profile.secretariatInfo.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#0b2d4c] shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900">Jam Operasional: </span>
                        <span className="text-slate-600">{profile.secretariatInfo.hours}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => onNavigate('/kontak')}
                      className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Buka Peta & Formulir Kontak
                    </button>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-4/3 bg-slate-100">
                  <img
                    src="/src/assets/images/hero_korpri_semarang_1793022975960.jpg"
                    alt="Sekretariat KORPRI Kabupaten Semarang"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
