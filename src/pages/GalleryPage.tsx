import React, { useState } from 'react';
import { GalleryAlbum } from '../types';
import { LightboxModal, LightboxItem } from '../components/LightboxModal';
import { Images, Calendar, Eye, FolderOpen, ArrowLeft } from 'lucide-react';

interface GalleryPageProps {
  galleries: GalleryAlbum[];
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ galleries }) => {
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Prepare photos for lightbox
  const currentItems: LightboxItem[] = selectedAlbum
    ? selectedAlbum.images.map((img) => ({
        url: img.url,
        caption: img.caption,
        title: selectedAlbum.title,
      }))
    : [];

  const handleOpenPhoto = (album: GalleryAlbum, photoIdx: number) => {
    setSelectedAlbum(album);
    setLightboxIndex(photoIdx);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-[#071d33] text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <span>Dokumentasi Kegiatan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Galeri Foto DP KORPRI Kabupaten Semarang
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Arsip album dokumentasi resmi setiap kegiatan, upacara peringatan hari besar, baksos donor darah, dan kebersamaan insan KORPRI.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* If an album is selected, show Album Detail View */}
        {selectedAlbum ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b2d4c] hover:underline mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Semua Album</span>
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {selectedAlbum.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{new Date(selectedAlbum.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedAlbum.images.length} Foto Dokumentasi</span>
                </div>
              </div>
            </div>

            {/* Album Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {selectedAlbum.images.map((photo, pIdx) => (
                <div
                  key={photo.id || pIdx}
                  onClick={() => {
                    setLightboxIndex(pIdx);
                    setLightboxOpen(true);
                  }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                        <Eye className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2">
                      {photo.caption}
                    </p>
                    <span className="text-[11px] font-semibold text-[#0b2d4c] mt-2 block group-hover:underline">
                      Lihat Foto
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Albums Overview Grid */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Menampilkan {galleries.length} Album Dokumentasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries.map((album) => (
                <div
                  key={album.id}
                  onClick={() => setSelectedAlbum(album)}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
                >
                  <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                    <img
                      src={album.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg'}
                      alt={album.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#0b2d4c]/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      {album.category || 'Dokumentasi'}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
                      <Images className="w-3.5 h-3.5" />
                      <span>{album.images?.length || 0} Foto</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(album.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0b2d4c] transition-colors line-clamp-2 leading-snug mb-2">
                        {album.title}
                      </h3>
                      {album.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {album.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0b2d4c] group-hover:underline">
                        Buka Album Dokumentasi
                      </span>
                      <FolderOpen className="w-4 h-4 text-[#0b2d4c]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        items={currentItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((p) => (p > 0 ? p - 1 : currentItems.length - 1))}
        onNext={() => setLightboxIndex((p) => (p < currentItems.length - 1 ? p + 1 : 0))}
      />
    </div>
  );
};
