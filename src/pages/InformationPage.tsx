import React, { useState } from 'react';
import { Announcement } from '../types';
import {
  FileText,
  Download,
  Search,
  Calendar,
  FileCheck,
  Eye,
  X,
  CheckCircle,
} from 'lucide-react';

interface InformationPageProps {
  announcements: Announcement[];
  onNavigate: (path: string) => void;
}

export const InformationPage: React.FC<InformationPageProps> = ({ announcements }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<Announcement | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const filtered = announcements.filter((item) => {
    const matchCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.documentNumber && item.documentNumber.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q);

    return matchCategory && matchSearch;
  });

  const handleDownload = (item: Announcement) => {
    // Generate text blob simulation of official document
    const content = `=====================================================
DEWAN PENGURUS KORPRI KABUPATEN SEMARANG
Pemerintah Kabupaten Semarang - Jawa Tengah
=====================================================

JUDUL DOKUMEN:
${item.title}

NOMOR DOKUMEN:
${item.documentNumber || '-'}

TANGGAL PENETAPAN:
${item.date}

DESKRIPSI / KETERANGAN RESMI:
${item.description}

-----------------------------------------------------
Dokumen ini diunduh secara resmi melalui Website Resmi
Dewan Pengurus KORPRI Kabupaten Semarang.
Email: korpri@semarangkab.go.id | Telp: (024) 6921014
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.fileName || `${item.title.substring(0, 30)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Dokumen "${item.title}" berhasil diunduh.`);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-[#071d33] text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <span>Layanan Informasi Publik</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Informasi, Pengumuman & Dokumen Resmi
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Akses surat edaran resmi, pengumuman keorganisasian, pedoman pakaian seragam KORPRI, formulir santunan duka/pensiun, dan unduhan berkas kedinasan lainnya.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Success toast */}
        {downloadSuccessMessage && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{downloadSuccessMessage}</span>
            </div>
            <button onClick={() => setDownloadSuccessMessage(null)}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({announcements.length})
            </button>
            <button
              onClick={() => setSelectedCategory('pengumuman')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'pengumuman'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pengumuman
            </button>
            <button
              onClick={() => setSelectedCategory('surat_edaran')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'surat_edaran'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Surat Edaran
            </button>
            <button
              onClick={() => setSelectedCategory('dokumen')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'dokumen'
                  ? 'bg-white text-[#0b2d4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dokumen PDF
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari surat atau dokumen..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0b2d4c]"
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#0b2d4c] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b2d4c] flex items-center justify-center shrink-0 border border-blue-100">
                  <FileText className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider text-[#0b2d4c]">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    {item.documentNumber && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-slate-600 font-medium">
                          No: {item.documentNumber}
                        </span>
                      </>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                    <span>File: {item.fileName || 'Dokumen.pdf'}</span>
                    <span aria-hidden="true">·</span>
                    <span>Ukuran: {item.fileSize || '1.2 MB'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => setPreviewDoc(item)}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau</span>
                </button>

                <button
                  onClick={() => handleDownload(item)}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Unduh Dokumen</span>
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-slate-800">
                Tidak ada dokumen yang sesuai pencarian
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Silakan coba kata kunci lain atau pilih kategori "Semua".
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-[#0b2d4c] uppercase tracking-wider">
                  Pratinjau Dokumen Resmi
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {previewDoc.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs text-slate-700 leading-relaxed font-serif">
              <div className="text-center border-b border-slate-200 pb-3 font-sans">
                <div className="font-bold text-slate-900 text-sm">
                  DEWAN PENGURUS KORPRI KABUPATEN SEMARANG
                </div>
                <div className="text-slate-500 text-[11px]">
                  Nomor: {previewDoc.documentNumber || 'SE/028/DP-KORPRI/2024'} · Tanggal: {previewDoc.date}
                </div>
              </div>

              <div className="pt-2">
                <p className="font-sans font-medium text-slate-800 mb-2">Perihal / Ringkasan:</p>
                <p className="italic">{previewDoc.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 font-sans text-slate-500 text-[11px] flex justify-between">
                <span>Format: PDF Dokumen Resmi</span>
                <span>Ukuran: {previewDoc.fileSize || '1.2 MB'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>

              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#0b2d4c] hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas Asli</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
