import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Download,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const WorksheetView: React.FC = () => {
  const {
    worksheet,
    isRegeneratingWorksheet,
    generateRealWorksheet,
    exportWorksheetWord,
    approveWorksheet,
    showToast,
    activeSchool,
  } = useApp();

  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [grade, setGrade] = useState('Kelas 5 SD');
  const [subject, setSubject] = useState('Matematika');
  const [topic, setTopic] = useState('Pecahan Senilai & Perbandingan');
  const [difficulty, setDifficulty] = useState('Standar Bertingkat (HOTS & Terapan)');

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      showToast('Gunakan opsi cetak browser atau unduh berkas Word.');
    }
  };

  const handleGenerate = () => {
    generateRealWorksheet({ grade, subject, topic, difficulty });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Perangkat Asesmen</span>
            <span>·</span>
            <span>Lembar Aktivitas Siswa Siap Cetak</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium">Standar A4</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Worksheet & Rubrik Penskoran
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Format lembar aktivitas siap cetak dengan 5 PG, 3 isian singkat, 2 soal cerita HOTS, dan kunci jawaban terpisah.
          </p>
        </div>

        {/* Action Toolbar (One primary button) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px] ${
              showAnswerKey
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {showAnswerKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAnswerKey ? 'Sembunyikan Kunci' : 'Tampilkan Kunci'}</span>
          </button>

          <button
            onClick={exportWorksheetWord}
            className="px-3.5 py-1.5 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor Word (.doc)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 min-h-[36px]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen A4</span>
          </button>
        </div>
      </div>

      {/* Inputs Banner for Customization */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 md:p-5 shadow-xs no-print text-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Topik Materi</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Jenjang & Kelas</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tingkat Kesulitan</label>
            <input
              type="text"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Disusun untuk {activeSchool.name} · Tahun Ajaran 2026/2027
          </span>

          <button
            onClick={handleGenerate}
            disabled={isRegeneratingWorksheet}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors min-h-[36px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isRegeneratingWorksheet ? 'Gemini Menyusun...' : 'Susun Ulang Soal (Gemini)'}</span>
          </button>
        </div>
      </div>

      {/* Realistic Printable A4 Sheet Simulation */}
      <div className="bg-white rounded-2xl md:border md:border-slate-300 shadow-sm p-6 sm:p-8 md:p-12 max-w-[850px] mx-auto print-page font-sans">
        {/* School Exam Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">
              {activeSchool.name}
            </h2>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              LEMBAR AKTIVITAS SISWA: {worksheet.topic.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-500">
              Mata Pelajaran: {worksheet.subject} · {worksheet.grade} · Semester Genap 2026/2027
            </p>
          </div>

          {/* Student Identifiers Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 text-[11px]">Nama Siswa:</span>
              <div className="border-b border-slate-400 mt-1 h-5" />
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Kelas / No. Absen:</span>
              <div className="border-b border-slate-400 mt-1 h-5" />
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Hari / Tanggal:</span>
              <div className="border-b border-slate-400 mt-1 h-5" />
            </div>
            <div>
              <span className="text-slate-500 text-[11px]">Nilai:</span>
              <div className="border-b border-slate-400 mt-1 h-5 font-mono text-center text-slate-400">
                [ &nbsp; / 100 ]
              </div>
            </div>
          </div>
        </div>

        {/* Questions Area */}
        <div className="space-y-6 text-xs sm:text-sm">
          {/* Section A: Pilihan Ganda */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Bagian I. Pilihan Ganda (Bobot 50 Poin)
              </span>
              <span className="text-[11px] text-slate-400">Pilihlah satu jawaban yang paling tepat</span>
            </div>

            <div className="space-y-4 pt-1">
              {worksheet.questions
                .filter((q) => q.type === 'pilihan_ganda')
                .map((q, idx) => (
                  <div key={q.id} className="space-y-2">
                    <p className="font-medium text-slate-900 leading-relaxed">
                      {idx + 1}. {q.question}
                    </p>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 text-xs text-slate-700">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] shrink-0 font-mono">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt.replace(/^[A-D]\.\s*/, '')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Section B: Isian Singkat */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Bagian II. Isian Singkat (Bobot 30 Poin)
              </span>
              <span className="text-[11px] text-slate-400">Tuliskan jawaban ringkas dan tepat</span>
            </div>

            <div className="space-y-4 pt-1">
              {worksheet.questions
                .filter((q) => q.type === 'isian_singkat')
                .map((q, idx) => (
                  <div key={q.id} className="space-y-1.5">
                    <p className="font-medium text-slate-900 leading-relaxed">
                      {idx + 6}. {q.question}
                    </p>
                    <div className="pl-4 pt-1">
                      <div className="border-b border-dotted border-slate-400 h-6 w-3/4 max-w-sm" />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section C: Soal Cerita / HOTS */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Bagian III. Soal Cerita Terapan (Bobot 20 Poin)
              </span>
              <span className="text-[11px] text-slate-400">Tuliskan cara penyelesaian dan kesimpulan</span>
            </div>

            <div className="space-y-5 pt-1">
              {worksheet.questions
                .filter((q) => q.type === 'soal_cerita')
                .map((q, idx) => (
                  <div key={q.id} className="space-y-2">
                    <p className="font-medium text-slate-900 leading-relaxed">
                      {idx + 9}. {q.question}
                    </p>
                    <div className="pl-4 space-y-2">
                      <div className="border border-slate-200 rounded-lg p-3 min-h-[70px] bg-slate-50/50 text-[11px] text-slate-400">
                        Ruang pengerjaan siswa...
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Answer Key & Scoring Guide (Collapsible for Teacher) */}
        {showAnswerKey && (
          <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 text-xs text-slate-700 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-slate-900">
                KUNCI JAWABAN & PEDOMAN PENSKORAN RESMI GURU
              </h4>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] whitespace-pre-line leading-relaxed">
              {worksheet.scoringRubric}
            </div>
          </div>
        )}

        {/* Footer Approval Bar */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
          <span>Status Lembar Kerja: {worksheet.status === 'disetujui' ? 'Disetujui Guru' : 'Draf AI'}</span>
          {worksheet.status !== 'disetujui' && (
            <button
              onClick={approveWorksheet}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Setujui Lembar Aktivitas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
