import React, { useState } from 'react';
import { KorpriLogo } from './KorpriLogo';
import { Instagram, Menu, X, Shield, Search, ArrowRight, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  isAdminLoggedIn = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation Items matching the design image:
  // Beranda | Profil | Kepengurusan | Program & Kegiatan | Berita | Galeri | Download | Kontak
  const navItems = [
    { label: 'Beranda', path: '/' },
    { label: 'Profil', path: '/profil' },
    { label: 'Kepengurusan', path: '/pengurus' },
    { label: 'Program & Kegiatan', path: '/kegiatan?cat=program' },
    { label: 'Berita', path: '/kegiatan' },
    { label: 'Galeri', path: '/galeri' },
    { label: 'Download', path: '/informasi' },
    { label: 'Kontak', path: '/kontak' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchModalOpen(false);
    onNavigate(`/kegiatan?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      {/* Official DP KORPRI Dark Navy Header */}
      <header className="sticky top-0 z-50 bg-[#002d54] text-white shadow-md border-b border-[#033b6d] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left Brand Lockup matching user image */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 text-left focus-visible:outline-hidden group cursor-pointer"
            >
              {/* Emblem */}
              <KorpriLogo size="md" light />

              {/* Text Lockup */}
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-wider leading-none group-hover:text-amber-300 transition-colors">
                  KORPRI
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-200 tracking-wider uppercase mt-1 leading-none">
                  KABUPATEN SEMARANG
                </span>
              </div>
            </button>

            {/* Vertical hairline divider matching the reference design */}
            <div className="hidden lg:block h-9 w-px bg-white/20 ml-2" aria-hidden="true" />
          </div>

          {/* Center Navigation Links (Matching: Beranda, Profil, Kepengurusan, Program & Kegiatan, Berita, Galeri, Download, Kontak) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13.5px] font-medium text-slate-200">
            {navItems.map((item) => {
              // Active determination
              let isActive = false;
              if (item.path === '/') {
                isActive = currentPath === '/';
              } else if (item.label === 'Kepengurusan') {
                isActive = currentPath.startsWith('/pengurus');
              } else if (item.label === 'Download') {
                isActive = currentPath.startsWith('/informasi');
              } else if (item.label === 'Berita' || item.label === 'Program & Kegiatan') {
                isActive = currentPath.startsWith('/kegiatan');
              } else {
                isActive = currentPath.startsWith(item.path);
              }

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  className={`transition-all whitespace-nowrap shrink-0 py-2 relative cursor-pointer ${
                    isActive
                      ? 'text-[#f59e0b] font-bold'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Yellow/Gold Active Underline Bar matching user design */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#f59e0b] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search Icon + Instagram + Admin */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Trigger Icon matching the Q icon in user design */}
            <button
              onClick={() => setSearchModalOpen(true)}
              title="Cari Berita, Agenda, dan Dokumen..."
              className="p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Pencarian"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Instagram Quick Link */}
            <a
              href="https://instagram.com/korprikabsemarang"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram Resmi @korprikabsemarang"
              className="hidden sm:flex p-2 text-slate-200 hover:text-pink-400 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Instagram Resmi"
            >
              <Instagram className="w-5 h-5" />
            </a>

            {/* Admin Shield Icon */}
            <button
              onClick={() => handleNavClick('/admin')}
              title={isAdminLoggedIn ? 'Dashboard Administrator' : 'Portal Administrator'}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors focus-visible:outline-hidden"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#002242] border-t border-[#043869] px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/'
                    ? currentPath === '/'
                    : currentPath.startsWith(item.path);

                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#003366] text-[#f59e0b] border-l-4 border-[#f59e0b]'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    )}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="https://instagram.com/korprikabsemarang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-linear-to-r from-[#d62976] via-[#fa7e1e] to-[#962fbf] rounded-lg"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram @korprikabsemarang</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <button
                  onClick={() => handleNavClick('/admin')}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isAdminLoggedIn ? 'Dashboard Administrator' : 'Login Administrator'}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#002d54] uppercase tracking-wider">
                <Search className="w-4 h-4 text-[#002d54]" />
                <span>Pencarian Portal KORPRI</span>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kata kunci: santunan, purna tugas, upacara, seragam..."
                  className="w-full text-sm pl-4 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:border-[#002d54] focus:ring-1 focus:ring-[#002d54]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#002d54] hover:bg-[#002242] text-white rounded-lg cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500 pt-1">
                <span className="font-medium mr-1">Pencarian Populer:</span>
                {['Santunan Purna Tugas', 'Donor Darah', 'HUT KORPRI', 'Batik KORPRI', 'AD/ART'].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSearchModalOpen(false);
                        onNavigate(`/kegiatan?search=${encodeURIComponent(tag)}`);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
