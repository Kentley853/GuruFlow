import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Copy,
  ExternalLink,
  Sparkles,
  Edit3,
  Check,
  Shield,
  Phone,
} from 'lucide-react';

export const ParentCommView: React.FC = () => {
  const {
    parentComms,
    selectedStudentCommId,
    setSelectedStudentCommId,
    updateParentCommTone,
    updateCustomDraft,
    approveAndCopyWhatsApp,
    generateRealParentMessages,
    isGeneratingParentMsg,
    showToast,
  } = useApp();

  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isEditingManually, setIsEditingManually] = useState(false);
  const [editContext, setEditContext] = useState('');

  const currentComm =
    parentComms.find((c) => c.id === selectedStudentCommId) || parentComms[0];

  const handleCopyAndApprove = () => {
    const res = approveAndCopyWhatsApp(currentComm.id);
    if (res.success) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
  };

  const handleGenerate = () => {
    generateRealParentMessages({
      studentName: currentComm.studentName,
      parentName: currentComm.parentName,
      context: editContext || currentComm.context,
      purpose: currentComm.purpose,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Komunikasi Wali Kelas</span>
            <span>·</span>
            <span>WhatsApp Orang Tua Siswa</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Penyusun Pesan WhatsApp Orang Tua
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Draf pesan evaluasi belajar mingguan dengan 3 variasi gaya nada bahasa di bawah kendali guru sepenuhnya.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGeneratingParentMsg}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 disabled:opacity-50 rounded-xl transition-all shadow-xs min-h-[44px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isGeneratingParentMsg ? 'Gemini Merumuskan...' : 'Rumuskan Pesan Baru (Gemini)'}</span>
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900">Privasi & Etika Komunikasi:</span>
          <p className="text-slate-600 text-[11.5px] leading-relaxed">
            Pesan tidak pernah dikirimkan secara otomatis ke nomor WhatsApp orang tua. Guru membaca, menyetujui, lalu menyalin draf secara manual ke aplikasi WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Student Selector List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 uppercase tracking-wider">
              Daftar Siswa Terpilih
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{parentComms.length} draf</span>
          </div>

          <div className="space-y-1.5">
            {parentComms.map((comm) => {
              const isSelected = comm.id === currentComm.id;

              return (
                <button
                  key={comm.id}
                  onClick={() => setSelectedStudentCommId(comm.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all min-h-[44px] flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="space-y-0.5 truncate">
                    <div className="font-bold text-xs truncate">{comm.studentName}</div>
                    <div className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {comm.parentName}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium shrink-0 ${
                      comm.status === 'disetujui_dan_disalin'
                        ? isSelected
                          ? 'bg-emerald-800 text-white'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isSelected
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {comm.status === 'disetujui_dan_disalin' ? 'Disetujui' : 'Menunggu'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Message Workspace & Tone Switcher */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-xs space-y-4">
            {/* Student & Parent Metadata Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{currentComm.studentName}</h3>
                <p className="text-slate-500 text-[11.5px]">
                  Orang Tua: {currentComm.parentName} · Telp: {currentComm.parentPhone}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentComm.parentPhone}</span>
              </div>
            </div>

            {/* Context & Purpose Tag */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
              <span className="font-semibold text-slate-700 block text-[11px]">
                Konteks Pengamatan Belajar:
              </span>
              <p className="text-slate-800 text-[11.5px] leading-relaxed">
                {currentComm.context}
              </p>
            </div>

            {/* 3 Tone Switcher */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block text-xs">
                Pilih Gaya Nada Bahasa Pesan:
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['hangat', 'singkat', 'formal'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => updateParentCommTone(currentComm.id, tone)}
                    className={`py-2 px-3 rounded-xl border font-semibold capitalize transition-all min-h-[40px] ${
                      currentComm.tone === tone
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tone === 'hangat' ? 'Hangat & Ramah' : tone === 'singkat' ? 'Singkat Padat' : 'Bahasa Formal'}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Message Preview Bubble */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Pratinjau Draf Pesan WhatsApp:</span>
                <button
                  onClick={() => setIsEditingManually(!isEditingManually)}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-[11px] font-medium"
                >
                  <Edit3 className="w-3 h-3 text-slate-400" />
                  <span>{isEditingManually ? 'Selesai Sunting' : 'Sunting Manual'}</span>
                </button>
              </div>

              {isEditingManually ? (
                <textarea
                  rows={6}
                  value={currentComm.currentDraft}
                  onChange={(e) => updateCustomDraft(currentComm.id, e.target.value)}
                  className="w-full p-3 text-xs md:text-sm border border-slate-300 rounded-xl focus:ring-1 focus:ring-slate-800 leading-relaxed"
                />
              ) : (
                <div className="p-4 rounded-xl bg-[#E7F8E8] border border-[#C2E8C4] text-slate-900 text-xs md:text-sm leading-relaxed shadow-xs relative">
                  <p className="whitespace-pre-line">{currentComm.currentDraft}</p>
                  <div className="text-right text-[10px] text-slate-500 mt-2 font-mono">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action CTA */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Tekan tombol untuk menyalin teks resmi ke papan klip Anda.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyAndApprove}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs min-h-[44px]"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Tersalin ke Papan Klip!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>Setujui & Salin ke WhatsApp</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://api.whatsapp.com/send?phone=${currentComm.parentPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(currentComm.currentDraft)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Buka WhatsApp Web"
                  className="p-2.5 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shrink-0 flex items-center justify-center min-h-[44px] min-w-[44px]"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
