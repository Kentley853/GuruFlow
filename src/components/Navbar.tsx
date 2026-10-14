import React from 'react';
import { useApp } from '../context/AppContext';
import { ASSETS } from '../assets/images';
import { Sparkles, Bell, ExternalLink, HelpCircle, CheckCircle } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    userRole,
    setUserRole,
    currentUser,
    activeSchool,
    language,
    setLanguage,
    setIsAssistantOpen,
    setIsOnboardingOpen,
    setIsAuthModalOpen,
    setIsNotificationsDrawerOpen,
    unreadNotificationsCount,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2 transition-all no-print">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Brand & School Identifier */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveView('beranda')}
            className="flex items-center gap-2 text-left group focus:outline-none min-h-[44px]"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs group-hover:bg-slate-800 transition-colors shrink-0">
              GF
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900">
                  GuruFlow
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 hidden sm:inline">
                  oleh Droppfloww
                </span>
              </div>
            </div>
          </button>

          <span className="hidden lg:inline text-slate-300">|</span>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            title="Klik untuk beralih satuan pendidikan atau akun"
            className="hidden lg:flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 px-2 py-1.5 rounded-lg transition-colors min-h-[36px]"
          >
            <span className="font-medium text-slate-800">{activeSchool.name}</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Ruang Kerja Terisolasi</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav aria-label="Tautan Eksekutif" className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveView('landing_page')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px] ${
              activeView === 'landing_page'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'hover:bg-slate-200/50 text-slate-700'
            }`}
          >
            <span>Informasi Pilot Sekolah</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-3 py-1.5 rounded-lg hover:bg-slate-200/50 text-slate-700 transition-colors flex items-center gap-1.5 min-h-[36px]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Panduan Ruang Kerja</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Notifications, Role, Assistant & Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsDrawerOpen(true)}
            className="p-2 relative text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Buka Notifikasi & Peringatan"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-mono font-bold flex items-center justify-center ring-2 ring-white">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => setUserRole('teacher')}
              className={`px-2.5 py-1 rounded-[6px] transition-all whitespace-nowrap min-h-[32px] ${
                userRole === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Wali Kelas
            </button>
            <button
              onClick={() => setUserRole('principal')}
              className={`px-2.5 py-1 rounded-[6px] transition-all whitespace-nowrap min-h-[32px] ${
                userRole === 'principal'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kepala Sekolah
            </button>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            title="Ganti Bahasa (Bahasa Indonesia / English)"
            className="hidden sm:flex px-2 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200 hover:border-slate-300 rounded-md bg-white transition-colors min-h-[32px] items-center"
          >
            {language.toUpperCase()}
          </button>

          {/* AI Assistant Button (One primary navy action) */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-lg transition-all shadow-xs min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline">Asisten GuruFlow</span>
            <span className="sm:hidden">Asisten</span>
          </button>

          {/* User Profile / Switch Account Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            title={`Akun: ${currentUser.name}. Klik untuk beralih akun atau sekolah.`}
            className="flex items-center gap-2 pl-1 border-l border-slate-200 focus:outline-none group min-h-[44px]"
          >
            <img
              src={ASSETS.teacherAvatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-slate-400"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
