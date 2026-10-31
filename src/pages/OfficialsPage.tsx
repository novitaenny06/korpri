import React, { useState } from 'react';
import { Official } from '../types';
import { KorpriLogo } from '../components/KorpriLogo';
import {
  Users,
  GitBranch,
  LayoutGrid,
  Search,
  Building,
  Award,
  ChevronDown,
} from 'lucide-react';

interface OfficialsPageProps {
  officials: Official[];
  onNavigate: (path: string) => void;
}

export const OfficialsPage: React.FC<OfficialsPageProps> = ({ officials }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorted officials
  const sorted = [...officials].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Filtered for cards view
  const filteredOfficials = sorted.filter((off) => {
    const matchCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'pembina' && (off.category === 'pembina' || off.category === 'penasihat')) ||
      (selectedCategory === 'harian' && off.category === 'harian') ||
      (selectedCategory === 'bidang' && off.category === 'bidang');

    const matchSearch =
      off.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (off.agency && off.agency.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (off.division && off.division.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSearch;
  });

  // Groups for hierarchical chart view
  const pembinaList = sorted.filter((o) => o.category === 'pembina' || o.category === 'penasihat');
  const ketua = sorted.find((o) => o.role.toLowerCase().includes('ketua dp korpri') || o.role === 'Ketua');
  const wakilKetuaList = sorted.filter((o) => o.category === 'harian' && o.role.toLowerCase().includes('wakil ketua'));
  const sekretarisList = sorted.filter((o) => o.category === 'harian' && o.role.toLowerCase().includes('sekretaris'));
  const bendaharaList = sorted.filter((o) => o.category === 'harian' && o.role.toLowerCase().includes('bendahara'));
  const bidangList = sorted.filter((o) => o.category === 'bidang');

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-[#071d33] text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <span>Kelembagaan Organisasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Susunan Dewan Pengurus KORPRI Kabupaten Semarang
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Struktur kepengurusan resmi Dewan Pengurus Korps Pegawai Republik Indonesia Kabupaten Semarang Masa Bhakti Berjalan.
            </p>
          </div>
        </div>
      </section>

      {/* Control Bar: View Switcher & Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setViewMode('chart')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'chart'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Struktur Bagan Organisasi</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Daftar Kartu Pengurus</span>
            </button>
          </div>

          {/* Filter & Search Controls (for cards view) */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {viewMode === 'cards' && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-hidden focus:border-[#0b2d4c]"
                >
                  <option value="all">Semua Tingkat</option>
                  <option value="pembina">Pembina & Penasihat</option>
                  <option value="harian">Pengurus Harian</option>
                  <option value="bidang">Bidang-Bidang</option>
                </select>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atau jabatan..."
                    className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0b2d4c]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 1. VIEW MODE: HIERARCHICAL CHART (BAGAN STRUKTUR ORGANISASI) */}
        {viewMode === 'chart' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-12 shadow-xs space-y-12 overflow-x-auto">
            {/* Chart Title */}
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                Bagan Hirarki
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Struktur Organisasi Dewan Pengurus KORPRI Kabupaten Semarang
              </h2>
            </div>

            {/* LEVEL 1: Dewan Penasihat & Pembina */}
            <div>
              <div className="text-center mb-4">
                <span className="inline-block text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Dewan Penasihat & Pembina
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {pembinaList.map((item) => (
                  <div
                    key={item.id}
                    className="w-64 bg-slate-50 border border-slate-200 rounded-xl p-4 text-center shadow-xs"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-amber-300">
                      <img
                        src={item.photoUrl || '/src/assets/images/ketua_dp_korpri_1793023021428.jpg'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs font-bold text-[#0b2d4c] uppercase tracking-tight">
                      {item.role}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 mt-1 leading-snug">
                      {item.name}
                    </div>
                    {item.agency && (
                      <div className="text-[11px] text-slate-500 mt-1 italic">
                        {item.agency}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-slate-300"></div>
            </div>

            {/* LEVEL 2: Ketua DP KORPRI */}
            {ketua && (
              <div>
                <div className="flex justify-center">
                  <div className="w-80 bg-linear-to-b from-[#0b2d4c] to-[#071d33] text-white rounded-xl p-6 text-center shadow-lg border-2 border-amber-400 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-xs">
                      Pimpinan Utama
                    </div>
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-white/60 shadow-md">
                      <img
                        src={ketua.photoUrl || '/src/assets/images/ketua_dp_korpri_1793023021428.jpg'}
                        alt={ketua.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                      {ketua.role}
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {ketua.name}
                    </div>
                    {ketua.agency && (
                      <div className="text-[11px] text-slate-300 mt-1 font-normal">
                        {ketua.agency}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Connecting Vertical Line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-slate-300"></div>
            </div>

            {/* LEVEL 3: Pengurus Harian (Wakil Ketua, Sekretaris, Bendahara) */}
            <div>
              <div className="text-center mb-4">
                <span className="inline-block text-[11px] font-bold text-[#0b2d4c] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Pengurus Harian
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {[...wakilKetuaList, ...sekretarisList, ...bendaharaList].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 hover:border-[#0b2d4c] rounded-xl p-4 text-center shadow-xs transition-colors"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border border-slate-200">
                      <img
                        src={item.photoUrl || '/src/assets/images/ketua_dp_korpri_1793023021428.jpg'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-[#0b2d4c] uppercase tracking-wide">
                      {item.role}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 mt-0.5 leading-snug">
                      {item.name}
                    </div>
                    {item.division && (
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {item.division}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-slate-300"></div>
            </div>

            {/* LEVEL 4: Bidang-Bidang */}
            <div>
              <div className="text-center mb-4">
                <span className="inline-block text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Koordinator Bidang-Bidang
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {bidangList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-center"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mx-auto mb-2 border border-slate-300">
                      <img
                        src={item.photoUrl || '/src/assets/images/ketua_dp_korpri_1793023021428.jpg'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      {item.role}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 mt-0.5 leading-tight">
                      {item.name}
                    </div>
                    {item.division && (
                      <div className="text-[10px] text-[#0b2d4c] font-medium mt-1 leading-snug">
                        {item.division}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. VIEW MODE: CARDS GRID (DAFTAR KARTU PENGURUS) */}
        {viewMode === 'cards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOfficials.map((off) => (
                <div
                  key={off.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-square bg-slate-100 overflow-hidden relative">
                    <img
                      src={off.photoUrl || '/src/assets/images/ketua_dp_korpri_1793023021428.jpg'}
                      alt={off.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#0b2d4c]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {off.category.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#0b2d4c] tracking-tight uppercase mb-0.5">
                        {off.role}
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                        {off.name}
                      </h3>
                      {off.division && (
                        <div className="text-xs text-slate-600 font-medium mb-1">
                          {off.division}
                        </div>
                      )}
                      {off.agency && (
                        <div className="text-[11px] text-slate-500 italic">
                          {off.agency}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOfficials.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-800">
                  Tidak ada pengurus yang cocok dengan pencarian
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Coba ubah kata kunci atau pilih kategori lain.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
