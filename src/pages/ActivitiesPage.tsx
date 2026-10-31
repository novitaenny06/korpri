import React, { useState, useMemo } from 'react';
import { Activity } from '../types';
import { Search, Calendar, MapPin, ArrowRight, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivitiesPageProps {
  activities: Activity[];
  onNavigate: (path: string) => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({
  activities,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Categories list
  const categories = [
    'Semua',
    'Sosial & Kesejahteraan',
    'Upacara',
    'Olahraga & Seni',
    'Rapat Kerja',
    'Pendidikan & Pelatihan',
  ];

  // Available years
  const years = ['Semua', '2026', '2025', '2024'];

  // Filtered activities
  const filtered = useMemo(() => {
    return activities.filter((act) => {
      const matchCategory =
        selectedCategory === 'Semua' || act.category === selectedCategory;

      const matchYear =
        selectedYear === 'Semua' || (act.date || '').startsWith(selectedYear);

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        act.title.toLowerCase().includes(q) ||
        act.content.toLowerCase().includes(q) ||
        (act.location && act.location.toLowerCase().includes(q));

      return matchCategory && matchYear && matchSearch;
    });
  }, [activities, selectedCategory, selectedYear, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-[#071d33] text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <span>Warta & Berita Resmi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Kegiatan DP KORPRI Kabupaten Semarang
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Dokumentasi, warta kedinasan, kegiatan sosial kemanusiaan, olahraga, serta agenda resmi Korps Pegawai Republik Indonesia Kabupaten Semarang.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 space-y-4 mb-8">
          {/* Top Row: Search & Year */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari judul berita atau lokasi kegiatan..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0b2d4c]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <span className="text-xs text-slate-500 font-medium">Tahun:</span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {years.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => handleYearChange(yr)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Segmented Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Kategori:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0b2d4c] text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        {paginatedActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedActivities.map((act) => (
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
                      <span className="truncate max-w-[130px]">{act.location}</span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0b2d4c] transition-colors mb-2.5">
                      {act.title}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {act.content.replace(/\n+/g, ' ')}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0b2d4c] group-hover:underline">
                      Baca Berita
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#0b2d4c] transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <h3 className="text-base font-semibold text-slate-800">
              Tidak ada kegiatan ditemukan
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Silakan ganti kata kunci pencarian atau sesuaikan filter kategori dan tahun yang dipilih.
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#0b2d4c] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Halaman selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
