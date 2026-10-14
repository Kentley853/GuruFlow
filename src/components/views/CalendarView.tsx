import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { isRebalanced, applyWorkloadOptimization } = useApp();

  const days = [
    {
      name: 'Senin',
      date: '12 Okt',
      events: [
        { time: '07.00 - 07.45', title: 'Upacara Bendera', type: 'school' },
        { time: '08.00 - 09.30', title: 'Matematika: Pengantar Pecahan', type: 'teaching' },
        { time: '13.30 - 14.10', title: 'Koreksi Latihan Mandiri 5A', type: 'admin', duration: '40m' },
      ],
    },
    {
      name: 'Selasa',
      date: '13 Okt',
      events: [
        { time: '09.30 - 11.00', title: 'Tematik IPAS & Pojok Baca', type: 'teaching' },
        { time: '13.00 - 13.45', title: 'Catatan Observasi Siswa (Budi & Clara)', type: 'admin', duration: '45m' },
      ],
    },
    {
      name: 'Rabu',
      date: '14 Okt',
      events: [
        { time: '08.00 - 09.30', title: 'Matematika: Pecahan Senilai', type: 'teaching' },
        { time: '14.00 - 14.40', title: 'Draf Pesan WhatsApp Orang Tua', type: 'admin', duration: '40m' },
        ...(isRebalanced
          ? [
              {
                time: '14.45 - 15.30',
                title: 'Persiapan Worksheet Pecahan (Hasil Optimasi)',
                type: 'optimized',
                duration: '45m',
              },
            ]
          : []),
      ],
    },
    {
      name: 'Kamis',
      date: '15 Okt',
      events: [
        { time: '08.00 - 09.10', title: 'Matematika: Kerja Kelompok Origami', type: 'teaching' },
        { time: '13.00 - 13.45', title: 'Rekap Nilai Formatif 5A', type: 'admin', duration: '45m' },
        ...(!isRebalanced
          ? [
              {
                time: '14.00 - 15.30',
                title: 'Persiapan Worksheet & Bahan Cetak (Beban Tinggi)',
                type: 'warning',
                duration: '90m',
              },
            ]
          : []),
      ],
    },
    {
      name: 'Jumat',
      date: '16 Okt',
      events: [
        { time: '07.30 - 08.30', title: 'Senam Pagi & Hari Literasi Sekolah', type: 'school' },
        { time: '09.00 - 10.30', title: 'Pendidikan Pancasila & Karakter', type: 'teaching' },
        { time: '11.00 - 11.40', title: 'Validasi Rekap Presensi Bulanan', type: 'admin', duration: '40m' },
        { time: '15.00', title: 'Tenggat Laporan Wali Kelas', type: 'deadline' },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Jadwal Sekolah</span>
            <span>·</span>
            <span>Kalender Akademik & Blok Administrasi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Kalender Mingguan Guru
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Integrasi jam tatap muka kelas, tugas administratif terencana, dan agenda resmi sekolah.
          </p>
        </div>

        {!isRebalanced ? (
          <button
            onClick={applyWorkloadOptimization}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Seimbangkan Beban Kamis</span>
          </button>
        ) : (
          <span className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5 min-h-[36px]">
            <span>Jadwal Kamis Telah Diseimbangkan</span>
          </span>
        )}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {days.map((day) => (
          <div
            key={day.name}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col space-y-3"
          >
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">{day.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{day.date}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                {day.events.length} sesi
              </span>
            </div>

            <div className="space-y-2 flex-1">
              {day.events.map((evt, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                    evt.type === 'teaching'
                      ? 'bg-slate-50 border-slate-200/80 text-slate-800'
                      : evt.type === 'optimized'
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : evt.type === 'warning'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                      : evt.type === 'deadline'
                      ? 'bg-red-50/80 border-red-200 text-red-950 font-semibold'
                      : 'bg-white border-slate-200/70 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-500">
                    <span>{evt.time}</span>
                    {evt.duration && <span>{evt.duration}</span>}
                  </div>
                  <div className="font-semibold text-xs leading-snug">{evt.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
