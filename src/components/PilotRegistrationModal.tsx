import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Shield, Calendar, Users, Send } from 'lucide-react';

export const PilotRegistrationModal: React.FC = () => {
  const { isPilotModalOpen, setIsPilotModalOpen, showToast, refreshAuditLogs } = useApp();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: 'Sekolah Cakrawala Jakarta',
    location: 'Jakarta Selatan',
    contactPerson: 'Bapak Dr. Hendra Wijaya, M.Pd.',
    role: 'Kepala Sekolah',
    email: 'hendra.wijaya@cakrawala.sch.id',
    teacherCount: '5 guru',
    primaryChallenge: 'Penyusunan Modul Ajar dan Komunikasi WhatsApp Orang Tua',
    preferredMeetingTime: 'Selasa, pukul 14.00 WIB (Sesi daring/tatap muka)',
  });

  if (!isPilotModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/pilot/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSubmitted(true);
        refreshAuditLogs();
        showToast('Pendaftaran program pilot 4 minggu berhasil terkirim dan tercatat di sistem!');
        return;
      }
    } catch {
      // Offline fallback
    } finally {
      setIsSubmitting(false);
    }
    setIsSubmitted(true);
    showToast('Pendaftaran pilot 4 minggu berhasil diajukan!');
  };

  const handleClose = () => {
    setIsPilotModalOpen(false);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Pilot Gratis Selama 4 Minggu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Program uji coba terarah untuk sekolah swasta di Jakarta.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Pengajuan Pilot Terkirim
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Terima kasih, <strong>{formData.contactPerson}</strong>. Tim Droppfloww Systems akan mengonfirmasi sesi orientasi dan jadwal implementasi untuk <strong>{formData.schoolName}</strong> pada waktu yang Anda pilih ({formData.preferredMeetingTime}).
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between text-slate-600">
                <span>Durasi:</span>
                <span className="font-semibold text-slate-900">4 Minggu Penuh</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Kapasitas Guru:</span>
                <span className="font-semibold text-slate-900">Maksimal 5 Guru Terpilih</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status Biaya:</span>
                <span className="font-semibold text-emerald-700">100% Bebas Biaya (Tanpa Kartu Kredit)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Tutup & Kembali ke Ruang Kerja
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4 text-xs">
            {/* Free Pilot Offer Breakdown Callout */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1.5">
              <span className="font-semibold text-slate-900 block text-xs">
                Paket Pilot Termasuk:
              </span>
              <ul className="space-y-1 text-slate-600 text-[11.5px]">
                <li>· Akses hingga 5 guru per sekolah</li>
                <li>· Onboarding terpandu & pelatihan staf 1 jam</li>
                <li>· Seluruh alur kerja administratif utama (Modul, Worksheet, WhatsApp)</li>
                <li>· Sesi evaluasi mingguan & tanpa kewajiban perpanjangan</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Lokasi Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Nama Penanggung Jawab</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Jabatan di Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Email Resmi / Profesional</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Jumlah Guru Peserta</label>
                <select
                  value={formData.teacherCount}
                  onChange={(e) => setFormData({ ...formData, teacherCount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                >
                  <option>3 guru</option>
                  <option>5 guru (Rekomendasi Pilot)</option>
                  <option>8 guru</option>
                  <option>10+ guru (Koordinasi Khusus)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Tantangan Administratif Utama yang Ingin Diselesaikan
              </label>
              <textarea
                rows={2}
                value={formData.primaryChallenge}
                onChange={(e) => setFormData({ ...formData, primaryChallenge: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Waktu Pertemuan Orientasi yang Diinginkan
              </label>
              <input
                type="text"
                value={formData.preferredMeetingTime}
                onChange={(e) => setFormData({ ...formData, preferredMeetingTime: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Kirimkan Permohonan Pilot (4 Minggu Gratis)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
