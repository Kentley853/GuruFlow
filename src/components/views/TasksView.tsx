import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskPriority, TaskStatus, TaskCategory } from '../../types';
import {
  Kanban,
  List,
  Filter,
  Plus,
  Clock,
  Trash2,
  X,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, deleteTask } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filters
  const [filterTimeframe, setFilterTimeframe] = useState<'semua' | 'hari_ini' | 'minggu_ini'>('semua');
  const [filterPriority, setFilterPriority] = useState<string>('semua');
  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [mobileStatusTab, setMobileStatusTab] = useState<TaskStatus | 'semua'>('semua');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Perencanaan Pembelajaran');
  const [newPriority, setNewPriority] = useState<TaskPriority>('sedang');
  const [newDeadline, setNewDeadline] = useState('Kamis, 15.00');
  const [newMinutes, setNewMinutes] = useState(30);

  const statusColumns: { id: TaskStatus; label: string; dot: string }[] = [
    { id: 'belum_mulai', label: 'Belum Mulai', dot: 'bg-slate-400' },
    { id: 'sedang_dikerjakan', label: 'Sedang Dikerjakan', dot: 'bg-blue-600' },
    { id: 'menunggu_persetujuan', label: 'Menunggu Persetujuan', dot: 'bg-amber-600' },
    { id: 'selesai', label: 'Selesai', dot: 'bg-emerald-600' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'semua' && t.priority !== filterPriority) return false;
    if (filterCategory !== 'semua' && t.category !== filterCategory) return false;
    if (filterTimeframe === 'hari_ini' && !t.deadline.toLowerCase().includes('hari ini')) return false;
    if (mobileStatusTab !== 'semua' && t.status !== mobileStatusTab) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Tugas administratif baru.',
      category: newCategory,
      deadline: newDeadline,
      deadlineDate: '2026-10-16T15:00:00',
      estimatedMinutes: Number(newMinutes) || 30,
      priority: newPriority,
      status: 'belum_mulai',
      classRoom: '5A',
      source: 'Ditambahkan Guru',
      needsApproval: false,
      isAiGenerated: false,
    });

    setNewTitle('');
    setNewDesc('');
    setIsNewTaskOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Alur Kerja Guru</span>
            <span>·</span>
            <span>Pusat Tugas Administratif</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Manajemen Tugas Guru
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Daftar tugas terstruktur berdasarkan prioritas, kategori, dan tenggat waktu sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-[6px] transition-all flex items-center gap-1.5 min-h-[36px] ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Papan Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-[6px] transition-all flex items-center gap-1.5 min-h-[36px] ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar Tabel</span>
            </button>
          </div>

          {/* Single Primary Action */}
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Tugas</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Saring:</span>
          </span>

          {/* Timeframe Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {(['semua', 'hari_ini', 'minggu_ini'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setFilterTimeframe(tf)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterTimeframe === tf
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf === 'semua' ? 'Semua Waktu' : tf === 'hari_ini' ? 'Hari Ini' : 'Minggu Ini'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
          >
            <option value="semua">Semua Kategori</option>
            <option value="Perencanaan Pembelajaran">Perencanaan Pembelajaran</option>
            <option value="Komunikasi Orang Tua">Komunikasi Orang Tua</option>
            <option value="Asesmen & Penilaian">Asesmen & Penilaian</option>
            <option value="Administrasi Wali Kelas">Administrasi Wali Kelas</option>
            <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-medium"
          >
            <option value="semua">Semua Prioritas</option>
            <option value="tinggi">Prioritas Tinggi</option>
            <option value="sedang">Prioritas Sedang</option>
            <option value="rendah">Prioritas Rendah</option>
          </select>
        </div>

        {/* Counter */}
        <span className="text-slate-500 font-mono text-[11px]">
          {filteredTasks.length} tugas ditemukan
        </span>
      </div>

      {/* Mobile Column Switcher (Visible only on mobile for Kanban) */}
      {viewMode === 'kanban' && (
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setMobileStatusTab('semua')}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap min-h-[36px] ${
              mobileStatusTab === 'semua'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Semua Kolom
          </button>
          {statusColumns.map((col) => (
            <button
              key={col.id}
              onClick={() => setMobileStatusTab(col.id)}
              className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap min-h-[36px] ${
                mobileStatusTab === col.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      )}

      {/* New Task Inline Form Modal */}
      {isNewTaskOpen && (
        <form
          onSubmit={handleCreateTask}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Tambah Tugas Administratif Baru</h3>
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Judul Tugas</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Misal: Siapkan soal ulangan harian IPAS..."
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Kategori</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                className="w-full text-xs"
              >
                <option value="Perencanaan Pembelajaran">Perencanaan Pembelajaran</option>
                <option value="Komunikasi Orang Tua">Komunikasi Orang Tua</option>
                <option value="Asesmen & Penilaian">Asesmen & Penilaian</option>
                <option value="Administrasi Wali Kelas">Administrasi Wali Kelas</option>
                <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Tenggat Waktu</label>
              <input
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Estimasi Waktu (Menit)</label>
              <input
                type="number"
                min="5"
                max="300"
                value={newMinutes}
                onChange={(e) => setNewMinutes(Number(e.target.value))}
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Tingkat Prioritas</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                className="w-full text-xs"
              >
                <option value="tinggi">Tinggi (Mendesak / Berdampak)</option>
                <option value="sedang">Sedang (Rutin Mingguan)</option>
                <option value="rendah">Rendah (Fleksibel)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">Catatan & Rincian</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Tambahkan langkah tindakan atau instruksi pimpinan..."
              className="w-full text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewTaskOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-xs min-h-[44px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs shadow-xs min-h-[44px]"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statusColumns
            .filter((col) => mobileStatusTab === 'semua' || col.id === mobileStatusTab)
            .map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);

              return (
                <div
                  key={col.id}
                  className="rounded-2xl border border-slate-200/90 bg-[#FAF9F6] p-3.5 flex flex-col min-h-[420px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span className="text-xs font-bold text-slate-900">{col.label}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {colTasks.length === 0 ? (
                      <div className="h-28 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400">
                        Tidak ada tugas di kolom ini
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                              {task.category}
                            </span>

                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                task.priority === 'tinggi'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : task.priority === 'sedang'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {task.priority.toUpperCase()}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                            <div className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{task.estimatedMinutes}m</span>
                            </div>
                            <span className="font-medium text-slate-600">{task.deadline}</span>
                          </div>

                          {/* Quick Status Shift Buttons */}
                          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-50 text-[10px]">
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="text-[11px] py-1 px-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800 font-medium"
                              aria-label={`Ubah status untuk tugas ${task.title}`}
                            >
                              <option value="belum_mulai">Belum Mulai</option>
                              <option value="sedang_dikerjakan">Sedang Dikerjakan</option>
                              <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
                              <option value="selesai">Selesai</option>
                            </select>

                            <button
                              onClick={() => deleteTask(task.id)}
                              title="Hapus tugas ini"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* List / Table View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Tugas & Deskripsi</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Tenggat</th>
                  <th className="py-3 px-3">Estimasi</th>
                  <th className="py-3 px-3">Prioritas</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Tidak ada tugas yang sesuai dengan kriteria filter saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900">{t.title}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {t.description}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-medium whitespace-nowrap">
                        {t.category}
                      </td>
                      <td className="py-3.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                        {t.deadline}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {t.estimatedMinutes}m
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            t.priority === 'tinggi'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : t.priority === 'sedang'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <select
                          value={t.status}
                          onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                          className="text-[11px] py-1 px-2 border border-slate-200 rounded-md bg-white font-medium"
                          aria-label={`Ubah status untuk ${t.title}`}
                        >
                          <option value="belum_mulai">Belum Mulai</option>
                          <option value="sedang_dikerjakan">Sedang Dikerjakan</option>
                          <option value="menunggu_persetujuan">Menunggu Persetujuan</option>
                          <option value="selesai">Selesai</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteTask(t.id)}
                          title="Hapus tugas"
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 min-h-[36px] min-w-[36px] inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
