/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, Printer, Download, Search, AlertCircle, FileText } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { SuratMasuk, SuratKeluar, Disposisi } from '../types';

interface LaporanViewProps {
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  disposisi: Disposisi[];
  addLog: (aktivitas: 'Download Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  suratMasuk,
  suratKeluar,
  disposisi,
  addLog,
  triggerToast
}) => {
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-07');
  const [reportType, setReportType] = useState<'surat_masuk' | 'surat_keluar' | 'disposisi'>('surat_masuk');

  const filteredSM = suratMasuk.filter(s => s.tanggalDiterima >= startDate && s.tanggalDiterima <= endDate);
  const filteredSK = suratKeluar.filter(s => s.tanggal >= startDate && s.tanggal <= endDate);
  const filteredDP = disposisi.filter(s => s.tanggal >= startDate && s.tanggal <= endDate);

  const getStats = () => {
    switch (reportType) {
      case 'surat_masuk':
        return {
          total: filteredSM.length,
          kategori: {
            Dinas: filteredSM.filter(s => s.kategori === 'Dinas').length,
            Undangan: filteredSM.filter(s => s.kategori === 'Undangan').length,
            Pemberitahuan: filteredSM.filter(s => s.kategori === 'Pemberitahuan').length,
            Lain: filteredSM.filter(s => s.kategori === 'Lain-lain').length,
          }
        };
      case 'surat_keluar':
        return {
          total: filteredSK.length,
          kategori: {
            Dinas: filteredSK.filter(s => s.kategori === 'Dinas').length,
            Undangan: filteredSK.filter(s => s.kategori === 'Undangan').length,
            Pemberitahuan: filteredSK.filter(s => s.kategori === 'Pemberitahuan').length,
            Lain: filteredSK.filter(s => s.kategori === 'Lain-lain').length,
          }
        };
      case 'disposisi':
        return {
          total: filteredDP.length,
          kategori: {
            Selesai: filteredDP.filter(s => s.status === 'Selesai').length,
            Proses: filteredDP.filter(s => s.status === 'Sedang Diproses').length,
            Belum: filteredDP.filter(s => s.status === 'Belum Diproses').length,
            Persetujuan: filteredDP.filter(s => s.status === 'Menunggu Persetujuan').length,
          }
        };
    }
  };

  const currentStats = getStats();

  const chartData = [
    { name: 'Dinas', Jumlah: currentStats.kategori.Dinas ?? 0 },
    { name: 'Undangan', Jumlah: currentStats.kategori.Undangan ?? 0 },
    { name: 'Pemberitahuan', Jumlah: currentStats.kategori.Pemberitahuan ?? 0 },
    { name: 'Lain-lain', Jumlah: currentStats.kategori.Lain ?? 0 }
  ];

  const handleExportExcel = () => {
    let csv = 'data:text/csv;charset=utf-8,';
    csv += 'Laporan Rekapitulasi Administrasi Bakeuda Pangkalpinang\n';
    csv += `Periode: ${startDate} s/d ${endDate}\n\n`;
    csv += 'Kategori,Jumlah Berkas\n';
    csv += `Dinas,${currentStats.kategori.Dinas ?? 0}\n`;
    csv += `Undangan,${currentStats.kategori.Undangan ?? 0}\n`;
    csv += `Pemberitahuan,${currentStats.kategori.Pemberitahuan ?? 0}\n`;
    csv += `Lain-lain,${currentStats.kategori.Lain ?? 0}\n`;

    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `Laporan_Rekap_${reportType}_Bakeuda.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog('Download Data', `Mengunduh Rekapitulasi Laporan: ${reportType}`);
    triggerToast('Laporan rekapitulasi berhasil diekspor!', 'success');
  };

  return (
    <div className="space-y-6 text-xs text-slate-500 font-semibold text-left">
      
      {/* Filters Card bar */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-5 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-50 dark:border-gray-850 pb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Filter Rekapitulasi Dokumen Laporan
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Mulai Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl px-3.5 py-2 text-slate-700 dark:text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl px-3.5 py-2 text-slate-700 dark:text-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Jenis Dokumen</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl px-3.5 py-2 text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="surat_masuk">Surat Masuk</option>
              <option value="surat_keluar">Surat Keluar</option>
              <option value="disposisi">Disposisi Kerja</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Unduh Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 rounded-2xl font-bold"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-5 rounded-3xl shadow-sm text-left">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL SURAT MASUK</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white mt-2 block">{filteredSM.length} Berkas</span>
          <span className="text-[10px] text-slate-400 block mt-1">Saring rentang tanggal</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-5 rounded-3xl shadow-sm text-left">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">TOTAL SURAT KELUAR</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white mt-2 block">{filteredSK.length} Berkas</span>
          <span className="text-[10px] text-slate-400 block mt-1">Saring rentang tanggal</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-5 rounded-3xl shadow-sm text-left">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">DISPOSISI DIPROSES</span>
          <span className="text-3xl font-black text-slate-800 dark:text-white mt-2 block">{filteredDP.length} Tugas</span>
          <span className="text-[10px] text-slate-400 block mt-1">Saring rentang tanggal</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-5 rounded-3xl shadow-sm text-left bg-gradient-to-br from-blue-900 to-indigo-950 text-white">
          <span className="text-[10px] text-slate-300 block uppercase font-bold">RASIO SELESAI</span>
          <span className="text-3xl font-black mt-2 block">100%</span>
          <span className="text-[10px] text-slate-300 block mt-1">Seluruh administrasi selesai</span>
        </div>
      </div>

      {/* Chart reporting */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
        <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mb-6 uppercase">Visualisasi Pembagian Bidang/Kategori Laporan</h4>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} />
              <YAxis fontSize={11} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar dataKey="Jumlah" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Volume Berkas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
