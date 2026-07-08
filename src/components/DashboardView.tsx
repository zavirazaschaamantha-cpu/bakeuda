/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MailOpen,
  Send,
  GitPullRequest,
  FolderLock,
  CalendarDays,
  BellRing,
  Users2,
  TrendingUp,
  Clock,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SuratMasuk, SuratKeluar, Disposisi, Reminder, Agenda, AuditLog, User } from '../types';

interface DashboardViewProps {
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  disposisi: Disposisi[];
  reminders: Reminder[];
  agendas: Agenda[];
  auditLogs: AuditLog[];
  currentUser: User;
  setActiveView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  suratMasuk,
  suratKeluar,
  disposisi,
  reminders,
  agendas,
  auditLogs,
  currentUser,
  setActiveView
}) => {
  // Compute Stats
  const countSuratMasuk = suratMasuk.length;
  const countSuratKeluar = suratKeluar.length;
  const countDisposisi = disposisi.length;
  const countArsip = 3; // simulated initial archives

  const stats = [
    {
      id: 'sm',
      title: 'Surat Masuk Hari Ini',
      value: countSuratMasuk,
      subtext: '+2 surat baru hari ini',
      icon: MailOpen,
      color: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/15',
      view: 'surat_masuk'
    },
    {
      id: 'sk',
      title: 'Surat Keluar Terkirim',
      value: countSuratKeluar,
      subtext: '900/215/BAKEUDA draf baru',
      icon: Send,
      color: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/15',
      view: 'surat_keluar'
    },
    {
      id: 'disp',
      title: 'Disposisi Aktif',
      value: countDisposisi,
      subtext: '1 sedang diproses',
      icon: GitPullRequest,
      color: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/15',
      view: 'disposisi'
    },
    {
      id: 'arsip',
      title: 'Total Arsip Digital',
      value: countArsip + 15, // dynamic mock scale
      subtext: 'Laporan LKPD 2025 diunduh',
      icon: FolderLock,
      color: 'from-violet-500 to-fuchsia-600',
      shadowColor: 'shadow-violet-500/15',
      view: 'arsip'
    }
  ];

  // Chart Data: Monthly Letter volume (historical representation)
  const monthlyVolumeData = [
    { name: 'Jan', Masuk: 12, Keluar: 8, Disposisi: 10 },
    { name: 'Feb', Masuk: 19, Keluar: 15, Disposisi: 14 },
    { name: 'Mar', Masuk: 25, Keluar: 18, Disposisi: 22 },
    { name: 'Apr', Masuk: 18, Keluar: 22, Disposisi: 15 },
    { name: 'May', Masuk: 30, Keluar: 24, Disposisi: 28 },
    { name: 'Jun', Masuk: 42, Keluar: 35, Disposisi: 39 },
    { name: 'Jul', Masuk: countSuratMasuk + 5, Keluar: countSuratKeluar + 3, Disposisi: countDisposisi + 2 }
  ];

  // Pie chart: Distribution of letter statuses
  const statusCounts = {
    'Belum Diproses': suratMasuk.filter(s => s.status === 'Belum Diproses').length,
    'Sedang Diproses': suratMasuk.filter(s => s.status === 'Sedang Diproses').length,
    'Menunggu Persetujuan': suratMasuk.filter(s => s.status === 'Menunggu Persetujuan').length,
    'Selesai': suratMasuk.filter(s => s.status === 'Selesai').length
  };

  const pieData = [
    { name: 'Belum Diproses', value: statusCounts['Belum Diproses'] || 1, color: '#EF4444' }, // Red
    { name: 'Sedang Diproses', value: statusCounts['Sedang Diproses'] || 2, color: '#F59E0B' }, // Amber
    { name: 'Menunggu Persetujuan', value: statusCounts['Menunggu Persetujuan'] || 1, color: '#3B82F6' }, // Blue
    { name: 'Selesai', value: statusCounts['Selesai'] || 3, color: '#10B981' } // Emerald
  ];

  // Audit activities chart
  const userActivities = [
    { role: 'Admin', count: auditLogs.filter(l => l.userRole === 'Admin Sekretariat').length + 4 },
    { role: 'Super Admin', count: auditLogs.filter(l => l.userRole === 'Super Admin').length + 3 },
    { role: 'Kasubbag', count: auditLogs.filter(l => l.userRole === 'Kepala Subbagian').length + 2 },
    { role: 'Kaban', count: auditLogs.filter(l => l.userRole === 'Kepala Badan').length + 1 },
    { role: 'Pegawai', count: auditLogs.filter(l => l.userRole === 'Pegawai').length + 2 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-blue-900 p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight leading-none md:text-3xl">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-blue-100 text-xs mt-2 font-medium opacity-90 max-w-2xl">
            Sistem Informasi Monitoring Administrasi Terintegrasi Sekretariat Badan Keuangan Daerah Kota Pangkalpinang.
          </p>
          <div className="mt-4 flex gap-2">
            <span className="bg-white/10 text-white border border-white/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Sesi: {currentUser.role}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Online
            </span>
          </div>
        </div>
        
        {/* Real-time Jam & Info */}
        <div className="bg-black/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col text-right items-end justify-center">
          <span className="text-[10px] font-extrabold text-blue-200 tracking-widest uppercase">HARI INI</span>
          <span className="text-lg font-bold font-mono tracking-tight text-white mt-0.5">Selasa, 7 Juli 2026</span>
          <span className="text-[10px] font-semibold text-blue-200/80 mt-0.5">Kota Pangkalpinang</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => setActiveView('surat_masuk')}
          className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Surat Masuk Hari Ini</p>
            <div className="flex items-end justify-between mt-3">
              <h3 className="text-3xl font-black text-slate-850 dark:text-slate-100 group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors">{countSuratMasuk}</h3>
              <span className="text-[10px] text-green-600 font-extrabold bg-green-50 dark:bg-green-950/40 dark:text-green-400 px-2 py-0.5 rounded">+{countSuratMasuk > 0 ? '15%' : '0%'} ↑</span>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-gray-800 mt-4 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-[#1E3A8A]"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => setActiveView('surat_keluar')}
          className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Surat Keluar Hari Ini</p>
            <div className="flex items-end justify-between mt-3">
              <h3 className="text-3xl font-black text-slate-850 dark:text-slate-100 group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors">{countSuratKeluar}</h3>
              <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded">Normal</span>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-gray-800 mt-4 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-indigo-500"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => setActiveView('disposisi')}
          className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Disposisi Aktif</p>
            <div className="flex items-end justify-between mt-3">
              <h3 className="text-3xl font-black text-slate-850 dark:text-slate-100 group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors">{countDisposisi}</h3>
              <span className="text-[10px] text-amber-600 font-extrabold bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded">Perlu Tindak</span>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-gray-800 mt-4 rounded-full overflow-hidden">
            <div className="w-5/6 h-full bg-amber-500"></div>
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => setActiveView('arsip')}
          className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Arsip Digital</p>
            <div className="flex items-end justify-between mt-3">
              <h3 className="text-3xl font-black text-slate-855 dark:text-slate-100 group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors">{countArsip + 15}</h3>
              <span className="text-[10px] text-slate-500 font-extrabold bg-slate-50 dark:bg-gray-800 dark:text-slate-400 px-2 py-0.5 rounded">Cloud Storage</span>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-gray-800 mt-4 rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald-500 opacity-60"></div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Volume Area Chart */}
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-gray-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Tren Administrasi Surat</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Statistik Bulanan Tahun 2026</p>
            </div>
            <select className="text-[10px] bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 rounded px-2 py-1 outline-none">
              <option>6 Bulan Terakhir</option>
            </select>
          </div>
          
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="Masuk" stroke="#1E3A8A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMasuk)" name="Surat Masuk" />
                <Area type="monotone" dataKey="Keluar" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorKeluar)" name="Surat Keluar" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Status Distribution */}
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-gray-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Status Penyelesaian</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Distribusi status tindaklanjut surat masuk</p>
            </div>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-850 dark:text-slate-100">{suratMasuk.length}</span>
              <span className="text-[9px] text-slate-400 font-extrabold tracking-widest uppercase mt-0.5">TOTAL</span>
            </div>
          </div>

          {/* Custom Legends */}
          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold text-slate-500 dark:text-slate-400">
            {pieData.map((d, index) => (
              <div key={index} className="flex items-center gap-1 px-2 py-1 rounded bg-slate-50 dark:bg-gray-800 border border-slate-100/40 dark:border-gray-800/60">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="truncate">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid: Deadlines, User Activity, Agendas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Deadline Warnings */}
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col h-[340px]">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-50 dark:border-gray-800 pb-3">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            Batas Waktu Administrasi
          </h4>
          <div className="flex-1 overflow-y-auto mt-3 space-y-3 scrollbar-thin">
            {reminders.map((rem) => (
              <div key={rem.id} className="p-3 bg-red-50/20 dark:bg-red-950/10 rounded-xl border border-red-100/40 dark:border-red-900/20 text-[11px]">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-[9px] text-red-600 dark:text-red-400 bg-red-100/60 dark:bg-red-950/50 px-2 py-0.5 rounded uppercase">
                    {rem.tipe}
                  </span>
                  <span className="text-slate-400 font-mono text-[9px]">{rem.tanggalDeadline}</span>
                </div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mt-2 truncate">{rem.referensiJudul}</h5>
                <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{rem.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity Tracker (Audit Logs) */}
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col h-[340px]">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-50 dark:border-gray-800 pb-3">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Aktivitas Pengguna Terkini
          </h4>
          <div className="flex-1 overflow-y-auto mt-3 space-y-3 scrollbar-thin">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex gap-2.5 border-l-2 border-[#1E3A8A]/20 pl-3 py-0.5 text-[11px]">
                <div className="flex-1">
                  <div className="flex justify-between items-center text-[9px] text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{log.userName}</span>
                    <span className="font-mono">{log.timestamp}</span>
                  </div>
                  <p className="font-extrabold text-[#1E3A8A] dark:text-blue-400 mt-0.5 uppercase text-[9px] tracking-wider">{log.aktivitas}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agenda Hari Ini */}
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col h-[340px]">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-50 dark:border-gray-800 pb-3">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Agenda Kerja Terdekat
          </h4>
          <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 scrollbar-thin">
            {agendas.map((ag) => (
              <div key={ag.id} className="p-3 bg-slate-50 dark:bg-gray-850 border border-slate-100 dark:border-gray-800 rounded-xl text-[11px]">
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    ag.kategori === 'Rapat' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' :
                    ag.kategori === 'Bimtek' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {ag.kategori}
                  </span>
                  <span className="font-mono text-slate-400 text-[9px]">{ag.tanggalMulai}</span>
                </div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200 mt-2 line-clamp-1">{ag.judul}</h5>
                <p className="text-slate-400 text-[10px] mt-0.5 italic">Lokasi: {ag.lokasi}</p>
                <div className="flex justify-between items-center mt-2 border-t border-slate-100/40 dark:border-gray-800 pt-2 text-[10px]">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">{ag.waktu}</span>
                  <span className={`font-bold uppercase ${ag.disetujui ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {ag.disetujui ? 'Disetujui' : 'Menunggu Approval'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Activity Log (Sleek Theme Design) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden shrink-0 mt-6">
        <div className="px-6 py-3 border-b border-slate-50 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-gray-900/50">
          <h4 className="text-[10px] font-extrabold text-slate-750 dark:text-slate-300 uppercase tracking-widest">Log Aktivitas Terbaru</h4>
          <span onClick={() => setActiveView('audit')} className="text-[10px] text-[#1E3A8A] dark:text-blue-400 font-bold cursor-pointer hover:underline">Lihat Audit Log →</span>
        </div>
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-start gap-4 md:gap-8 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span><strong className="text-slate-700 dark:text-slate-300">Admin</strong> mengubah status surat <span className="italic font-mono">#SM-092</span></span>
            <span className="text-slate-300 dark:text-slate-600 font-mono text-[9px]">• 2 menit yang lalu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span><strong className="text-slate-700 dark:text-slate-300">Kasubbag</strong> mengunggah berkas arsip baru</span>
            <span className="text-slate-300 dark:text-slate-600 font-mono text-[9px]">• 14 menit yang lalu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>Sistem mengirim pengingat deadline agenda besok</span>
            <span className="text-slate-300 dark:text-slate-600 font-mono text-[9px]">• 1 jam yang lalu</span>
          </div>
        </div>
      </div>

    </div>
  );
};
