import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  MessageCircle,
  BookOpen,
  Calendar,
  Clock,
  HelpCircle,
  ChevronDown,
  Building,
  School,
} from 'lucide-react';
import { ASSETS } from '../../assets/images';

export const LandingPageView: React.FC = () => {
  const { setActiveView, setIsPilotModalOpen } = useApp();
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah GuruFlow menggantikan aplikasi Dapodik atau e-Rapor?',
      a: 'Tidak. GuruFlow bukan pengganti dan tidak terafiliasi resmi dengan Dapodik. GuruFlow berfungsi sebagai ruang kerja harian guru untuk mempersiapkan, merapikan, dan memvalidasi materi ajar, catatan siswa, dan lembar kerja sehingga pengisian ke sistem sekolah menjadi jauh lebih cepat dan terorganisir.',
    },
    {
      q: 'Bagaimana keamanan dan privasi data siswa kami terjamin?',
      a: 'Data siswa disimpan terisolasi khusus untuk institusi Anda dan tidak pernah diperjualbelikan atau digunakan untuk periklanan. GuruFlow mendorong prinsip minimalisasi data: tidak memasukkan nomor rekening atau rekam medis sensitif.',
    },
    {
      q: 'Mengapa GuruFlow tidak langsung mengirim pesan ke WhatsApp secara otomatis?',
      a: 'Prinsip kami adalah pendidik memegang kendali mutlak. Komunikasi orang tua sangat dipengaruhi oleh empati dan konteks personal. AI menyusun draf kalimat yang sopan dan relevan, namun guru wajib membaca dan menyetujui sebelum mengirimkan.',
    },
    {
      q: 'Apa saja syarat mengikuti Pilot Gratis 4 Minggu?',
      a: 'Program ini terbuka untuk sekolah swasta di Indonesia dengan 3 hingga 5 guru peserta awal. Tidak dipungut biaya apa pun dan tidak memerlukan informasi kartu kredit.',
    },
  ];

  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-24 text-slate-900">
      {/* Hero Section */}
      <section className="text-center pt-8 md:pt-14 space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Program Pilot Sekolah Inovatif Jakarta · 2026</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight md:leading-snug">
          Kurangi Beban Administrasi. Kembalikan Waktu Guru untuk Mengajar.
        </h1>

        <p className="text-sm md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          GuruFlow membantu guru merencanakan pekerjaan, menyusun dokumen, membuat worksheet, dan menyiapkan komunikasi orang tua dalam satu ruang kerja yang tetap berada di bawah kendali manusia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            onClick={() => setIsPilotModalOpen(true)}
            className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Daftar Pilot Gratis (4 Minggu)
          </button>

          <button
            onClick={() => setActiveView('beranda')}
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Lihat Cara Kerjanya</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl bg-white">
          <img
            src={ASSETS.classroom}
            alt="Kegiatan Belajar Kolaboratif di Kelas"
            className="w-full h-72 md:h-96 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between text-xs px-6 gap-2">
            <span>Sekolah Pilot: Sekolah Cakrawala Jakarta</span>
            <span className="text-amber-300 font-mono">
              “Administrasi selesai lebih cepat. Guru kembali fokus mengajar.”
            </span>
          </div>
        </div>
      </section>

      {/* The Administrative Problem Section */}
      <section className="space-y-6 px-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Tantangan Nyata di Sekolah Indonesia
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            Beban dokumentasi berulang menguras energi guru sebelum jam tatap muka di kelas dimulai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-700 font-mono text-xs font-bold uppercase">Masalah 01</div>
            <h3 className="text-base font-bold text-slate-900">Instruksi Tercecer di WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pengumuman kepala sekolah, tenggat kurikulum, dan tugas mendadak tenggelam di grup chat sekolah yang ramai tanpa pengingat prioritas terstruktur.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-700 font-mono text-xs font-bold uppercase">Masalah 02</div>
            <h3 className="text-base font-bold text-slate-900">Dokumen Berulang dari Nol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengetik Modul Ajar dan lembar soal berulang kali di dokumen kosong menghabiskan rata-rata 4.8 jam kerja per minggu yang seharusnya digunakan untuk mendampingi siswa.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-700 font-mono text-xs font-bold uppercase">Masalah 03</div>
            <h3 className="text-base font-bold text-slate-900">Komunikasi Orang Tua Menumpuk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menyusun pesan perkembangan mingguan untuk puluhan wali murid membutuhkan kehati-hatian nada bicara agar tidak disalahpahami, menyita waktu istirahat malam guru.
            </p>
          </div>
        </div>
      </section>

      {/* How GuruFlow Works */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 space-y-8 mx-4 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Bagaimana GuruFlow Mentransformasi Ruang Kerja Guru
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            Dari instruksi acak menjadi alur kerja yang terencana dan terkendali.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">Ekstraksi Pesan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengubah chat pengumuman panjang menjadi daftar tugas rapi dengan tenggat dan estimasi durasi.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">Draf Modul Instan</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menghasilkan draf Modul Ajar Kurikulum Merdeka lengkap dengan apersepsi dan rubrik diferensiasi.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">Worksheet Siap Cetak</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Membuat lembar aktivitas siswa format A4 berjenjang dengan kunci jawaban dan rubrik penskoran.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-900">Persetujuan Guru</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tidak ada yang final tanpa persetujuan manusia. Guru menyunting dan menandatangani sebelum dipakai.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Teacher Control Guarantee */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mx-4 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Etika & Kepatuhan Pendidik</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Pendidik Tetap Menjadi Pusat Setiap Keputusan
            </h2>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              AI di GuruFlow dirancang untuk meringankan ketikan tangan, bukan menggantikan kehangatan hubungan guru dan murid.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="font-bold block mb-1 text-white">Bukan Chatbot Kosong</span>
              <span className="text-slate-400 text-[11px]">Dirancang khusus alur sekolah Indonesia</span>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="font-bold block mb-1 text-white">Privasi Institusi</span>
              <span className="text-slate-400 text-[11px]">Data terisolasi tanpa iklan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Week Free Pilot Offer Section */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-8 md:p-12 mx-4 shadow-sm text-center space-y-6">
        <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-800">
          Penawaran Khusus Sekolah Swasta
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Pilot Gratis Selama 4 Minggu
        </h2>

        <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Uji coba langsung dampak penghematan waktu administratif pada 5 guru pilihan di sekolah Anda tanpa komitmen berbayar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto text-left text-xs pt-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Maksimal 5 guru per sekolah</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Onboarding terpandu 1 jam</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Seluruh alur kerja administratif</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sesi evaluasi mingguan berkala</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tanpa informasi kartu kredit</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tanpa kewajiban berlangganan</span>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setIsPilotModalOpen(true)}
            className="px-8 py-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Ajukan Permohonan Pilot Sekolah Anda
          </button>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section className="max-w-3xl mx-auto px-4 space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 text-center mb-6">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIdx === i;
            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200/90 overflow-hidden text-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                  className="w-full p-4 text-left font-bold text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-50/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-slate-600 border-t border-slate-100 text-[11.5px] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 pt-8 border-t border-slate-200 px-4">
        <p>© 2026 GuruFlow by Droppfloww Systems. Hak Cipta Dilindungi.</p>
        <p className="mt-1 text-[11px]">
          Dibangun khusus untuk pendidik dan pimpinan sekolah di Indonesia.
        </p>
      </footer>
    </div>
  );
};
