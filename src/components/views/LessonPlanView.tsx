import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Download,
  Printer,
  Edit3,
  Columns,
  Check,
  ChevronDown,
  Layers,
  ArrowRight,
  Shield,
  FileText,
} from 'lucide-react';

export const LessonPlanView: React.FC = () => {
  const {
    lessonPlan,
    isGeneratingLessonPlan,
    generateRealLessonPlan,
    regenerateSection,
    updateLessonPlanSection,
    approveLessonPlan,
    toggleLessonPlanAlternative,
    isUsingAlternativeVersion,
    exportLessonPlanWord,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'editor' | 'compare'>('editor');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Guided inputs state
  const [jenjang, setJenjang] = useState('SD');
  const [kelas, setKelas] = useState('5');
  const [mapel, setMapel] = useState('Matematika');
  const [topik, setTopik] = useState('Pecahan Senilai');
  const [durasi, setDurasi] = useState('2 x 35 menit');
  const [tujuan, setTujuan] = useState('Siswa dapat membandingkan dan mengurutkan pecahan');
  const [karakterKelas, setKarakterKelas] = useState('Kemampuan siswa beragam, memerlukan diferensiasi bertahap');

  const handleBuatDraf = (e: React.FormEvent) => {
    e.preventDefault();
    generateRealLessonPlan({ jenjang, kelas, mapel, topik, durasi, tujuan, karakterKelas });
  };

  const handlePrintPDF = () => {
    try {
      window.print();
    } catch {
      showToast('Gunakan opsi cetak browser atau unduh berkas Word.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Title & Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Perencanaan Pembelajaran</span>
            <span>·</span>
            <span>Modul Ajar Kurikulum Merdeka</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Penyusun Modul Ajar Resmi
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Draf perencanaan terstruktur 10 komponen dengan diferensiasi proses, apersepsi kontekstual, dan asesmen formatif.
          </p>
        </div>

        {/* Action Toolbar (One primary action + clean secondary utilities) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-[6px] transition-all min-h-[36px] ${
                activeTab === 'editor'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Draf Modul
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-[6px] transition-all min-h-[36px] ${
                activeTab === 'compare'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bandingkan Versi
            </button>
          </div>

          <button
            onClick={exportLessonPlanWord}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor Word (.doc)</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px]"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak / PDF</span>
          </button>

          {lessonPlan.status !== 'disetujui' ? (
            <button
              onClick={approveLessonPlan}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 min-h-[36px]"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Setujui Modul Ajar</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1.5 min-h-[36px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Telah Disetujui Guru</span>
            </span>
          )}
        </div>
      </div>

      {/* Guided Input Form */}
      <form
        onSubmit={handleBuatDraf}
        className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Parameter Rencana Pembelajaran</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            SD Kelas 5 · Kurikulum Merdeka
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Jenjang</label>
            <select
              value={jenjang}
              onChange={(e) => setJenjang(e.target.value)}
              className="w-full text-xs"
            >
              <option value="SD">SD (Sekolah Dasar)</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Kelas</label>
            <select
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full text-xs"
            >
              <option value="5">Kelas 5 (Fase C)</option>
              <option value="4">Kelas 4 (Fase B)</option>
              <option value="6">Kelas 6 (Fase C)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full text-xs"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Alokasi Waktu</label>
            <input
              type="text"
              value={durasi}
              onChange={(e) => setDurasi(e.target.value)}
              className="w-full text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Topik Pembelajaran</label>
            <input
              type="text"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className="w-full text-xs font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Karakteristik Siswa / Diferensiasi</label>
            <input
              type="text"
              value={karakterKelas}
              onChange={(e) => setKarakterKelas(e.target.value)}
              className="w-full text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1 text-xs">Tujuan Pembelajaran Inti</label>
          <input
            type="text"
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            className="w-full text-xs"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11.5px] text-slate-500">
            Draf dihasilkan dalam format 10 bagian standar Kepmendikbudristek.
          </span>

          <button
            type="submit"
            disabled={isGeneratingLessonPlan}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-all shadow-xs min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isGeneratingLessonPlan ? 'Gemini Menyusun Modul...' : 'Buat Draf Modul (Gemini AI)'}</span>
          </button>
        </div>
      </form>

      {/* Editor Content Area */}
      {activeTab === 'editor' ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Verifikasi Human-in-the-Loop:</span>
              <p className="text-emerald-900 leading-relaxed text-[11.5px]">
                Anda dapat menyunting setiap paragraf secara langsung. Modul Ajar ini resmi tersimpan setelah Anda menekan tombol Setujui di pojok kanan atas.
              </p>
            </div>
          </div>

          {/* 10 Sections Grid */}
          <div className="space-y-3">
            {[
              { key: 'tujuanPembelajaran', title: '1. Tujuan Pembelajaran (Capaian Spesifik)' },
              { key: 'pemahamanBermakna', title: '2. Pemahaman Bermakna' },
              { key: 'pertanyaanPemantik', title: '3. Pertanyaan Pemantik' },
              { key: 'kegiatanPembuka', title: '4. Kegiatan Pembuka (Apersepsi & Motivasi)' },
              { key: 'kegiatanInti', title: '5. Kegiatan Inti (3 Fase Terarah & Kelompok)' },
              { key: 'kegiatanPenutup', title: '6. Kegiatan Penutup & Refleksi' },
              { key: 'strategiDiferensiasi', title: '7. Strategi Diferensiasi (Konten, Proses, Produk)' },
              { key: 'asesmenFormatif', title: '8. Asesmen Formatif & Rubrik Observasi' },
              { key: 'bahanDibutuhkan', title: '9. Alat & Bahan Ajar' },
              { key: 'refleksiGuru', title: '10. Refleksi Pendidik' },
            ].map(({ key, title }) => {
              const isEditing = editingSection === key;
              const sectionContent = (lessonPlan.sections as any)[key] || '';

              return (
                <div
                  key={key}
                  className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">{title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSection(isEditing ? null : key)}
                        className="text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 min-h-[30px]"
                      >
                        {isEditing ? 'Selesai' : 'Sunting'}
                      </button>
                    </div>
                  </div>

                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={sectionContent}
                      onChange={(e) =>
                        updateLessonPlanSection(key as any, e.target.value)
                      }
                      className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-800 leading-relaxed"
                    />
                  ) : (
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                      {sectionContent}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Compare Version Tab */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Perbandingan Versi Diferensiasi</h3>
              <p className="text-xs text-slate-500">
                Pilih antara pendekatan origami konkret (kinestetik) atau komparasi visual kartu pecahan.
              </p>
            </div>
            <button
              onClick={toggleLessonPlanAlternative}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors min-h-[40px]"
            >
              {isUsingAlternativeVersion ? 'Kembali ke Versi Utama' : 'Gunakan Versi Alternatif Ini'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-xs">Versi 1: Origami Lipat Kertas (Konkret)</span>
              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                {lessonPlan.sections.strategiDiferensiasi}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-950 block text-xs">Versi 2: Kartu Domino Pecahan & Garis Bilangan</span>
              <p className="text-emerald-900 leading-relaxed text-[11.5px]">
                {lessonPlan.alternativeVersion?.strategiDiferensiasi ||
                  'Siswa menggunakan kartu domino pecahan senilai dan mencocokkan nilainya pada garis bilangan meja interaktif.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
