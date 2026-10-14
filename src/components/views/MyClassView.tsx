import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Download,
  AlertCircle,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const MyClassView: React.FC = () => {
  const { students, showToast, setActiveView, setSelectedStudentCommId, activeSchool, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgress, setFilterProgress] = useState('semua');

  const filteredStudents = students.filter((s) => {
    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()) && !s.nisn.includes(searchTerm)) return false;
    if (filterProgress !== 'semua' && s.mathProgress !== filterProgress) return false;
    return true;
  });

  const handleExportPreparationData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['NISN,Nama Siswa,Gender,Kehadiran,Kemajuan Matematika,Catatan Observasi Guru']
        .concat(
          students.map(
            (s) =>
              `${s.nisn},"${s.name}",${s.gender},${s.attendanceRate}%,"${s.mathProgress}","${s.teacherNotes}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Persiapan_Data_Siswa_Kelas_${currentUser.assignedClass || '5A'}_${activeSchool.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Data persiapan kelas berhasil diekspor ke format .CSV.');
  };

  const handleWriteMessage = (stdId: string) => {
    setSelectedStudentCommId(stdId === 'std-01' ? 'comm-01' : 'comm-02');
    setActiveView('komunikasi');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Kelas {currentUser.assignedClass || '5A'}</span>
            <span>·</span>
            <span>{activeSchool.name}</span>
            <span>·</span>
            <span>{students.length} Siswa Terdaftar</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Buku Catatan Siswa & Observasi
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Kelola rekap presensi, kemajuan belajar pecahan, dan catatan guru untuk persiapan laporan sekolah.
          </p>
        </div>

        <button
          onClick={handleExportPreparationData}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs min-h-[44px]"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Ekspor Data Persiapan (.CSV)</span>
        </button>
      </div>

      {/* Non-Dapodik Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900">
            Kepatuhan Sistem Resmi Sekolah:
          </span>
          <p className="text-slate-600 text-[11.5px] leading-relaxed">
            GuruFlow bukan bagian dari sistem Dapodik Kementerian Pendidikan. GuruFlow berfungsi memvalidasi dan mengorganisir data sebelum guru menginputkannya secara resmi ke sistem pelaporan sekolah.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa atau NISN..."
            className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-xs min-h-[40px]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-600 font-medium">Tingkat Kemajuan:</span>
          <select
            value={filterProgress}
            onChange={(e) => setFilterProgress(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-xs min-h-[40px]"
          >
            <option value="semua">Semua Tingkat</option>
            <option value="Perlu Pendampingan">Perlu Pendampingan</option>
            <option value="Sesuai Harapan">Sesuai Harapan</option>
            <option value="Sangat Baik">Sangat Baik</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View (< 640px) */}
      <div className="sm:hidden space-y-3">
        {filteredStudents.map((s) => (
          <div
            key={s.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{s.name}</h3>
                <span className="text-[11px] font-mono text-slate-400">NISN: {s.nisn} · {s.gender}</span>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  s.mathProgress === 'Perlu Pendampingan'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : s.mathProgress === 'Sangat Baik'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {s.mathProgress}
              </span>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              {s.teacherNotes}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-mono">Kehadiran: {s.attendanceRate}%</span>
              <button
                onClick={() => handleWriteMessage(s.id)}
                className="px-3 py-1.5 text-slate-800 font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 min-h-[36px] flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Pesan WA Ortu</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (>= 640px) */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Nama Siswa & NISN</th>
                <th className="py-3 px-3">Gender</th>
                <th className="py-3 px-3">Kehadiran</th>
                <th className="py-3 px-3">Pemahaman Pecahan</th>
                <th className="py-3 px-4">Catatan Observasi Belajar</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10.5px] font-mono text-slate-400">NISN: {s.nisn}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{s.gender}</td>
                  <td className="py-3 px-3 font-mono text-slate-800 font-semibold">
                    {s.attendanceRate}%
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        s.mathProgress === 'Perlu Pendampingan'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : s.mathProgress === 'Sangat Baik'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {s.mathProgress}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs text-[11.5px] leading-relaxed">
                    {s.teacherNotes}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleWriteMessage(s.id)}
                      className="px-3 py-1.5 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors text-[11px] font-medium min-h-[32px]"
                    >
                      Tulis WA Ortu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
