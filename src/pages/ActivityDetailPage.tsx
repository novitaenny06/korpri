import React, { useState } from 'react';
import { Activity } from '../types';
import { LightboxModal, LightboxItem } from '../components/LightboxModal';
import {
  Calendar,
  MapPin,
  User,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface ActivityDetailPageProps {
  activity: Activity;
  allActivities: Activity[];
  onNavigate: (path: string) => void;
}

export const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({
  activity,
  allActivities,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Prepare images for lightbox
  const allImages: LightboxItem[] = [
    { url: activity.coverImage, caption: activity.title, title: 'Foto Utama' },
    ...(activity.galleryImages || []).map((url, i) => ({
      url,
      caption: `Dokumentasi foto ke-${i + 1} - ${activity.title}`,
      title: 'Dokumentasi Kegiatan',
    })),
  ];

  // Related activities in same category or recent
  const related = allActivities
    .filter((a) => a.id !== activity.id)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`${activity.title} - DP KORPRI Kabupaten Semarang`);

  const shareWhatsApp = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
  const shareTwitter = `https://twitter.com/intent/tweet?text=${shareText}&url=${currentUrl}`;

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => onNavigate('/kegiatan')}
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#0b2d4c] font-medium transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Berita Kegiatan</span>
          </button>

          <div className="flex items-center gap-2">
            <span>Kategori:</span>
            <span className="font-semibold text-[#0b2d4c]">{activity.category}</span>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Article Header */}
        <header className="mb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#0b2d4c] font-bold uppercase tracking-wider">
            <span>{activity.category}</span>
            <span aria-hidden="true">·</span>
            <span>DP KORPRI Kabupaten Semarang</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
            {activity.title}
          </h1>

          {/* Unboxed Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 border-y border-slate-200 py-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {new Date(activity.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <span aria-hidden="true">·</span>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{activity.location}</span>
            </div>

            <span aria-hidden="true">·</span>

            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Oleh: {activity.author || 'Humas DP KORPRI'}</span>
            </div>
          </div>
        </header>

        {/* Primary Cover Image with subtle zoom trigger */}
        <div
          onClick={() => {
            setLightboxIndex(0);
            setLightboxOpen(true);
          }}
          className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 shadow-md mb-8 group cursor-pointer"
        >
          <img
            src={activity.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg'}
            alt={activity.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <Eye className="w-3.5 h-3.5" />
            <span>Klik untuk memperbesar</span>
          </div>
        </div>

        {/* Editorial Body Text */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-10">
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
            {activity.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Documentation Photos Grid inside article */}
          {activity.galleryImages && activity.galleryImages.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Dokumentasi Kegiatan Tambahan
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activity.galleryImages.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setLightboxIndex(i + 1);
                      setLightboxOpen(true);
                    }}
                    className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 cursor-pointer border border-slate-200 hover:border-slate-400 transition-all group"
                  >
                    <img
                      src={imgUrl}
                      alt={`Dokumentasi ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Share Bar */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>Bagikan Informasi Ini:</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={shareWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors"
              >
                WhatsApp
              </a>

              <a
                href={shareFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition-colors"
              >
                Facebook
              </a>

              <a
                href={shareTwitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
              >
                X (Twitter)
              </a>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Tautan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Activities */}
        {related.length > 0 && (
          <section className="mt-12">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6">
              Kegiatan KORPRI Lainnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    onNavigate(`/kegiatan/${rel.slug || rel.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col group"
                >
                  <div className="aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={rel.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg'}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium mb-1">
                        {new Date(rel.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0b2d4c]">
                        {rel.title}
                      </h4>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#0b2d4c]">
                      <span>Baca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        items={allImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((p) => (p > 0 ? p - 1 : allImages.length - 1))}
        onNext={() => setLightboxIndex((p) => (p < allImages.length - 1 ? p + 1 : 0))}
      />
    </div>
  );
};
