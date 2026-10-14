import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AssistantDrawer } from './components/AssistantDrawer';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PilotRegistrationModal } from './components/PilotRegistrationModal';

// HomeView is eager for immediate first meaningful paint
import { HomeView } from './components/views/HomeView';

// Secondary views are lazy-loaded for optimal mobile performance and fast bundle startup
const TasksView = lazy(() =>
  import('./components/views/TasksView').then((m) => ({ default: m.TasksView }))
);
const LessonPlanView = lazy(() =>
  import('./components/views/LessonPlanView').then((m) => ({ default: m.LessonPlanView }))
);
const WorksheetView = lazy(() =>
  import('./components/views/WorksheetView').then((m) => ({ default: m.WorksheetView }))
);
const ParentCommView = lazy(() =>
  import('./components/views/ParentCommView').then((m) => ({ default: m.ParentCommView }))
);
const MyClassView = lazy(() =>
  import('./components/views/MyClassView').then((m) => ({ default: m.MyClassView }))
);
const CalendarView = lazy(() =>
  import('./components/views/CalendarView').then((m) => ({ default: m.CalendarView }))
);
const WorkloadReportView = lazy(() =>
  import('./components/views/WorkloadReportView').then((m) => ({ default: m.WorkloadReportView }))
);
const ApprovalCenterView = lazy(() =>
  import('./components/views/ApprovalCenterView').then((m) => ({ default: m.ApprovalCenterView }))
);
const PrincipalView = lazy(() =>
  import('./components/views/PrincipalView').then((m) => ({ default: m.PrincipalView }))
);
const SettingsView = lazy(() =>
  import('./components/views/SettingsView').then((m) => ({ default: m.SettingsView }))
);
const LandingPageView = lazy(() =>
  import('./components/views/LandingPageView').then((m) => ({ default: m.LandingPageView }))
);

// Mobile bottom navigation icons
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';

// Lightweight, calm skeleton without layout shift
const ViewSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-6xl mx-auto animate-pulse py-4">
    <div className="h-28 bg-white/70 rounded-2xl border border-slate-200/60" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="h-40 bg-white/70 rounded-2xl border border-slate-200/60" />
      <div className="h-40 bg-white/70 rounded-2xl border border-slate-200/60" />
      <div className="h-40 bg-white/70 rounded-2xl border border-slate-200/60" />
    </div>
  </div>
);

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, userRole, toastMessage } = useApp();

  const renderActiveView = () => {
    // If in principal mode and on the home tab, show the executive dashboard
    if (userRole === 'principal' && activeView === 'beranda') {
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <PrincipalView />
        </Suspense>
      );
    }

    switch (activeView) {
      case 'beranda':
        return <HomeView />;
      case 'tugas':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <TasksView />
          </Suspense>
        );
      case 'perencanaan':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <LessonPlanView />
          </Suspense>
        );
      case 'worksheet':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <WorksheetView />
          </Suspense>
        );
      case 'komunikasi':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <ParentCommView />
          </Suspense>
        );
      case 'kelas':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <MyClassView />
          </Suspense>
        );
      case 'kalender':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <CalendarView />
          </Suspense>
        );
      case 'beban_kerja':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <WorkloadReportView />
          </Suspense>
        );
      case 'persetujuan':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <ApprovalCenterView />
          </Suspense>
        );
      case 'pengaturan':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <SettingsView />
          </Suspense>
        );
      case 'landing_page':
        return (
          <Suspense fallback={<ViewSkeleton />}>
            <LandingPageView />
          </Suspense>
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Body Workspace */}
      {activeView === 'landing_page' ? (
        <main className="flex-1 px-4 py-6 md:py-8">
          {renderActiveView()}
        </main>
      ) : (
        <div className="flex-1 flex max-w-[1536px] w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Central Workspace */}
          <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 md:py-8 overflow-y-auto max-w-full">
            {renderActiveView()}
          </main>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Large touch targets, safe-area support) */}
      <nav
        aria-label="Navigasi Utama Ponsel"
        className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around text-slate-600 no-print safe-area-bottom"
      >
        <button
          onClick={() => setActiveView('beranda')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'beranda' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </button>

        <button
          onClick={() => setActiveView('tugas')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'tugas' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Tugas</span>
        </button>

        <button
          onClick={() => setActiveView('perencanaan')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'perencanaan' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span className="text-[10px] tracking-tight">Modul</span>
        </button>

        <button
          onClick={() => setActiveView('komunikasi')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'komunikasi' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">WA Ortu</span>
        </button>

        <button
          onClick={() => setActiveView('persetujuan')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-lg transition-colors ${
            activeView === 'persetujuan' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Setujui</span>
        </button>
      </nav>

      {/* Interactive Drawers and Overlays */}
      <AssistantDrawer />
      <NotificationsDrawer />
      <AuthModal />
      <OnboardingModal />
      <PilotRegistrationModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-200 border border-slate-800"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-medium text-slate-100">{toastMessage}</span>
        </aside>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
