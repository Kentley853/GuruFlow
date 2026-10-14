import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, X, ShieldAlert, CheckCircle, Clock, ExternalLink } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveView,
  } = useApp();

  if (!isNotificationsDrawerOpen) return null;

  const handleActionClick = (notif: any) => {
    markNotificationRead(notif.id);
    if (notif.type === 'approval_needed') {
      setActiveView('persetujuan');
    } else if (notif.type === 'task_assigned') {
      setActiveView('tugas');
    } else if (notif.type === 'deadline_warning') {
      setActiveView('beban_kerja');
    }
    setIsNotificationsDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">Notifikasi & Peringatan</h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsRead}
              title="Tandai semua terbaca"
              className="p-1.5 text-xs text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-200/60 transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tandai Terbaca</span>
            </button>
            <button
              onClick={() => setIsNotificationsDrawerOpen(false)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
          {notifications.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-slate-400">
              <Bell className="w-8 h-8 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="font-semibold text-slate-600">Tidak ada notifikasi baru</p>
              <p className="text-[11px] mt-0.5">Semua peringatan dan tugas telah tersinkronisasi.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleActionClick(notif)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  !notif.isRead
                    ? 'bg-slate-50 border-slate-300 ring-1 ring-slate-800/10'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 text-[11.5px] leading-snug">
                    {notif.title}
                  </span>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1"></span>
                  )}
                </div>
                <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{notif.message}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100">
                  <span>{new Date(notif.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                  <span className="text-slate-600 font-medium flex items-center gap-0.5">
                    Lihat <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
