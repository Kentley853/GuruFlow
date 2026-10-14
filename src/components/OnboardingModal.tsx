import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, ArrowRight, ArrowLeft, Sparkles, X, Shield, Clock } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, showToast, setActiveView, currentUser, activeSchool } = useApp();
  const [step, setStep] = useState(1);

  // Form selections
  const [role, setRole] = useState('Wali Kelas (Homeroom Teacher)');
  const [level, setLevel] = useState('SD - Kelas 5');
  const [subjects, setSubjects] = useState<string[]>(['Matematika', 'IPAS / Tematik']);
  const [selectedTimeDrains, setSelectedTimeDrains] = useState<string[]>([
    'Menyusun Modul Ajar',
    'Menghubungi Orang Tua',
  ]);
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([
    'Teks WhatsApp Siap Salin',
    'Cetak A4 & PDF',
    'Ekspor Word (.doc)',
  ]);

  if (!isOnboardingOpen) return null;

  const timeDrainOptions = [
    'Menyusun Modul Ajar',
    'Membuat Worksheet',
    'Menilai Tugas',
    'Menghubungi Orang Tua',
    'Mengatur Tenggat',
    'Menyusun Laporan',
    'Memindahkan Data Antar Sistem',
  ];

  const outputOptions = [
    'Teks WhatsApp Siap Salin',
    'Cetak A4 & PDF',
    'Ekspor Word (.doc)',
    'Rangkuman Kalender & Tugas',
  ];

  const handleToggleDrain = (item: string) => {
    setSelectedTimeDrains((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleToggleOutput = (item: string) => {
    setSelectedOutputs((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleComplete = () => {
    setIsOnboardingOpen(false);
    setActiveView('beranda');
    showToast('Profil mengajar berhasil dikonfigurasi. Selamat datang di GuruFlow!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              GF
            </span>
            <span className="text-xs font-semibold text-slate-900">
              Pengaturan Ruang Kerja GuruFlow · Langkah {step} dari 5
            </span>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-slate-900 h-1 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Langkah 1: Pilih Peran Anda di Sekolah
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  GuruFlow menyesuaikan rekomendasi dan alur kerja berdasarkan tanggung jawab harian Anda.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Wali Kelas (Homeroom Teacher)', desc: 'Mengelola perkembangan siswa, presensi, komunikasi orang tua, dan mata pelajaran inti.' },
                  { title: 'Guru Mata Pelajaran', desc: 'Fokus pada kurikulum spesifik, modul ajar per jenjang, bank soal, dan asesmen.' },
                  { title: 'Koordinator Kurikulum', desc: 'Menyelaraskan alur tujuan pembelajaran antar tingkat dan meninjau modul ajar.' },
                  { title: 'Kepala Sekolah / Wakil Kepala', desc: 'Melihat ringkasan beban kerja agregat, adopsi pilot, dan persetujuan kebijakan.' },
                ].map((opt) => (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setRole(opt.title)}
                    className={`w-full p-3.5 text-left rounded-xl border transition-all ${
                      role === opt.title
                        ? 'border-slate-900 bg-slate-50/70 ring-1 ring-slate-900'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{opt.title}</span>
                      {role === opt.title && <Check className="w-4 h-4 text-slate-900" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Langkah 2: Jenjang dan Mata Pelajaran
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih kelompok kelas untuk pilot di Sekolah Cakrawala Jakarta.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Jenjang & Tingkat Kelas
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  >
                    <option>SD - Kelas 5 (Wali Kelas 5A Pilot)</option>
                    <option>SD - Kelas 4</option>
                    <option>SD - Kelas 6</option>
                    <option>SMP - Kelas 7-9</option>
                    <option>SMA - Kelas 10-12</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Mata Pelajaran Utama
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Matematika', 'Bahasa Indonesia', 'IPAS / Tematik', 'Pendidikan Pancasila', 'Bahasa Inggris', 'Seni Budaya'].map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => {
                          setSubjects((prev) =>
                            prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
                          );
                        }}
                        className={`p-2.5 text-xs text-left rounded-lg border transition-all ${
                          subjects.includes(subj)
                            ? 'border-slate-900 bg-slate-50 font-medium text-slate-900'
                            : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Langkah 3: Identifikasi Beban Waktu
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  “Apa yang paling banyak menyita waktu Anda setiap minggu?”
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih tugas-tugas administratif yang ingin Anda persingkat melalui bantuan alur kerja cerdas.
                </p>
              </div>

              <div className="space-y-2">
                {timeDrainOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleDrain(item)}
                    className={`w-full p-2.5 px-3 text-left rounded-lg border text-xs flex items-center justify-between transition-all ${
                      selectedTimeDrains.includes(item)
                        ? 'border-slate-900 bg-slate-50 font-medium text-slate-900'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span>{item}</span>
                    {selectedTimeDrains.includes(item) && (
                      <Check className="w-4 h-4 text-slate-900 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Langkah 4: Format Luaran Pilihan
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  GuruFlow tidak mengunci Anda di dalam sistem. Dokumen dapat langsung diekspor ke format yang Anda butuhkan.
                </p>
              </div>

              <div className="space-y-2">
                {outputOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleOutput(item)}
                    className={`w-full p-3 text-left rounded-lg border text-xs flex items-center justify-between transition-all ${
                      selectedOutputs.includes(item)
                        ? 'border-slate-900 bg-slate-50 font-medium text-slate-900'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span>{item}</span>
                    {selectedOutputs.includes(item) && (
                      <Check className="w-4 h-4 text-slate-900 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-300 mx-auto flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  Rencana Alur Kerja Siap
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  GuruFlow telah mengalokasikan prioritas tugas administratif harian Anda untuk efisiensi mengajar optimal.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span>Pendidik Terdaftar</span>
                  <span className="font-semibold text-slate-900">{currentUser.name} ({currentUser.assignedClass ? `Wali Kelas ${currentUser.assignedClass}` : currentUser.title})</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Satuan Pendidikan</span>
                  <span className="font-semibold text-slate-900">{activeSchool.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span>Fokus Mingguan</span>
                  <span className="font-semibold text-slate-900">{subjects.join(' & ')} · {selectedTimeDrains.slice(0, 2).join(' & ')}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  Prinsip Utama: Seluruh draf AI berada di bawah kendali Anda. Tidak ada pesan atau dokumen yang dikirim tanpa persetujuan manual.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200/80 bg-[#FAF9F6] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Mulai Bekerja di GuruFlow</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
