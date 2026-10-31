import React from 'react';
import { KorpriLogo } from './KorpriLogo';
import { Instagram, MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#071d33] text-slate-300 border-t border-slate-800">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Organization Identity & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <KorpriLogo size="lg" light />
              <div>
                <h3 className="text-base font-bold text-white tracking-tight uppercase">
                  Dewan Pengurus KORPRI
                </h3>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Kabupaten Semarang
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Wadah berhimpun seluruh Pegawai Aparatur Sipil Negara di lingkungan Pemerintah Kabupaten Semarang untuk meningkatkan profesionalisme, integritas ber-AKHLAK, jiwa korps, serta kesejahteraan anggota dan keluarganya.
            </p>

            <div className="pt-2">
              <a
                href="https://instagram.com/korprikabsemarang"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram @korprikabsemarang</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Col 2: Alamat Sekretariat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Sekretariat DP KORPRI
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Gedung KORPRI / BKD Lt. 2, Kompleks Setda Kab. Semarang, Jl. Diponegoro No. 14, Sidomulyo, Ungaran Barat 50511
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(024) 6921014 / 6921125</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>korpri@semarangkab.go.id</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Senin - Jumat: 07.30 - 15.30 WIB</span>
              </div>
            </div>
          </div>

          {/* Col 3: Menu Cepat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Menu Cepat
            </h4>
            <ul className="grid grid-cols-2 gap-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/profil')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Profil KORPRI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pengurus')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Susunan Pengurus
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/kegiatan')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Berita & Kegiatan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/agenda')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Agenda Kegiatan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/galeri')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Galeri Foto
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/informasi')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Informasi & Dokumen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/kontak')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hubungi Kami
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Tautan Terkait (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              Tautan Terkait
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://semarangkab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Pemkab Semarang</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://bkpsdm.semarangkab.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>BKPSDM Kab. Semarang</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://korpri.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>DP KORPRI Nasional</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-slate-400 cursor-pointer pt-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Portal Administrator</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-slate-800/80 bg-[#051627] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © Dewan Pengurus KORPRI Kabupaten Semarang. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Kabupaten Semarang SEMERBAK</span>
            <span aria-hidden="true">·</span>
            <span>Ungaran, Jawa Tengah</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
