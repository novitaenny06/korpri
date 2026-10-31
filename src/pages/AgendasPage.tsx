import React, { useState } from 'react';
import { Agenda } from '../types';
import { Calendar, Clock, MapPin, CheckCircle2, CalendarPlus, ChevronRight } from 'lucide-react';

interface AgendasPageProps {
  agendas: Agenda[];
  onNavigate: (path: string) => void;
}

export const AgendasPage: React.FC<AgendasPageProps> = ({ agendas }) => {
  const [activeTab, setActiveTab] = useState<'akan_datang' | 'selesai' | 'semua'>('akan_datang');

  const today = new Date().toISOString().split('T')[0];

  // Auto categorize
  const processedAgendas = agendas.map((ag) => ({
    ...ag,
    computedStatus: ag.date < today ? 'selesai' : 'akan_datang',
  }));

  const filtered = processedAgendas.filter((ag) => {
    if (activeTab === 'semua') return true;
    return ag.computedStatus === activeTab;
  });

  // Helper to generate Google Calendar link
  const createGoogleCalendarUrl = (ag: Agenda) => {
    const cleanDate = ag.date.replace(/-/g, '');
    const title = encodeURIComponent(ag.title);
    const details = encodeURIComponent(`${ag.description}\n\nWaktu: ${ag.time}\nLokasi: ${ag.location}\n\nDP KORPRI Kabupaten Semarang`);
    const location = encodeURIComponent(ag.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${cleanDate}T080000Z/${cleanDate}T120000Z&details=${details}&location=${location}`;
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-[#071d33] text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <span>Jadwal Kegiatan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Agenda Kegiatan KORPRI Kabupaten Semarang
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Jadwal pelaksanaan upacara, apel besar, penyaluran tali asih purna tugas, bakti sosial, dan agenda kedinasan KORPRI lainnya.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Status Tab Controls */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-2 flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('akan_datang')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'akan_datang'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda Akan Datang (
              {processedAgendas.filter((a) => a.computedStatus === 'akan_datang').length}
              )
            </button>

            <button
              onClick={() => setActiveTab('selesai')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'selesai'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda Selesai (
              {processedAgendas.filter((a) => a.computedStatus === 'selesai').length}
              )
            </button>

            <button
              onClick={() => setActiveTab('semua')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'semua'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({processedAgendas.length})
            </button>
          </div>
        </div>

        {/* Agenda Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const dateObj = new Date(item.date);
            const isDone = item.computedStatus === 'selesai';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                  isDone
                    ? 'border-slate-200 opacity-90'
                    : 'border-slate-300 hover:border-[#0b2d4c] hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Date Block */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                          isDone
                            ? 'bg-slate-100 border-slate-200 text-slate-500'
                            : 'bg-amber-50 border-amber-300 text-amber-900'
                        }`}
                      >
                        <span className="text-xl font-extrabold leading-none">
                          {dateObj.getDate()}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider leading-none mt-1">
                          {dateObj.toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500 font-mono">
                          {dateObj.toLocaleDateString('id-ID', { weekday: 'long' })},{' '}
                          {dateObj.getFullYear()}
                        </div>
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm mt-1 ${
                            isDone
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isDone ? 'Telah Selesai' : 'Akan Datang'}
                        </span>
                      </div>
                    </div>

                    {!isDone && (
                      <a
                        href={createGoogleCalendarUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Tambahkan ke Google Calendar"
                        className="p-2 text-slate-500 hover:text-[#0b2d4c] hover:bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CalendarPlus className="w-4 h-4 text-amber-600" />
                        <span className="hidden sm:inline text-[11px] font-semibold">Simpan Jadwal</span>
                      </a>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-3">
                    {item.title}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800">{item.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-relaxed">{item.location}</span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-800">
              Tidak ada agenda pada kategori ini
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Silakan periksa tab lainnya untuk melihat seluruh riwayat agenda KORPRI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
