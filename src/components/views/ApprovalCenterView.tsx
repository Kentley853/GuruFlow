import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  FileText,
} from 'lucide-react';

export const ApprovalCenterView: React.FC = () => {
  const {
    approvals,
    approveItem,
    rejectItem,
    setActiveView,
    currentUser,
    showToast,
  } = useApp();

  const pendingList = approvals.filter((a) => a.status === 'menunggu');
  const finalizedList = approvals.filter((a) => a.status !== 'menunggu');

  const handleOpenReference = (type: string) => {
    if (type === 'modul_ajar') setActiveView('perencanaan');
    else if (type === 'worksheet') setActiveView('worksheet');
    else if (type === 'pesan_ortu') setActiveView('komunikasi');
    else if (type === 'tugas_inbox') setActiveView('beranda');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Pusat Komando GuruFlow</span>
            <span>·</span>
            <span>Kendali & Tata Kelola Dokumen</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Pusat Persetujuan Guru (Approval Center)
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Semua draf yang dihasilkan AI diwajibkan melalui verifikasi manusia sebelum diakui sebagai dokumen resmi atau dikirim ke pihak luar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
            {pendingList.length} draf menunggu verifikasi
          </span>
        </div>
      </div>

      {/* Trust Governance Principle Box */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 block">
            Prinsip Pertanggungjawaban Akademik:
          </span>
          <p className="text-slate-600 text-[11.5px] leading-relaxed">
            GuruFlow mematuhi standar etika pendidik: AI tidak pernah memfinalisasi keputusan nilai, tidak pernah mengirim pesan langsung ke nomor wali murid tanpa izin, dan tidak mempublikasikan jadwal tanpa tinjauan wali kelas.
          </p>
        </div>
      </div>

      {/* Pending Items Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Draf Menunggu Keputusan Anda ({pendingList.length})
        </h2>

        {pendingList.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">
              Semua Draf Telah Selesai Ditinjau
            </h3>
            <p className="text-xs text-slate-500">
              Tidak ada dokumen atau pesan AI yang tertunda saat ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingList.map((item) => (
              <div
                key={item.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Draf AI
                      </span>
                      <span className="text-slate-500">{item.category}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400 font-mono">{item.createdAt}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Disusun oleh: {item.createdBy}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenReference(item.type)}
                      className="px-3 py-1.5 text-xs text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Buka & Periksa Draf</span>
                    </button>
                  </div>
                </div>

                {/* Risk and Review Notice */}
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span className="text-[11.5px] leading-relaxed">
                    <strong>Poin Verifikasi Guru:</strong> {item.riskNotice}
                  </span>
                </div>

                {/* Teacher Approval Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => rejectItem(item.id)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tolak / Minta Revisi</span>
                  </button>

                  <button
                    onClick={() => approveItem(item.id)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Setujui Dokumen Ini</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Finalized Audit History */}
      {finalizedList.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200/80">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Riwayat Persetujuan Terakhir (Audit Trail)
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden text-xs">
            {finalizedList.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-500">
                    Kategori: {item.category} · Diverifikasi oleh {item.approvedBy || currentUser.name}
                  </div>
                </div>

                <div className="shrink-0">
                  {item.status === 'disetujui' ? (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Disetujui
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-800 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      Ditolak
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
