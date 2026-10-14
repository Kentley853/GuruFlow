import React from 'react';
import { useApp, ActiveView } from '../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  MessageCircle,
  Users,
  Calendar,
  BarChart3,
  ShieldCheck,
  Settings,
  Shield,
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  enLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    language,
    tasks,
    approvals,
    parentComms,
    userRole,
    currentUser,
    activeSchool,
  } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'menunggu').length;
  const inProgressTasksCount = tasks.filter((t) => t.status !== 'selesai').length;

  const navItems: NavItem[] = [
    {
      id: 'beranda',
      label: 'Beranda',
      enLabel: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tugas',
      label: 'Tugas Saya',
      enLabel: 'My Tasks',
      icon: CheckSquare,
      badgeCount: inProgressTasksCount,
    },
    {
      id: 'perencanaan',
      label: 'Asisten Perencanaan',
      enLabel: 'Lesson Planning',
      icon: Sparkles,
    },
    {
      id: 'worksheet',
      label: 'Worksheet dan Kuis',
      enLabel: 'Worksheets & Quizzes',
      icon: FileSpreadsheet,
    },
    {
      id: 'komunikasi',
      label: 'Komunikasi Orang Tua',
      enLabel: 'Parent WhatsApp',
      icon: MessageCircle,
      badgeCount: parentComms.length,
    },
    {
      id: 'kelas',
      label: `Kelas Saya (${currentUser.assignedClass || '5A'})`,
      enLabel: `My Class (${currentUser.assignedClass || '5A'})`,
      icon: Users,
    },
    {
      id: 'kalender',
      label: 'Kalender Akademik',
      enLabel: 'Academic Calendar',
      icon: Calendar,
    },
    {
      id: 'beban_kerja',
      label: 'Laporan Beban Kerja',
      enLabel: 'Workload Report',
      icon: BarChart3,
    },
    {
      id: 'persetujuan',
      label: 'Pusat Persetujuan',
      enLabel: 'Approval Center',
      icon: ShieldCheck,
      badgeCount: pendingApprovalsCount,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan & Privasi',
      enLabel: 'Settings & Privacy',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#FAF9F6] border-r border-slate-200/80 p-3 hidden md:flex flex-col justify-between h-[calc(100vh-53px)] sticky top-[53px] no-print">
      <div className="space-y-4">
        {/* User Workspace Info */}
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-tight shrink-0">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {currentUser.name}
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                {userRole === 'principal'
                  ? `Kepala ${activeSchool.name}`
                  : `${currentUser.title || 'Wali Kelas 5A'} · ${activeSchool.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav aria-label="Menu Utama" className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-colors group ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">
                    {language === 'id' ? item.label : item.enLabel}
                  </span>
                </div>

                {item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    className={`text-[10.5px] font-mono tabular-nums px-1.5 py-0.2 rounded font-semibold ${
                      isSelected
                        ? 'bg-slate-800 text-white'
                        : item.id === 'persetujuan'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Trust Safeguard Notice */}
      <div className="pt-3 border-t border-slate-200/70">
        <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 text-[11px] text-emerald-900 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-950">
            <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Kendali Pendidik</span>
          </div>
          <p className="text-emerald-800 text-[10.5px] leading-relaxed">
            AI hanya menyiapkan draf rekomendasi. Seluruh keputusan akademik berada di bawah verifikasi Anda.
          </p>
        </div>
      </div>
    </aside>
  );
};
