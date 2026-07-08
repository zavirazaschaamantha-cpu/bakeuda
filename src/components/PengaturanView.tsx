/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, ShieldCheck, Database, HardDriveDownload, Sparkles, HelpCircle } from 'lucide-react';

interface PengaturanViewProps {
  currentUser: User;
  addLog: (aktivitas: 'Edit Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

import { User } from '../types';

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  currentUser,
  addLog,
  triggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'instansi' | 'database' | 'backup'>('instansi');

  // Form Fields loaded from localStorage or fallback
  const [instansi, setInstansi] = useState(() => localStorage.getItem('sods_setting_instansi') || 'Badan Keuangan Daerah Kota Pangkalpinang');
  const [kepalaBadan, setKepalaBadan] = useState(() => localStorage.getItem('sods_setting_kepala') || 'Dr. Budiyanto, M.Si.');
  const [nipKepala, setNipKepala] = useState(() => localStorage.getItem('sods_setting_nip') || '197103151996031002');
  const [alamat, setAlamat] = useState(() => localStorage.getItem('sods_setting_alamat') || 'Jl. Merdeka No.4, Pangkalpinang, Prov. Kep. Bangka Belitung 33111');

  const [dbHost, setDbHost] = useState('127.0.0.1');
  const [dbName, setDbName] = useState('sods_bakeuda_db');
  const [dbUser, setDbUser] = useState('sods_root');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sods_setting_instansi', instansi);
    localStorage.setItem('sods_setting_kepala', kepalaBadan);
    localStorage.setItem('sods_setting_nip', nipKepala);
    localStorage.setItem('sods_setting_alamat', alamat);
    addLog('Edit Data', 'Memperbarui profil instansi pemerintah daerah.');
    triggerToast('Konfigurasi instansi berhasil disimpan secara permanen!', 'success');
  };

  const handleBackup = () => {
    // Collect all real data from localStorage
    const backupData = {
      app_info: {
        system_name: 'Smart Office Dashboard Sekretariat (SODS)',
        instansi_name: instansi,
        kepala_badan: kepalaBadan,
        nip_kepala: nipKepala,
        alamat: alamat,
        export_date: new Date().toISOString()
      },
      users: JSON.parse(localStorage.getItem('sods_users') || '[]'),
      surat_masuk: JSON.parse(localStorage.getItem('sods_surat_masuk') || '[]'),
      surat_keluar: JSON.parse(localStorage.getItem('sods_surat_keluar') || '[]'),
      disposisi: JSON.parse(localStorage.getItem('sods_disposisi') || '[]'),
      agenda: JSON.parse(localStorage.getItem('sods_agenda') || '[]'),
      reminders: JSON.parse(localStorage.getItem('sods_reminders') || '[]'),
      arsip: JSON.parse(localStorage.getItem('sods_arsip') || '[]'),
      pengumuman: JSON.parse(localStorage.getItem('sods_pengumuman') || '[]'),
      pegawai: JSON.parse(localStorage.getItem('sods_pegawai') || '[]'),
      audit_logs: JSON.parse(localStorage.getItem('sods_audit_logs') || '[]'),
      notifications: JSON.parse(localStorage.getItem('sods_notifications') || '[]')
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SODS_Backup_Bakeuda_Pangkalpinang_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Backup data riil berhasil diunduh!', 'success');
  };

  // Preformatted Laravel 12 / Database structures for transparency
  const laravelMigration = `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        // Table: surat_masuk
        Schema::create('surat_masuk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nomor_surat')->unique();
            $table->string('asal_surat');
            $table->text('perihal');
            $table->date('tanggal_surat');
            $table->date('tanggal_diterima');
            $table->enum('prioritas', ['Normal', 'Penting', 'Sangat Penting']);
            $table->enum('kategori', ['Dinas', 'Undangan', 'Pemberitahuan', 'Lain-lain']);
            $table->string('tujuan_disposisi')->nullable();
            $table->enum('status', ['Belum Diproses', 'Sedang Diproses', 'Menunggu Persetujuan', 'Selesai']);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }
};`;

  const laravelSanctum = `// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ',' . parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-500 font-semibold text-left">
      
      {/* Left sidebar option selectors */}
      <div className="md:col-span-1 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-2">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-50 dark:border-gray-850 pb-3 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          Settings Panel
        </h3>

        <button
          onClick={() => setActiveTab('instansi')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-semibold text-left transition-all ${
            activeTab === 'instansi'
              ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold'
              : 'hover:bg-slate-50 text-slate-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Profil Instansi</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-semibold text-left transition-all ${
            activeTab === 'database'
              ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold'
              : 'hover:bg-slate-50 text-slate-500'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Skema Laravel & API</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-semibold text-left transition-all ${
            activeTab === 'backup'
              ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold'
              : 'hover:bg-slate-50 text-slate-500'
          }`}
        >
          <HardDriveDownload className="w-4 h-4" />
          <span>Cadangan (Backups)</span>
        </button>
      </div>

      {/* Right panel setting form */}
      <div className="md:col-span-3 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm min-h-[500px] flex flex-col justify-between">
        
        {activeTab === 'instansi' && (
          <form onSubmit={handleSaveSettings} className="space-y-4 flex-1">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-gray-850 pb-3 mb-4 uppercase">
              Identitas Instansi Pemerintahan
            </h3>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Nama Lengkap Satuan Kerja Pemerintah Daerah (SKPD)</label>
              <input
                type="text"
                required
                value={instansi}
                onChange={(e) => setInstansi(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-950 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Nama Pimpinan (Kepala Badan)</label>
                <input
                  type="text"
                  required
                  value={kepalaBadan}
                  onChange={(e) => setKepalaBadan(e.target.value)}
                  className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-950 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">NIP Kepala Badan</label>
                <input
                  type="text"
                  required
                  value={nipKepala}
                  onChange={(e) => setNipKepala(e.target.value)}
                  className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-950 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Alamat Gedung Kantor Utama</label>
              <input
                type="text"
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-950 rounded-xl px-4 py-2.5 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="pt-4 border-t border-slate-50 dark:border-gray-850">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Simpan Konfigurasi
              </button>
            </div>
          </form>
        )}

        {activeTab === 'database' && (
          <div className="space-y-4 flex-1">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-gray-850 pb-3 mb-4 uppercase flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-500" />
              Skema Database (Laravel 12 REST API & Sanctum)
            </h3>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Untuk menyambungkan frontend ini dengan Laravel 12 API yang diproteksi Sanctum, gunakan skema migrasi tabel Surat Masuk dan setelan Sanctum berikut pada Laravel Controller Anda:
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-slate-400 font-bold block uppercase">database/migrations/create_surat_masuk_table.php</span>
                <pre className="p-3.5 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-850 rounded-2xl font-mono text-[10px] text-slate-600 dark:text-slate-400 overflow-x-auto max-h-48 scrollbar-thin">
                  {laravelMigration}
                </pre>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-[9px] text-slate-400 font-bold block uppercase">config/sanctum.php</span>
                <pre className="p-3.5 bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-850 rounded-2xl font-mono text-[10px] text-slate-600 dark:text-slate-400 overflow-x-auto max-h-40 scrollbar-thin">
                  {laravelSanctum}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-gray-850 pb-3 mb-4 uppercase">
                Sistem Cadangan Eksternal (Backup)
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Gunakan menu ini untuk mengunduh seluruh salinan data surat masuk, surat keluar, disposisi, dan audit trails dalam bentuk terstruktur (JSON/SQL). Anda dapat mengimpor salinan ini ke lingkungan Laravel 12.
              </p>
            </div>

            <div className="p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center justify-between gap-4 mt-6">
              <div className="space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-400">Unduh SQL Backup Komplet</p>
                <p className="text-[10px] text-blue-500">Mencakup tabel PNS, Disposisi, Surat, dan log riwayat.</p>
              </div>
              <button
                type="button"
                onClick={handleBackup}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1 shrink-0 shadow-md shadow-blue-500/10"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>Unduh</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
