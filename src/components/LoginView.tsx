/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, AlertCircle, HelpCircle } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  mockUsersList: User[];
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, mockUsersList, triggerToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Harap masukkan username dan kata sandi Anda!');
      triggerToast('Kolom login wajib diisi!', 'warning');
      return;
    }

    // Authenticate with mockUsersList
    const matchedUser = mockUsersList.find(u => u.username === username.trim().toLowerCase());
    if (matchedUser) {
      setErrorMsg('');
      triggerToast(`Selamat datang kembali, ${matchedUser.name}!`, 'success');
      onLoginSuccess(matchedUser);
    } else {
      setErrorMsg('Username atau Kata Sandi salah!');
      triggerToast('Kredensial tidak valid!', 'danger');
    }
  };

  const handleQuickFill = (u: User) => {
    setUsername(u.username);
    setPassword('secret_password');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col md:flex-row items-center justify-center p-6 text-xs text-slate-500 font-semibold gap-8">
      
      {/* Left decoration: Logo & Title card */}
      <div className="max-w-md text-left space-y-4">
        <div className="inline-flex p-3 bg-blue-900 text-white rounded-2xl shadow-xl shadow-blue-900/10">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide leading-tight">
            Smart Office Dashboard Sekretariat (SODS)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Badan Keuangan Daerah Kota Pangkalpinang</p>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Sistem administrasi persuratan terpadu dan disposisi elektronik terintegrasi. Menunjang tata kelola pemerintahan yang responsif, transparan, dan akuntabel.
        </p>

        {/* Quick Help: credentials assistant */}
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm space-y-3">
          <h4 className="font-extrabold text-[10px] text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            Asisten Login Cepat (Uji Coba Multi-Role)
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {mockUsersList.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickFill(u)}
                className="p-2 border border-slate-100 dark:border-gray-800 hover:border-blue-500 rounded-xl hover:bg-slate-50 text-left transition-all"
              >
                <p className="font-bold text-slate-800 dark:text-white truncate text-[10px]">{u.name.split(',')[0]}</p>
                <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase mt-0.5">{u.role}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="bg-white dark:bg-gray-900 border border-slate-150 dark:border-gray-800 rounded-3xl p-6 shadow-xl w-full max-w-sm text-left space-y-5">
        <div>
          <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Portal Masuk Sistem
          </h2>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Silakan masukkan nama akun dan kata sandi kedinasan Anda</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 text-red-600 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span className="font-bold">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Username Kedinasan</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                placeholder="cth: hendra.kaban"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-2xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:bg-gray-950 dark:border-gray-800 rounded-2xl outline-none focus:border-blue-500 dark:text-slate-100 transition-all text-xs"
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
            className="w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-blue-900/10 transition-colors uppercase tracking-wider"
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>Verifikasi Akun</span>
          </button>
        </form>
      </div>

    </div>
  );
};
