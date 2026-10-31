import React, { useState } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface ContactPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Mohon lengkapi nama, email, dan pesan Anda.');
      return;
    }

    setSubmitting(true);
    try {
      await api.sendMessage({
        name,
        email,
        phone,
        subject,
        message,
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirimkan pesan. Silakan coba kembali.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafb] text-slate-800 pb-20">
      {/* Header Banner */}
      <section className="bg-[#071d33] text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
              <span>Layanan Komunikasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Kontak & Sekretariat DP KORPRI
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Silakan hubungi Sekretariat Dewan Pengurus KORPRI Kabupaten Semarang untuk keperluan koordinasi keanggotaan, santunan purna tugas, maupun penyampaian aspirasi.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Details & Google Maps (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Informasi Sekretariat
              </h2>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0b2d4c] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Alamat Kantor:</div>
                    <div className="text-slate-600 mt-0.5 leading-relaxed">
                      {settings.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0b2d4c] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Telepon Resmi:</div>
                    <div className="text-slate-600">{settings.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0b2d4c] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Email Kedinasan:</div>
                    <div className="text-slate-600">{settings.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0b2d4c] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Jam Pelayanan:</div>
                    <div className="text-slate-600 mt-0.5">{settings.operationalHours}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Instagram Resmi:</div>
                    <a
                      href={settings.instagramUrl || 'https://instagram.com/korprikabsemarang'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{settings.instagram || '@korprikabsemarang'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps: Ungaran Kabupaten Semarang */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Lokasi Google Maps
                </span>
                <a
                  href="https://maps.google.com/?q=Kantor+Bupati+Semarang+Ungaran"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#0b2d4c] hover:underline flex items-center gap-1"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="aspect-16/10 rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title="Peta Lokasi Gedung KORPRI Kabupaten Semarang"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15837.747915594165!2d110.3983279!3d-7.1332711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7088b90c9b68d9%3A0x6739ee648a56c07e!2sKantor%20Bupati%20Semarang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Formulir Kirim Pesan & Aspirasi
              </h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Ada pertanyaan mengenai kepesertaan KORPRI, berkas santunan purna tugas, atau masukan program? Sampaikan melalui formulir di bawah ini.
              </p>

              {success ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-950">
                    Pesan Anda Berhasil Terkirim!
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                    Terima kasih telah menghubungi DP KORPRI Kabupaten Semarang. Pesan Anda telah dicatat oleh sistem dan akan ditindaklanjuti oleh sekretariat.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer mt-2"
                  >
                    Kirim Pesan Lainnya
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Budi Santoso, S.Sos."
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@instansi.go.id"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nomor HP / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Perihal / Subjek
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Contoh: Pengurusan Santunan Purna Tugas"
                        className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-[#0b2d4c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Isi Pesan / Pertanyaan *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan pesan, permohonan informasi, atau masukan Anda secara jelas..."
                      className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-[#0b2d4c]"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold text-white bg-[#0b2d4c] hover:bg-slate-800 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Sedang Mengirim...' : 'Kirim Pesan Sekarang'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
