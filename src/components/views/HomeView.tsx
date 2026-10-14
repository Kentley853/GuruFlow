import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  BookOpen,
  FileSpreadsheet,
  ChevronRight,
  Edit2,
  Check,
  Info,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    tasks,
    setActiveView,
    schoolMessage,
    isExtractingMessage,
    extractMessageToTasks,
    approveExtractedTasks,
    rejectExtractedMessage,
    updateExtractedTask,
    approvals,
    currentUser,
    activeSchool,
    parentComms,
    showToast,
  } = useApp();

  const [isWeeklyPlanVisible, setIsWeeklyPlanVisible] = useState(false);
  const [editingTaskIdx, setEditingTaskIdx] = useState<number | null>(null);
  const [inputCustomMessage, setInputCustomMessage] = useState('');
  const [isEditingInput, setIsEditingInput] = useState(false);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'menunggu').length;
  const urgentTasksCount = tasks.filter((t) => t.priority === 'tinggi' && t.status !== 'selesai').length;
  const activeTasksCount = tasks.filter((t) => t.status !== 'selesai').length;
  const parentMessagesCount = parentComms.length;

  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 11
      ? 'Selamat pagi'
      : currentHour < 15
      ? 'Selamat siang'
      : currentHour < 18
      ? 'Selamat sore'
      : 'Selamat malam';

  const teacherFirstName = currentUser?.name ? currentUser.name.split(',')[0] : 'Ibu Maya';

  const totalAdminMinutes = tasks
    .filter((t) => t.status !== 'selesai')
    .reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
  const estimatedHours = Math.floor((totalAdminMinutes * 0.45) / 60);
  const estimatedMins = Math.max(15, Math.round((totalAdminMinutes * 0.45) % 60));

  const handleSusunMingguSaya = () => {
    setIsWeeklyPlanVisible(!isWeeklyPlanVisible);
    if (!isWeeklyPlanVisible) {
      showToast('Alur kerja mingguan dengan blok waktu realistis telah disusun.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Hero Greeting & Smart Summary */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>{currentUser.assignedClass ? `Wali Kelas ${currentUser.assignedClass}` : currentUser.title}</span>
              <span aria-hidden="true">·</span>
              <span>{activeSchool.name}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">Semester Genap 2026/2027</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {timeGreeting}, {teacherFirstName}.
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              GuruFlow mengorganisasi {activeTasksCount} pekerjaan aktif minggu ini berdasarkan tenggat, dampak pengajaran, dan alokasi waktu realistis.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={handleSusunMingguSaya}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl transition-all shadow-xs min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isWeeklyPlanVisible ? 'Tutup Rencana Mingguan' : 'Susun Rencana Kerja'}</span>
            </button>
          </div>
        </div>

        {/* Smart Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => setActiveView('tugas')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 text-left transition-colors group min-h-[88px]"
          >
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {urgentTasksCount}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Tugas perlu perhatian
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5 mt-1 font-medium">
              Lihat prioritas <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          <button
            onClick={() => setActiveView('persetujuan')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 text-left transition-colors group min-h-[88px]"
          >
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {pendingApprovalsCount}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Dokumen menunggu persetujuan
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5 mt-1 font-medium">
              Tinjau draf <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          <button
            onClick={() => setActiveView('komunikasi')}
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 text-left transition-colors group min-h-[88px]"
          >
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {parentMessagesCount}
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">
              Pesan orang tua siap periksa
            </div>
            <span className="text-[11px] text-slate-400 group-hover:text-slate-700 flex items-center gap-0.5 mt-1 font-medium">
              Kirim via WhatsApp <ChevronRight className="w-3 h-3" />
            </span>
          </button>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-left min-h-[88px]">
            <div className="text-xl font-bold text-emerald-950 font-mono tabular-nums">
              ~{estimatedHours > 0 ? `${estimatedHours}j ` : ''}{estimatedMins}m
            </div>
            <div className="text-xs text-emerald-900 font-medium mt-0.5">
              Estimasi efisiensi administrasi
            </div>
            <div className="text-[10.5px] text-emerald-800/80 mt-1">
              Berdasarkan penyusunan draf terorganisasi minggu ini.
            </div>
          </div>
        </div>

        {/* Weekly Plan Dropdown */}
        {isWeeklyPlanVisible && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white animate-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-300" />
                <h3 className="text-xs font-semibold">
                  Rencana Mingguan Optimal (Blok Fokus Terjadwal)
                </h3>
              </div>
              <button
                onClick={() => setIsWeeklyPlanVisible(false)}
                className="text-xs text-slate-400 hover:text-white min-h-[32px] px-2"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-800/80 rounded-lg">
                <span className="font-semibold text-slate-300 block mb-1">Senin</span>
                <p className="text-[11px] text-slate-300">08.00 - 09.30: Mengajar Matematika 5A</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">14.00: Koreksi Latihan (40m)</p>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-lg">
                <span className="font-semibold text-slate-300 block mb-1">Selasa</span>
                <p className="text-[11px] text-slate-300">09.30 - 11.00: Tematik & Pojok Baca</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">13.30: Catatan Wali Kelas (30m)</p>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-lg">
                <span className="font-semibold text-slate-300 block mb-1">Rabu</span>
                <p className="text-[11px] text-slate-300">10.00 - 11.30: IPAS Eksplorasi</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">14.00: Draft Pesan WhatsApp (30m)</p>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-lg border border-amber-500/40">
                <span className="font-semibold text-amber-300 block mb-1">Kamis (Fokus)</span>
                <p className="text-[11px] text-slate-300">08.00 - 09.10: Matematika Pecahan</p>
                <p className="text-[11px] text-amber-300 mt-1 font-mono">13.00: Rekap Nilai 5A (45m)</p>
              </div>

              <div className="p-2.5 bg-slate-800/80 rounded-lg">
                <span className="font-semibold text-slate-300 block mb-1">Jumat</span>
                <p className="text-[11px] text-slate-300">07.30 - 08.45: Senam & Hari Literasi</p>
                <p className="text-[11px] text-emerald-400 mt-1 font-mono">10.30: Finalisasi Arsip (35m)</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* INTELLIGENT INSTRUCTION EXTRACTION */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-7 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Alur Kerja Cerdas</span>
              <span>·</span>
              <span>Instruksi Sekolah ke Tugas Terukur</span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 mt-0.5">
              Ekstraksi Pesan Pimpinan Sekolah
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!schoolMessage.isProcessed ? (
              <button
                onClick={() => extractMessageToTasks(inputCustomMessage || undefined)}
                disabled={isExtractingMessage}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all shadow-xs min-h-[44px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {isExtractingMessage ? 'Menganalisis Instruksi...' : 'Ekstraksi Tugas (Gemini)'}
                </span>
              </button>
            ) : (
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hasil Ekstraksi Siap Ditinjau</span>
              </span>
            )}
          </div>
        </div>

        {/* The Incoming School Message Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                KS
              </div>
              <span className="font-semibold text-slate-900">{schoolMessage.sender}</span>
              <span className="text-slate-500">({schoolMessage.senderRole})</span>
            </div>
            <span className="text-slate-400 text-[11px] font-mono">{schoolMessage.date}</span>
          </div>

          {isEditingInput ? (
            <div className="space-y-2 pt-1">
              <textarea
                rows={3}
                value={inputCustomMessage}
                onChange={(e) => setInputCustomMessage(e.target.value)}
                placeholder="Tempelkan pesan broadcast WhatsApp, pengumuman kepala sekolah, atau surat edaran..."
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-800"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingInput(false)}
                  className="px-3 py-1 text-xs text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <blockquote className="italic text-slate-700 text-xs md:text-sm pl-2 border-l-2 border-slate-300 my-1 flex-1">
                “{inputCustomMessage || schoolMessage.content}”
              </blockquote>
              <button
                onClick={() => setIsEditingInput(true)}
                className="text-[11px] text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-2.5 py-1 rounded-md shrink-0 font-medium"
              >
                Ganti Teks
              </button>
            </div>
          )}
        </div>

        {/* AI Extracted Tasks Area */}
        {schoolMessage.isProcessed && (
          <div className="mt-4 space-y-3 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
            {/* System Priority Justification */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Penjelasan Alur Prioritas:</span>
                <p className="text-amber-900 text-[11.5px] leading-relaxed">
                  {schoolMessage.reasoning}
                </p>
              </div>
            </div>

            {/* List of Extracted Tasks */}
            <div className="space-y-2">
              {schoolMessage.tasks.map((task, idx) => {
                const isEditing = editingTaskIdx === idx;

                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="font-mono text-slate-400">0{idx + 1}.</span>
                        <span className="font-semibold text-slate-900">{task.category}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-600">Tenggat: {task.deadline}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-slate-500">~{task.estimatedMinutes}m</span>
                        <span className="text-slate-300">·</span>
                        <span
                          className={`font-semibold ${
                            task.priority === 'tinggi' ? 'text-red-700' : 'text-amber-700'
                          }`}
                        >
                          Prioritas {task.priority.toUpperCase()}
                        </span>
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => updateExtractedTask(idx, { title: e.target.value })}
                            className="w-full text-xs font-semibold px-2 py-1 border border-slate-300 rounded-lg"
                          />
                          <input
                            type="text"
                            value={task.deadline}
                            onChange={(e) => updateExtractedTask(idx, { deadline: e.target.value })}
                            className="text-xs px-2 py-1 border border-slate-300 rounded-lg w-48"
                          />
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-xs md:text-sm font-semibold text-slate-900">
                            {task.title}
                          </h4>
                          <p className="text-xs text-slate-500">{task.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingTaskIdx(isEditing ? null : idx)}
                        className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors flex items-center gap-1 min-h-[32px]"
                      >
                        <Edit2 className="w-3 h-3 text-slate-500" />
                        <span>{isEditing ? 'Selesai' : 'Edit'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Approval Actions for Teacher (Single primary action) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              <span className="text-xs text-slate-500">
                Persetujuan guru diperlukan sebelum 3 tugas ini masuk ke jadwal aktif Anda.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={rejectExtractedMessage}
                  className="flex-1 sm:flex-initial px-3.5 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  onClick={approveExtractedTasks}
                  className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Setujui & Tambahkan ke Tugas</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Workflows Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Modul Ajar Shortcut */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Modul Ajar Matematika Pecahan
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Draf 2x35 menit SD Kelas 5 Kurikulum Merdeka lengkap dengan apersepsi origami dan asesmen formatif.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-amber-700 font-medium">Status: Draf AI</span>
            <button
              onClick={() => setActiveView('perencanaan')}
              className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 min-h-[36px]"
            >
              <span>Buka Editor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Worksheet Generator Shortcut */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Worksheet Siap Cetak A4
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              10 soal terstruktur (PG, isian, soal cerita kue pandan & olahraga) + kunci jawaban & rubrik penilaian.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Format: Standar A4</span>
            <button
              onClick={() => setActiveView('worksheet')}
              className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 min-h-[36px]"
            >
              <span>Cetak / PDF</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: WhatsApp Communication Shortcut */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-3">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Pesan Orang Tua Adit Pratama
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Draf evaluasi kemajuan belajar pecahan dengan 3 variasi nada: Hangat, Singkat, atau Formal.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-emerald-700 font-medium">Siap Salin WA</span>
            <button
              onClick={() => setActiveView('komunikasi')}
              className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 min-h-[36px]"
            >
              <span>Lihat Draf</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
