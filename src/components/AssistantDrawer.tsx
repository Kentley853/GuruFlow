import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Calendar,
  BookOpen,
  MessageSquare,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTrigger?: () => void;
  actionLabel?: string;
}

export const AssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    activeView,
    setActiveView,
    extractMessageToTasks,
    generateRealLessonPlan,
    applyWorkloadOptimization,
    showToast,
    currentUser,
    activeSchool,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Selamat bertugas, Ibu Maya. Saya Asisten GuruFlow. Saya dapat membantu menganalisis pesan sekolah, menyiapkan Modul Ajar Kurikulum Merdeka, menyusun draf pesan orang tua, hingga menyeimbangkan jadwal mengajar Anda.',
      timestamp: '08.00 WIB',
    },
  ]);

  const quickActions = [
    {
      label: 'Susun prioritas saya hari ini',
      icon: Calendar,
      view: 'beban_kerja' as const,
      handler: () => {
        setActiveView('beban_kerja');
        handleAssistantReply(
          'Saya telah memeriksa jadwal dan tugas hari ini. Kamis memiliki beban terlalu tinggi (4.5 jam). Saya merekomendasikan memindahkan penyusunan worksheet ke Rabu sore agar tenggat hari Jumat tetap aman.',
          'Lihat Rekomendasi di Laporan Beban Kerja',
          () => setActiveView('beban_kerja')
        );
      },
    },
    {
      label: 'Buat draf Modul Ajar',
      icon: BookOpen,
      view: 'perencanaan' as const,
      handler: () => {
        setActiveView('perencanaan');
        generateRealLessonPlan({
          jenjang: 'SD',
          kelas: '5',
          mapel: 'Matematika',
          topik: 'Pecahan Senilai',
          durasi: '2 x 35 menit',
          tujuan: 'Membandingkan dan menyederhanakan pecahan berpenyebut beda',
          karakterKelas: 'Kemampuan siswa beragam, membutuhkan diferensiasi bertahap',
        });
        handleAssistantReply(
          'Draf Modul Ajar Pecahan Senilai Kelas 5A telah disiapkan lengkap dengan apersepsi origami, diferensiasi 3 kelompok, dan rubrik asesmen. Silakan tinjau dan edit sesuai dinamika kelas.',
          'Buka Editor Modul Ajar',
          () => setActiveView('perencanaan')
        );
      },
    },
    {
      label: 'Ubah pesan ini menjadi tugas',
      icon: MessageSquare,
      view: 'beranda' as const,
      handler: () => {
        setActiveView('beranda');
        extractMessageToTasks();
        handleAssistantReply(
          'Pesan Kepala Sekolah telah dianalisis. Tiga tugas administratif berhasil diekstraksi: Rekap Nilai (Kamis 16.00), Catatan Siswa (Jumat 11.00), dan Rancangan Hari Literasi (Jumat 15.00).',
          'Lihat Rincian Tugas di Beranda',
          () => setActiveView('beranda')
        );
      },
    },
    {
      label: 'Buat worksheet',
      icon: FileSpreadsheet,
      view: 'worksheet' as const,
      handler: () => {
        setActiveView('worksheet');
        handleAssistantReply(
          'Lembar kerja perbandingan pecahan Kelas 5 SD format A4 siap cetak telah dimuat. Dilengkapi 5 pilihan ganda, 3 isian singkat, 2 soal cerita kue bolu dan lari lapangan, serta kunci jawaban terpisah.',
          'Buka Lembar Kerja Siap Cetak',
          () => setActiveView('worksheet')
        );
      },
    },
    {
      label: 'Bantu tulis pesan orang tua',
      icon: MessageSquare,
      view: 'komunikasi' as const,
      handler: () => {
        setActiveView('komunikasi');
        handleAssistantReply(
          'Draf komunikasi orang tua untuk Adit Pratama telah disiapkan dalam 3 gaya nada: Hangat, Singkat, dan Formal. Pilih nada yang paling sesuai, sunting jika perlu, lalu tekan Setujui & Salin.',
          'Pilih Nada Pesan Adit Pratama',
          () => setActiveView('komunikasi')
        );
      },
    },
    {
      label: 'Periksa dokumen sebelum disetujui',
      icon: ShieldCheck,
      view: 'persetujuan' as const,
      handler: () => {
        setActiveView('persetujuan');
        handleAssistantReply(
          'Saat ini terdapat dokumen dan draf pesan yang menunggu persetujuan Anda. Ingat: tidak ada dokumen AI yang berlaku otomatis tanpa tanda tangan / persetujuan guru.',
          'Buka Pusat Persetujuan',
          () => setActiveView('persetujuan')
        );
      },
    },
  ];

  const handleAssistantReply = (replyText: string, actionLabel?: string, actionTrigger?: () => void) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `reply-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        actionLabel,
        actionTrigger,
      },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    const newMsgId = `usr-${Date.now()}`;

    const currentHistory = [...messages, {
      id: newMsgId,
      sender: 'user' as const,
      text: userText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    }];
    setMessages(currentHistory);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-school-id': activeSchool.id,
          'x-user-id': currentUser.id,
          'x-user-name': currentUser.name,
          'x-user-role': currentUser.role,
        },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.reply) {
          handleAssistantReply(json.reply);
          return;
        }
      }
    } catch {
      // Graceful fallback below
    }

    // Contextual fallback response if network or AI service unreachable
    let response = 'Saya mengerti kebutuhan Anda. Sebagai asisten administratif guru, saya merekomendasikan menyusun draf dokumen terlebih dahulu untuk Anda tinjau sebelum finalisasi.';
    let label = 'Tinjau Rekomendasi';
    let trigger = () => {};

    const lower = userText.toLowerCase();
    if (lower.includes('modul') || lower.includes('rpp') || lower.includes('ajar')) {
      response = 'Untuk Modul Ajar Matematika Pecahan Kelas 5A, saya telah menyiapkan alur diferensiasi proses dan asesmen formatif 2x35 menit sesuai Kurikulum Merdeka.';
      label = 'Buka Asisten Perencanaan';
      trigger = () => setActiveView('perencanaan');
    } else if (lower.includes('orang tua') || lower.includes('wa') || lower.includes('pesan') || lower.includes('adit')) {
      response = 'Pesan evaluasi berkala dapat dipersonalisasi dengan nada hangat dan solutif tanpa membagikan data nilai sensitif secara terbuka.';
      label = 'Buka Komunikasi Orang Tua';
      trigger = () => setActiveView('komunikasi');
    } else if (lower.includes('worksheet') || lower.includes('soal') || lower.includes('kuis')) {
      response = 'Format lembar kerja siap cetak A4 telah dilengkapi ruang nama, kelas, petunjuk pengerjaan, serta kunci jawaban terpisah.';
      label = 'Buka Lembar Kerja';
      trigger = () => setActiveView('worksheet');
    } else if (lower.includes('jadwal') || lower.includes('padat') || lower.includes('kamis') || lower.includes('waktu')) {
      response = 'Berdasarkan analisis kalender minggu ini, Anda memiliki konsentrasi tugas di hari Kamis. Menggeser persiapan ke Rabu sore akan memberi ruang bernapas.';
      label = 'Buka Laporan Beban Kerja';
      trigger = () => setActiveView('beban_kerja');
    }

    handleAssistantReply(response, label, trigger);
  };

  if (!isAssistantOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Asisten GuruFlow</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Sekolah Cakrawala Jakarta</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">Aktif</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAssistantOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsible AI Disclaimer Banner */}
        <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            Asisten AI hanya menghasilkan draf dan saran awal. Guru memegang kendali dan tanggung jawab penuh atas setiap keputusan akademik.
          </span>
        </div>

        {/* Quick Context Actions */}
        <div className="p-3 border-b border-slate-200/80 bg-[#FAF9F6]/80">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Aksi Cepat Berdasarkan Halaman
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {quickActions.map((qa, i) => {
              const Icon = qa.icon;
              return (
                <button
                  key={i}
                  onClick={qa.handler}
                  className="flex items-center gap-2 p-2 text-left text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100/80 border border-slate-200/80 rounded-lg transition-colors group"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
                  <span className="truncate">{qa.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white font-medium'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                {msg.text}

                {msg.actionLabel && msg.actionTrigger && (
                  <button
                    onClick={msg.actionTrigger}
                    className="mt-2.5 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-md text-[11px] transition-colors"
                  >
                    <span>{msg.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tanyakan atau minta saran tugas..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-800 text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
