import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';

export const WorkloadReportView: React.FC = () => {
  const {
    tasks,
    workloadDays,
    isRebalanced,
    applyWorkloadOptimization,
    revertWorkloadOptimization,
    showToast,
  } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'selesai').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'tinggi' && t.status !== 'selesai').length;
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.status !== 'selesai' ? t.estimatedMinutes : 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Analisis Beban Kerja</span>
            <span>·</span>
            <span>Kecerdasan Administratif & Mitigasi Burnout</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium">Algoritma Penyeimbangan</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Laporan Distribusi Beban Mengajar & Administrasi
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Analisis waktu nyata untuk mencegah kelelahan (burnout) guru dan mengamankan kepatuhan tenggat sekolah.
          </p>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Beban Administrasi</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {totalHours} <span className="text-sm font-normal text-slate-500">jam aktif</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{totalTasks} tugas tercatat minggu ini</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tugas Selesai</div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-1 tabular-nums">
            {completedTasks} <span className="text-sm font-normal text-slate-500">dari {totalTasks}</span>
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Laju penyelesaian stabil</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tugas Berisiko (Tenggat Dekat)</div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1 tabular-nums">
            {highPriorityTasks} <span className="text-sm font-normal text-slate-500">tugas</span>
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Perlu penyelesaian sebelum Jumat</div>
        </div>

        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 shadow-xs">
          <div className="text-xs text-emerald-900 font-medium">Estimasi Waktu Dioptimalkan</div>
          <div className="text-2xl font-bold text-emerald-950 font-mono mt-1 tabular-nums">
            ~{Math.floor((totalMinutes * 0.45) / 60) > 0 ? `${Math.floor((totalMinutes * 0.45) / 60)}j ` : ''}{Math.max(15, Math.round((totalMinutes * 0.45) % 60))}m
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">Berdasarkan otomatisasi draf awal</div>
        </div>
      </div>

      {/* AI Workload Recommendation Card (Prominent Callout with Confirmation) */}
      <div className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Rekomendasi Penyeimbangan Beban Kerja GuruFlow
                </span>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Memerlukan Persetujuan Guru
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed max-w-3xl">
                “Hari Kamis tampak terlalu padat (terakumulasi 4.5 jam tugas administratif di luar jam mengajar). Kami menyarankan memindahkan persiapan worksheet pecahan ke hari Rabu pukul 14.30 untuk mengamankan tenggat pelaporan Jumat.”
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="text-slate-500 text-[11.5px]">
            Sistem tidak memindahkan jadwal secara sepihak. Tindakan Anda menentukan implementasi jadwal.
          </div>

          <div className="flex items-center gap-2">
            {isRebalanced ? (
              <button
                onClick={revertWorkloadOptimization}
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Kembalikan ke Jadwal Awal</span>
              </button>
            ) : null}

            <button
              onClick={applyWorkloadOptimization}
              disabled={isRebalanced}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-xs flex items-center gap-1.5 ${
                isRebalanced
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isRebalanced ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Rekomendasi Diterapkan (Jadwal Seimbang)</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Terapkan Rekomendasi Penyeimbangan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Workload Distribution By Day */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Distribution Chart */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Distribusi Beban Kerja Harian (Menit Tugas Administratif)
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-slate-800 rounded-xs"></span>
                <span>Normal (&le;180m)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-xs"></span>
                <span>Overloaded (&gt;180m)</span>
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {workloadDays.map((day) => {
              const maxScale = 300;
              const pct = Math.min(100, (day.allocatedMinutes / maxScale) * 100);
              const isOver = day.allocatedMinutes > day.maxRecommendedMinutes;

              return (
                <div key={day.day} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold text-slate-900 w-16">{day.day}</span>
                    <span className="text-[11px] text-slate-500">
                      {day.taskCount} tugas administratif
                    </span>
                    <span
                      className={`font-mono tabular-nums font-bold ${
                        isOver ? 'text-amber-700' : 'text-slate-800'
                      }`}
                    >
                      {day.allocatedMinutes} menit ({Math.floor(day.allocatedMinutes / 60)}j {day.allocatedMinutes % 60}m)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOver ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Batas Rekomendasi Harian Sehat:</span>
            <span className="font-semibold text-slate-900">Maksimal 180 menit (3 jam) per hari</span>
          </div>
        </div>

        {/* Most Time-Consuming Task Categories */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            Kategori Paling Menyita Waktu
          </h2>
          <p className="text-xs text-slate-500">
            Berdasarkan durasi tugas dan siklus mingguan kelas 5A.
          </p>

          <div className="space-y-3 pt-1">
            {[
              { label: 'Penyusunan Modul Ajar', pct: 38, hours: '4.4 jam' },
              { label: 'Komunikasi Orang Tua', pct: 24, hours: '2.8 jam' },
              { label: 'Asesmen & Rekap Nilai', pct: 20, hours: '2.3 jam' },
              { label: 'Administrasi Wali Kelas', pct: 18, hours: '2.0 jam' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium text-slate-900">{cat.label}</span>
                  <span className="font-mono text-slate-500">{cat.pct}% ({cat.hours})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-800 h-full rounded-full"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 leading-relaxed">
            Data ini membantu koordinator kurikulum dan kepala sekolah melihat titik sumbatan administratif nyata.
          </div>
        </div>
      </div>
    </div>
  );
};
