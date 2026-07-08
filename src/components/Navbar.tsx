/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Search, Sun, Moon, ChevronDown, Shield, User as UserIcon, LogOut, CheckCircle } from 'lucide-react';
import { User, Role, Notification } from '../types';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onGlobalSearch: (term: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  onLogout,
  darkMode,
  setDarkMode,
  notifications,
  onMarkNotificationAsRead,
  onGlobalSearch,
  currentView
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onGlobalSearch(e.target.value);
  };

  const getBreadcrumb = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Utama';
      case 'surat_masuk': return 'Administrasi / Surat Masuk';
      case 'surat_keluar': return 'Administrasi / Surat Keluar';
      case 'disposisi': return 'Alur Disposisi / Smart Disposition Tracker';
      case 'agenda': return 'Agenda & Kalender';
      case 'reminder': return 'Pusat Pengingat (Reminder)';
      case 'arsip': return 'Arsip Digital';
      case 'pengumuman': return 'Pengumuman / Bulletin';
      case 'pegawai': return 'Data Kepegawaian';
      case 'user': return 'Manajemen Pengguna';
      case 'audit': return 'Log Audit Keamanan';
      case 'laporan': return 'Laporan & Statistik';
      case 'pengaturan': return 'Sistem Pengaturan';
      default: return 'Smart Office';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 shadow-sm shrink-0 transition-colors">
      
      {/* Search & Breadcrumbs */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-slate-400">Beranda</span>
          <span className="text-slate-300 font-normal">/</span>
          <span className="text-[#1E3A8A] dark:text-blue-400 font-bold">{getBreadcrumb()}</span>
        </div>

        {/* Global Search */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Cari data surat, arsip, agenda..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-slate-100 dark:bg-gray-800 rounded-full pl-4 pr-10 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 ring-1 ring-slate-200 dark:ring-gray-700 text-slate-800 dark:text-slate-100 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Role Quick Swapper for Reviewer */}
        <div className="flex items-center bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 rounded-full px-3 py-1 text-xs gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-800 dark:text-amber-300 font-medium hidden sm:inline">Role Simulasi:</span>
          <select
            value={currentUser.role}
            onChange={(e) => onRoleChange(e.target.value as Role)}
            className="bg-transparent text-amber-900 dark:text-amber-200 font-bold border-none focus:ring-0 cursor-pointer text-xs p-0 pr-6"
          >
            <option value="Super Admin" className="text-slate-800">Super Admin</option>
            <option value="Admin Sekretariat" className="text-slate-800">Admin Sekretariat</option>
            <option value="Kepala Subbagian" className="text-slate-800">Kepala Subbagian</option>
            <option value="Kepala Badan" className="text-slate-800">Kepala Badan</option>
            <option value="Pegawai" className="text-slate-800">Pegawai</option>
          </select>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-gray-800 rounded-xl transition-all"
          title="Ganti Tema"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-gray-850 border-b border-slate-100 dark:border-gray-800">
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Notifikasi Terkini</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{unreadCount} Belum Dibaca</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">Tidak ada notifikasi baru</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 border-b border-slate-50 dark:border-gray-850 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-gray-850 flex gap-2.5 ${!notif.read ? 'bg-blue-50/40 dark:bg-blue-950/10' : ''}`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                        notif.tipe === 'danger' ? 'bg-red-500' :
                        notif.tipe === 'warning' ? 'bg-amber-500' :
                        notif.tipe === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-1">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{notif.judul}</p>
                          {!notif.read && (
                            <button
                              onClick={() => onMarkNotificationAsRead(notif.id)}
                              className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800"
                              title="Tandai telah dibaca"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{notif.pesan}</p>
                        <span className="text-[10px] text-slate-400 block mt-1.5">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-full transition-all"
          >
            <img
              src={currentUser.fotoUrl}
              alt={currentUser.name}
              className="w-8.5 h-8.5 rounded-full object-cover ring-2 ring-yellow-400"
              referrerPolicy="no-referrer"
            />
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{currentUser.name}</span>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:inline" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden py-1.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/30">
                <p className="font-bold text-slate-800 dark:text-slate-200 leading-normal">{currentUser.name}</p>
                <p className="text-slate-400 font-mono mt-0.5">NIP. {currentUser.nip}</p>
                <p className="text-[10px] text-[#1E3A8A] dark:text-yellow-400 mt-1 uppercase font-extrabold">{currentUser.division}</p>
              </div>
              
              <button
                onClick={() => {
                  onGlobalSearch('PROFIL');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-gray-800 text-left transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Ubah Profil</span>
              </button>
              
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-left transition-colors border-t border-slate-100 dark:border-gray-800"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold">Keluar Aplikasi</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
