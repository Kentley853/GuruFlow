import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle,
  FileCheck,
  Clock,
  BarChart2,
  AlertCircle,
  Award,
  Sparkles,
  School,
  Building,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';
import { ASSETS } from '../../assets/images';

export const PrincipalView: React.FC = () => {
  const { pilotMetrics, setIsPilotModalOpen, activeSchool } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Principal Greeting & School Header */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <School className="w-3.5 h-3.5 text-slate-700" />
              <span>{activeSchool.name}</span>
              <span>·</span>
              <span>Laporan Eksekutif Kepala Sekolah</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Dashboard Kepala Sekolah & Yayasan
            </h1>

            <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Ringkasan efisiensi agregat program pilot 4 minggu. Menampilkan pengurangan beban administratif tanpa memuat rincian individual siswa.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
            <span className="text-slate-400 block text-[11px]">Penanggung Jawab Pilot:</span>
            <span className="font-bold text-slate-900 block">{activeSchool.principalName}</span>
            <span className="text-slate-500 text-[11px]">{activeSchool.city}</span>
          </div>
        </div>

        {/* Pilot Status Card */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-300 font-mono text-base shrink-0">
              M{pilotMetrics.currentWeek}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Status Program Pilot 4 Minggu</h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono">
                  Minggu {pilotMetrics.currentWeek} dari {pilotMetrics.durationWeeks}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                5 guru diundang · 4 guru aktif menyusun draf harian · 8 masukan evaluasi terkumpul
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPilotModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Lihat Proposal Yayasan
          </button>
        </div>
      </section>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Partisipasi Guru Pilot</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {pilotMetrics.teachersActive} / {pilotMetrics.teachersInvited}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">80% Tingkat Keaktifan Rutin</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Tugas Administrasi Tuntas</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {pilotMetrics.tasksCompleted}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Diselesaikan oleh 4 kelas pilot</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Dokumen Menunggu Validasi</div>
          <div className="text-2xl font-bold text-amber-700 font-mono mt-1 tabular-nums">
            {pilotMetrics.documentsAwaitingApproval}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Menunggu paraf manual guru</div>
        </div>

        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 shadow-xs">
          <div className="text-xs text-emerald-900 font-medium">Rata-Rata Waktu Tersimpan</div>
          <div className="text-2xl font-bold text-emerald-950 font-mono mt-1 tabular-nums">
            ~3.7 jam
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">Per guru / per minggu</div>
        </div>
      </div>

      {/* Bottlenecks Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Masalah yang Paling Sering Menghabiskan Waktu Guru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Analisis terukur dari survei dan log beban kerja guru di Sekolah Cakrawala Jakarta.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {pilotMetrics.bottlenecks.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold text-slate-900">{item.category}</span>
                  <span className="font-mono text-slate-500">
                    {item.percentage}% ({item.hoursPerWeek} jam/minggu)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-slate-900 h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>Implikasi Strategis:</strong> Guru menghabiskan 60% waktu administratifnya hanya untuk menyusun dokumen ajar dan menyapa orang tua lewat WhatsApp. Otomatisasi draf awal memberikan dampak tercepat pada kualitas mengajar di kelas.
          </div>
        </div>

        {/* Adoption by Department & Pilot Feedback */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Adopsi Pilot per Bidang
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemanfaatan modul dan lembar kerja aktif.
            </p>

            <div className="space-y-2.5 mt-3 text-xs">
              {[
                { name: 'Wali Kelas SD 5 (Ibu Maya)', status: '100% Aktif' },
                { name: 'Wali Kelas SD 4 (Ibu Dewi)', status: '100% Aktif' },
                { name: 'Sains & Math SD 6 (Pak Rizky)', status: '85% Aktif' },
                { name: 'Bahasa Indonesia (Pak Anton)', status: '80% Aktif' },
              ].map((dep, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800">{dep.name}</span>
                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                    {dep.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Kutipan Umpan Balik Guru</span>
            </h3>
            <p className="italic text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60 leading-relaxed">
              “{pilotMetrics.quotes[0].text}”
            </p>
            <span className="text-[10.5px] text-slate-400 block mt-1 text-right">
              — {pilotMetrics.quotes[0].author} ({pilotMetrics.quotes[0].role})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
