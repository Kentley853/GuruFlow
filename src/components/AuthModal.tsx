import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, School, Check, LogIn, UserPlus, Shield } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    setCurrentUser,
    setActiveSchool,
    setUserRole,
    allSchools,
    createNewSchool,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'switch_school'>('login');
  const [email, setEmail] = useState('maya.putri@cakrawala.sch.id');
  const [password, setPassword] = useState('guru2026');
  const [name, setName] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState(allSchools[0]?.id || 'sekolah-cakrawala-jakarta');
  const [role, setRole] = useState<'teacher' | 'principal'>('teacher');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // New school creation fields
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolCity, setNewSchoolCity] = useState('Jakarta Selatan');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Autentikasi gagal.');
      }

      setCurrentUser(data.user);
      setUserRole(data.user.role);
      if (data.school) {
        setActiveSchool(data.school);
      }
      showToast(`Berhasil masuk sebagai ${data.user.name}.`);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      let schoolId = selectedSchoolId;
      if (newSchoolName.trim()) {
        const created = await createNewSchool({
          name: newSchoolName.trim(),
          city: newSchoolCity,
          curriculum: 'Kurikulum Merdeka',
        });
        schoolId = created.id;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          schoolId,
          role,
          title: role === 'principal' ? 'Kepala Sekolah' : 'Wali Kelas & Guru Mapel',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Pendaftaran akun gagal.');
      }

      setCurrentUser(data.user);
      setUserRole(data.user.role);
      const sc = allSchools.find((s) => s.id === schoolId);
      if (sc) setActiveSchool(sc);

      showToast(`Akun ${data.user.name} berhasil dibuat.`);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftar akun.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPreset = (preset: 'maya' | 'hendra') => {
    if (preset === 'maya') {
      setEmail('maya.putri@cakrawala.sch.id');
      setPassword('guru2026');
      setRole('teacher');
    } else {
      setEmail('hendra.wijaya@cakrawala.sch.id');
      setPassword('kepsek2026');
      setRole('principal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              GF
            </div>
            <h3 className="text-xs font-bold text-slate-900">
              {mode === 'login'
                ? 'Masuk ke Ruang Kerja Sekolah'
                : mode === 'register'
                ? 'Daftar Akun Pendidik / Admin'
                : 'Pilih Satuan Pendidikan'}
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 font-semibold text-center border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-slate-900 text-slate-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50'
            }`}
          >
            Registrasi Baru
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
            {/* Quick account presets for demonstration / testing */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Akun Terverifikasi Sekolah Cakrawala:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset('maya')}
                  className="flex-1 py-1 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-800 hover:border-slate-400"
                >
                  Ibu Maya (Wali Kelas)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset('hendra')}
                  className="flex-1 py-1 px-2 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-800 hover:border-slate-400"
                >
                  Dr. Hendra (Kepsek)
                </button>
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Email Resmi</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Ruang Kerja'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="p-6 space-y-3.5 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Nama Lengkap & Gelar</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Bapak Rizky Pratama, M.Pd."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Kata Sandi</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Peran di Sekolah</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-medium"
              >
                <option value="teacher">Wali Kelas / Guru Pengajar</option>
                <option value="principal">Kepala Sekolah / Wakil Kepala</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Satuan Pendidikan</label>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50"
              >
                {allSchools.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name} ({sc.city})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 mt-3"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Mendaftarkan...' : 'Daftarkan Akun'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
