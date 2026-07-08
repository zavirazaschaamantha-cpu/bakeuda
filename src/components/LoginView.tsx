/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, AlertCircle, HelpCircle, ArrowLeft, UserPlus, Phone, Briefcase, Mail } from 'lucide-react';
import { User, Role } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  mockUsersList: User[];
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
  onRegister: (user: Omit<User, 'id'>) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, mockUsersList, triggerToast, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Register State Variables
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDivision, setRegDivision] = useState('Sekretariat');
  const [regRole, setRegRole] = useState<Role>('Pegawai');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Harap masukkan username atau email dan kata sandi Anda!');
      triggerToast('Kolom login wajib diisi!', 'warning');
      return;
    }

    // Authenticate with mockUsersList by matching either username or email (case-insensitive)
    const inputVal = username.trim().toLowerCase();
    const matchedUser = mockUsersList.find(u => 
      u.username.toLowerCase() === inputVal || u.email.toLowerCase() === inputVal
    );

    if (matchedUser) {
      setErrorMsg('');
      triggerToast(`Selamat datang kembali, ${matchedUser.name}!`, 'success');
      onLoginSuccess(matchedUser);
    } else {
      setErrorMsg('Username/Email atau Kata Sandi salah!');
      triggerToast('Kredensial tidak valid!', 'danger');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regNip || !regEmail || !regUsername || !regPassword || !regPasswordConfirm) {
      setErrorMsg('Harap isi semua kolom wajib!');
      triggerToast('Kolom pendaftaran wajib diisi!', 'warning');
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok!');
      triggerToast('Konfirmasi kata sandi tidak cocok!', 'danger');
      return;
    }
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setErrorMsg('Format email tidak valid!');
      triggerToast('Format email tidak valid!', 'danger');
      return;
    }

    // Check duplication
    const userExists = mockUsersList.some(
      u => u.username.toLowerCase() === regUsername.trim().toLowerCase() ||
           u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (userExists) {
      setErrorMsg('Username atau Email sudah terdaftar!');
      triggerToast('Pengguna sudah terdaftar!', 'warning');
      return;
    }

    const newUser: Omit<User, 'id'> = {
      name: regName.trim(),
      nip: regNip.trim(),
      email: regEmail.trim().toLowerCase(),
      username: regUsername.trim().toLowerCase(),
      role: regRole,
      division: regDivision,
      phone: regPhone.trim() || '-',
      status: 'Aktif',
      fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };

    onRegister(newUser);
    triggerToast('Akun berhasil didaftarkan! Silakan masuk.', 'success');
    
    // Autofill username
    setUsername(newUser.email);
    setPassword(regPassword);
    
    // Switch to login page
    setIsRegistering(false);
    setErrorMsg('');
  };

  const handleQuickFill = (u: User) => {
    setUsername(u.email);
    setPassword('secret_password');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex flex-col md:flex-row items-center justify-center p-6 text-xs text-slate-500 font-semibold gap-8">
      
      {/* Left decoration: Logo & Title card */}
      <div className="max-w-md text-left space-y-4">
        <div className="inline-flex p-3 bg-[#1E3A8A] text-white rounded-2xl shadow-xl shadow-blue-900/10">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide leading-tight">
            Smart Office Dashboard Sekretariat (SODS)
          </h1>
          <p className="text-blue-700 dark:text-blue-400 font-bold">Badan Keuangan Daerah Kota Pangkalpinang</p>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Sistem administrasi persuratan terpadu dan disposisi elektronik terintegrasi. Menunjang tata kelola pemerintahan yang responsif, transparan, dan akuntabel.
        </p>

        {/* Quick Help: credentials assistant */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-4 rounded-2xl shadow-sm space-y-3">
          <h4 className="font-extrabold text-[10px] text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-[#1E3A8A]" />
            Asisten Login Cepat (Uji Coba Email/Username)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {mockUsersList.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickFill(u)}
                className="p-2.5 border border-slate-100 dark:border-gray-800 hover:border-blue-500 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 text-left transition-all"
              >
                <p className="font-bold text-slate-800 dark:text-white truncate text-[10px]">{u.name.split(',')[0]}</p>
                <p className="text-[9px] text-slate-400 truncate mt-0.5">{u.email}</p>
                <p className="text-[8px] text-[#1E3A8A] dark:text-blue-400 font-extrabold uppercase mt-1 tracking-wider">{u.role}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Login or Register form */}
      <div className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl w-full transition-all duration-300 ${isRegistering ? 'max-w-md' : 'max-w-sm'} text-left space-y-5`}>
        {!isRegistering ? (
          <>
            <div>
              <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                Portal Masuk Sistem
              </h2>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Silakan masukkan nama akun, email, atau kredensial kedinasan Anda</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 text-red-600 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Username / Email Kedinasan</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                    placeholder="cth: superadmin atau nama@pangkalpinangkota.go.id"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                    placeholder="Masukkan kata sandi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 font-bold">Ingat Saya</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); triggerToast('Sila hubungi Super Admin untuk reset sandi!', 'info'); }} className="hover:underline hover:text-blue-600 font-bold uppercase tracking-wider">
                  Lupa Sandi?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1E3A8A] hover:bg-blue-850 text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/10 transition-colors uppercase tracking-wider text-xs"
              >
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>Verifikasi Akun</span>
              </button>
            </form>

            <div className="border-t border-slate-100 dark:border-gray-800 pt-4 text-center">
              <p className="text-[10px] text-slate-400 font-semibold">
                Belum memiliki akun resmi?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(true); setErrorMsg(''); }}
                  className="text-[#1E3A8A] dark:text-blue-400 font-extrabold hover:underline uppercase tracking-wider ml-1"
                >
                  Daftar Akun Baru
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 pb-3">
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setErrorMsg(''); }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Pendaftaran Anggota
                </h2>
                <p className="text-[10px] text-slate-400 font-semibold">Lengkapi informasi biodata dinas pegawai</p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 text-red-600 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span className="font-bold">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Nama Lengkap <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="cth: Dr. Hendra, M.Si"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">NIP Dinas <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    placeholder="cth: 19820512..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Email (Dinas / Pribadi) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="cth: hendra@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Username <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="cth: hendra.kaban"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Kata Sandi <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Sandi baru..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Ulangi Sandi <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      placeholder="Konfirmasi..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0812xxxx"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Divisi Kerja <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <select
                      value={regDivision}
                      onChange={(e) => setRegDivision(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-800 dark:text-slate-100 transition-all text-xs appearance-none"
                    >
                      <option value="Sekretariat">Sekretariat</option>
                      <option value="Bidang Perbendaharaan">Perbendaharaan</option>
                      <option value="Bidang Aset">Aset Daerah</option>
                      <option value="Bidang Pendapatan">Pendapatan</option>
                      <option value="Bidang Anggaran">Anggaran</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Peran Kedinasan (Role) <span className="text-red-500">*</span></label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as Role)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-xl outline-none focus:border-blue-500 dark:text-slate-850 dark:text-slate-100 transition-all text-xs"
                >
                  <option value="Pegawai">Pegawai / Staf</option>
                  <option value="Kepala Subbagian">Kepala Subbagian (Kasubbag)</option>
                  <option value="Admin Sekretariat">Admin Sekretariat</option>
                  <option value="Kepala Badan">Kepala Badan (Kaban)</option>
                </select>
                <span className="text-[9px] text-slate-400 block mt-1 leading-normal font-medium">Peran kedinasan menentukan hak akses disposisi surat di lingkungan BAKEUDA.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1E3A8A] hover:bg-blue-850 text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/10 transition-colors uppercase tracking-wider text-xs mt-3"
              >
                <UserPlus className="w-4 h-4" />
                <span>Buat Akun Baru</span>
              </button>
            </form>

            <div className="border-t border-slate-100 dark:border-gray-800 pt-4 text-center">
              <p className="text-[10px] text-slate-400 font-semibold">
                Sudah memiliki akun resmi?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(false); setErrorMsg(''); }}
                  className="text-[#1E3A8A] dark:text-blue-400 font-extrabold hover:underline uppercase tracking-wider ml-1"
                >
                  Login Masuk
                </button>
              </p>
            </div>
          </>
        )}
      </div>

    </div>
  );
};
