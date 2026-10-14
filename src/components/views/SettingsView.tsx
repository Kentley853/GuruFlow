import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  User,
  Globe,
  Lock,
  Building,
  CheckCircle,
  FileText,
  Activity,
  Cpu,
  RefreshCw,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ASSETS } from '../../assets/images';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    userRole,
    setUserRole,
    currentUser,
    activeSchool,
    systemStatus,
    checkSystemStatus,
    auditLogs,
    refreshAuditLogs,
    setIsAuthModalOpen,
    showToast,
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshHealth = async () => {
    setIsRefreshing(true);
    await checkSystemStatus();
    await refreshAuditLogs();
    setIsRefreshing(false);
    showToast('Status sistem dan log audit telah diperbarui.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Pusat Tata Kelola</span>
            <span>·</span>
            <span>Pengaturan Akun & Keamanan Data</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Pengaturan & Kepatuhan Pendidik
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manajemen ruang kerja sekolah, status mesin AI, dan audit kepatuhan privasi data.
          </p>
        </div>

        <button
          onClick={handleRefreshHealth}
          disabled={isRefreshing}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Cek Koneksi & Audit</span>
        </button>
      </div>

      {/* System Status & Engine Health */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">
              Status Mesin AI & Infrastruktur Sekolah
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Produksi Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-slate-400 block text-[11px]">Model Gemini AI:</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>gemini-3.8-flash</span>
            </div>
            <span className="text-[10.5px] text-emerald-700 font-medium">Terintegrasi Server-Side (@google/genai)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-slate-400 block text-[11px]">Penyimpanan Data:</span>
            <div className="font-bold text-slate-900 font-mono">
              Multi-Tenant Isolated
            </div>
            <span className="text-[10.5px] text-slate-500">Partisi Khusus: {activeSchool.id}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-slate-400 block text-[11px]">Satuan Pendidikan:</span>
            <div className="font-bold text-slate-900 truncate">
              {activeSchool.name}
            </div>
            <span className="text-[10.5px] text-slate-500">NPSN: {activeSchool.npsn} · {activeSchool.city}</span>
          </div>
        </div>
      </div>

      {/* User & School Account Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-700" />
            <span>Akun & Hak Akses Pengguna</span>
          </h2>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-xs font-semibold text-slate-900 hover:underline"
          >
            Ganti Akun / Satuan Pendidikan
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
          <img
            src={ASSETS.teacherAvatar}
            alt={currentUser.name}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
            referrerPolicy="no-referrer"
          />

          <div className="space-y-0.5 text-xs">
            <h3 className="text-sm font-bold text-slate-900">{currentUser.name}</h3>
            <p className="text-slate-500">
              {currentUser.email} · NIP: {currentUser.nip || '-'}
            </p>
            <p className="text-slate-700 font-medium">
              Peran: {currentUser.role === 'principal' ? 'Kepala Sekolah' : 'Wali Kelas & Guru Pengajar'} · {activeSchool.name}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Bahasa Antarmuka
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage('id')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  language === 'id'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Bahasa Indonesia (Utama)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Hak Akses Aktif
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUserRole('teacher')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  userRole === 'teacher'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Wali Kelas / Guru
              </button>
              <button
                type="button"
                onClick={() => setUserRole('principal')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  userRole === 'principal'
                    ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Kepala Sekolah
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real Audit Trail History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">
              Riwayat Audit & Kepatuhan Pendidik
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {auditLogs.length} aktivitas tercatat
          </span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto text-xs">
          {auditLogs.length === 0 ? (
            <div className="p-4 text-center text-slate-400">
              Belum ada riwayat audit baru untuk sesi ini.
            </div>
          ) : (
            auditLogs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.documentTitle}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-semibold text-slate-600 uppercase">
                      {log.action.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                </div>

                <div className="sm:text-right text-[10px] text-slate-400 shrink-0 font-mono">
                  <span>{log.userName}</span>
                  <div>{new Date(log.timestamp).toLocaleTimeString('id-ID')} WIB</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dedicated Privacy and Responsible-Use Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">
            Piagam Keamanan Data & Etika Penggunaan AI Sekolah
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900 block">
              1. AI Hanya Menciptakan Draf Usulan
            </span>
            <p className="text-slate-600 leading-relaxed text-[11.5px]">
              GuruFlow tidak pernah memfinalisasi dokumen tanpa persetujuan manual guru. Hasil kecerdasan buatan selalu diperlakukan sebagai usulan awal yang memerlukan verifikasi manusia.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900 block">
              2. Pendidik Memegang Kendali Penuh
            </span>
            <p className="text-slate-600 leading-relaxed text-[11.5px]">
              Setiap keputusan akademik, evaluasi nilai siswa, dan catatan perilaku kelas adalah hak prerogatif pendidik. Sistem tidak mengambil keputusan disiplin secara otomatis.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900 block">
              3. Minimalisasi Data Sensitif
            </span>
            <p className="text-slate-600 leading-relaxed text-[11.5px]">
              Sistem tidak meminta data medis rahasia, nomor rekening orang tua, atau catatan hukum siswa. Guru dianjurkan hanya menggunakan konteks pedagogis umum.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900 block">
              4. Larangan Komersialisasi & Iklan
            </span>
            <p className="text-slate-600 leading-relaxed text-[11.5px]">
              Data aktivitas belajar dan komunikasi orang tua tidak pernah digunakan untuk penargetan iklan atau dibagikan kepada broker data pihak ketiga.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900 block">
              5. Pemisahan Total Antar Institusi
            </span>
            <p className="text-slate-600 leading-relaxed text-[11.5px]">
              Data {activeSchool.name} diisolasi dalam ruang kerja institusi terpisah dan tidak dapat diakses oleh sekolah lain.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
            <span className="font-bold text-slate-900 block">
              6. Hak Penghapusan Penuh Sekolah
            </span>
            <p className="text-slate-600 leading-relaxed text-[11.5px]">
              Pihak sekolah berhak meminta ekspor lengkap atau penghapusan permanen seluruh arsip dokumen tanpa penahanan data sepihak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
