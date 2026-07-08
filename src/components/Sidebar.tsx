/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  MailOpen,
  Send,
  GitPullRequest,
  Compass,
  CalendarDays,
  BellRing,
  FolderLock,
  Megaphone,
  Users2,
  UserCheck,
  FileCheck2,
  Database,
  BarChart3,
  Settings,
  LogOut,
  Building
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  roles: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  onLogout
}) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan', 'Pegawai'] },
    { id: 'surat_masuk', label: 'Surat Masuk', icon: MailOpen, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan', 'Pegawai'] },
    { id: 'surat_keluar', label: 'Surat Keluar', icon: Send, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan'] },
    { id: 'disposisi', label: 'Smart Disposition', icon: GitPullRequest, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan', 'Pegawai'] },
    { id: 'agenda', label: 'Agenda Kerja', icon: CalendarDays, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan', 'Pegawai'] },
    { id: 'reminder', label: 'Reminder', icon: BellRing, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan'] },
    { id: 'arsip', label: 'Arsip Digital', icon: FolderLock, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan', 'Pegawai'] },
    { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan', 'Pegawai'] },
    { id: 'pegawai', label: 'Data Pegawai', icon: Users2, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan'] },
    { id: 'user', label: 'Manajemen User', icon: UserCheck, roles: ['Super Admin'] },
    { id: 'audit', label: 'Audit Log', icon: FileCheck2, roles: ['Super Admin'] },
    { id: 'laporan', label: 'Laporan & Stat', icon: BarChart3, roles: ['Super Admin', 'Admin Sekretariat', 'Kepala Subbagian', 'Kepala Badan'] },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, roles: ['Super Admin'] },
  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(currentUser.role));

  const mainGroupIds = ['dashboard', 'surat_masuk', 'surat_keluar', 'disposisi', 'agenda', 'reminder', 'arsip', 'pengumuman'];
  const mainMenuFiltered = filteredMenu.filter(item => mainGroupIds.includes(item.id));
  const systemMenuFiltered = filteredMenu.filter(item => !mainGroupIds.includes(item.id));

  return (
    <aside className="w-60 bg-[#1E3A8A] dark:bg-[#0B1E4E] text-blue-100/90 flex flex-col shrink-0 h-screen border-r border-blue-900/40 dark:border-gray-800 transition-colors z-20 shadow-xl">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 dark:border-gray-800/60 flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-blue-950 font-extrabold text-xl shadow-lg ring-2 ring-white/20 shrink-0">
          BK
        </div>
        <div className="leading-none">
          <h2 className="text-white font-bold text-sm tracking-tight">SODS BAKEUDA</h2>
          <p className="text-yellow-300 text-[10px] mt-1 font-bold tracking-wider uppercase">Kota Pangkalpinang</p>
        </div>
      </div>

      {/* User Quick Info */}
      <div className="px-5 py-3.5 border-b border-white/10 dark:border-gray-800/60 bg-black/20 dark:bg-black/30 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden ring-1 ring-white/20 shrink-0">
          <img src={currentUser.fotoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate leading-none">{currentUser.name}</p>
          <span className="text-[9px] text-yellow-300 font-extrabold block uppercase tracking-wider mt-1.5">● {currentUser.role}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        <div className="text-blue-300/50 dark:text-blue-300/40 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5">Main Menu</div>
        {mainMenuFiltered.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 text-left ${
                isActive
                  ? 'bg-yellow-400 text-blue-950 font-extrabold shadow-md shadow-yellow-400/20'
                  : 'hover:bg-white/10 text-blue-100/80 hover:text-white'
              }`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-950' : 'text-blue-200/80'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-950 animate-pulse" />
              )}
            </button>
          );
        })}

        {systemMenuFiltered.length > 0 && (
          <div className="mt-5 pt-3 border-t border-white/10 dark:border-gray-800/60">
            <div className="text-blue-300/50 dark:text-blue-300/40 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5">Sistem</div>
            {systemMenuFiltered.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 text-left ${
                    isActive
                      ? 'bg-yellow-400 text-blue-950 font-extrabold shadow-md shadow-yellow-400/20'
                      : 'hover:bg-white/10 text-blue-100/80 hover:text-white'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-950' : 'text-blue-200/80'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-950 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10 dark:border-gray-800/60 bg-black/10 dark:bg-black/20">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all text-left"
        >
          <LogOut className="w-4 h-4 text-rose-300" />
          <span>Keluar Sesi</span>
        </button>
        <div className="text-[10px] text-blue-200/40 dark:text-blue-300/30 text-center mt-3 font-mono">
          SODS v1.2.0 © Bakeuda
        </div>
      </div>

    </aside>
  );
};
