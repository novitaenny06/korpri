/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api, getAuthToken } from './services/api';
import {
  Activity,
  Agenda,
  Official,
  GalleryAlbum,
  Announcement,
  ProfileData,
  SiteSettings,
} from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { OfficialsPage } from './pages/OfficialsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { ActivityDetailPage } from './pages/ActivityDetailPage';
import { AgendasPage } from './pages/AgendasPage';
import { GalleryPage } from './pages/GalleryPage';
import { InformationPage } from './pages/InformationPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPortal } from './pages/admin/AdminPortal';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [galleries, setGalleries] = useState<GalleryAlbum[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Load public data
  const loadInitialData = async () => {
    try {
      const [
        settingsRes,
        profileRes,
        activitiesRes,
        agendasRes,
        officialsRes,
        galleriesRes,
        announcementsRes,
      ] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getProfile().catch(() => null),
        api.getActivities().catch(() => []),
        api.getAgendas().catch(() => []),
        api.getOfficials().catch(() => []),
        api.getGalleries().catch(() => []),
        api.getAnnouncements().catch(() => []),
      ]);

      if (settingsRes) setSettings(settingsRes);
      if (profileRes) setProfile(profileRes);
      setActivities(activitiesRes);
      setAgendas(agendasRes);
      setOfficials(officialsRes);
      setGalleries(galleriesRes);
      setAnnouncements(announcementsRes);

      // Check admin status
      const authRes = await api.verifyAuth().catch(() => ({ valid: false }));
      setIsAdminLoggedIn(!!authRes?.valid);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Listen to browser navigation
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || !settings || !profile) {
    return (
      <div className="min-h-screen bg-[#fafafb] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-[#0b2d4c] animate-spin"></div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Dewan Pengurus KORPRI Kabupaten Semarang
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Memuat portal resmi...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If in admin route
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return (
      <AdminPortal
        onNavigatePublic={handleNavigate}
        onDataRefresh={loadInitialData}
      />
    );
  }

  // Activity Detail match
  if (currentPath.startsWith('/kegiatan/')) {
    const slug = currentPath.replace('/kegiatan/', '');
    const activity = activities.find(
      (a) => a.slug === slug || a.id === slug
    );

    return (
      <div className="flex flex-col min-h-screen">
        <Header
          currentPath={currentPath}
          onNavigate={handleNavigate}
          isAdminLoggedIn={isAdminLoggedIn}
        />
        <main className="flex-1">
          {activity ? (
            <ActivityDetailPage
              activity={activity}
              allActivities={activities}
              onNavigate={handleNavigate}
            />
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Kegiatan Tidak Ditemukan
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Kegiatan yang Anda cari tidak tersedia atau tautan telah kedaluwarsa.
              </p>
              <button
                onClick={() => handleNavigate('/kegiatan')}
                className="px-4 py-2 bg-[#0b2d4c] text-white rounded-lg text-xs font-semibold"
              >
                Kembali ke Daftar Kegiatan
              </button>
            </div>
          )}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    );
  }

  // Standard Public Routes
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            settings={settings}
            profile={profile}
            activities={activities}
            agendas={agendas}
            galleries={galleries}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/profil' && (
          <ProfilePage
            profile={profile}
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/pengurus' && (
          <OfficialsPage
            officials={officials}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/kegiatan' && (
          <ActivitiesPage
            activities={activities}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/agenda' && (
          <AgendasPage
            agendas={agendas}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/galeri' && (
          <GalleryPage
            galleries={galleries}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/informasi' && (
          <InformationPage
            announcements={announcements}
            onNavigate={handleNavigate}
          />
        )}

        {currentPath === '/kontak' && (
          <ContactPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
