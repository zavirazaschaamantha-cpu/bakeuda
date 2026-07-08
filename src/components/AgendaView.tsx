/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Printer,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  FolderPlus
} from 'lucide-react';
import { Agenda, User } from '../types';
import { Modal } from './Modal';

interface AgendaViewProps {
  agendas: Agenda[];
  onAddAgenda: (agenda: Omit<Agenda, 'id'>) => void;
  onApproveAgenda: (id: string, approverName: string) => void;
  currentUser: User;
  addLog: (aktivitas: 'Tambah Data' | 'Edit Data' | 'Download Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  agendas,
  onAddAgenda,
  onApproveAgenda,
  currentUser,
  addLog,
  triggerToast
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 7)); // July 7, 2026
  const [selectedDay, setSelectedDay] = useState<number>(7);
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);

  // Form Fields State
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggalMulai, setTanggalMulai] = useState('2026-07-07');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-07-07');
  const [waktu, setWaktu] = useState('09:00 - Selesai');
  const [kategori, setKategori] = useState<'Rapat' | 'Upacara' | 'Bimtek' | 'Audiensi' | 'Lain-lain'>('Rapat');
  const [lokasi, setLokasi] = useState('');

  const canModify = currentUser.role !== 'Kepala Badan' && currentUser.role !== 'Pegawai';
  const canApprove = currentUser.role === 'Kepala Badan' || currentUser.role === 'Kepala Subbagian' || currentUser.role === 'Super Admin';

  // Constants for July 2026
  const daysInMonth = 31;
  const startOffset = 3; // July 2026 starts on a Wednesday (3 offsets if Sunday=0, Monday=1, Tuesday=2, Wednesday=3)

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  // Grid list of days
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

  // Filter agendas for selected day (e.g. 2026-07-XX)
  const getAgendasForDay = (day: number) => {
    const dateStr = `2026-07-${day.toString().padStart(2, '0')}`;
    return agendas.filter(ag => ag.tanggalMulai === dateStr);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setViewType('day');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !lokasi) {
      triggerToast('Harap isi judul dan lokasi rapat!', 'warning');
      return;
    }

    onAddAgenda({
      judul,
      deskripsi,
      tanggalMulai,
      tanggalSelesai,
      waktu,
      kategori,
      lokasi,
      disetujui: currentUser.role === 'Kepala Badan' || currentUser.role === 'Kepala Subbagian',
      disetujuiOleh: (currentUser.role === 'Kepala Badan' || currentUser.role === 'Kepala Subbagian') ? currentUser.name : undefined
    });

    addLog('Tambah Data', `Menambahkan Agenda Rapat Baru: ${judul}`);
    triggerToast('Agenda berhasil didaftarkan!', 'success');
    setIsAddOpen(false);

    // reset Form
    setJudul('');
    setDeskripsi('');
    setLokasi('');
  };

  const handleApprove = (id: string) => {
    onApproveAgenda(id, currentUser.name);
    addLog('Edit Data', `Menyetujui agenda kerja.`);
    triggerToast('Agenda kerja disetujui pimpinan!', 'success');
    setIsDetailOpen(false);
  };

  const triggerPrint = () => {
    window.print();
    addLog('Download Data', 'Mencetak jadwal agenda dinas.');
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Calendar Header Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Kalender Agenda Kerja Dinas
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Badan Keuangan Daerah Kota Pangkalpinang - T.A 2026</p>
          </div>
        </div>

        {/* View selection tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-gray-800 rounded-xl p-1 shrink-0 font-bold">
            <button
              onClick={() => setViewType('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewType === 'month' ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Bulanan
            </button>
            <button
              onClick={() => setViewType('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewType === 'week' ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Mingguan
            </button>
            <button
              onClick={() => { setViewType('day'); setSelectedDay(7); }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${viewType === 'day' ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              Harian
            </button>
          </div>

          <button
            onClick={triggerPrint}
            className="p-2 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 rounded-xl font-bold flex items-center gap-1.5"
            title="Cetak Jadwal"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline text-slate-600">Cetak</span>
          </button>

          {canModify && (
            <button
              onClick={() => { setTanggalMulai('2026-07-07'); setTanggalSelesai('2026-07-07'); setIsAddOpen(true); }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/15"
            >
              <Plus className="w-4 h-4" />
              <span>Agenda Baru</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Calendar grid */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[500px]">
          <div>
            {/* Month title header */}
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-gray-850 pb-3.5 mb-4">
              <span className="font-extrabold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-slate-50 text-slate-400" disabled><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 rounded hover:bg-slate-50 text-slate-400" disabled><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Week headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-2">
              <span>Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            {/* Grid days */}
            <div className="grid grid-cols-7 gap-1.5 flex-1">
              {calendarCells.map((cell, index) => {
                if (cell === null) return <div key={`empty-${index}`} className="p-2" />;

                const dayAgendas = getAgendasForDay(cell);
                const isToday = cell === 7; // July 7 is our local date representation
                const isSelected = cell === selectedDay;

                return (
                  <div
                    key={`day-${cell}`}
                    onClick={() => { setSelectedDay(cell); setViewType('day'); }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer h-16 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10 font-bold'
                        : isToday
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40'
                        : 'bg-white border-slate-100 dark:bg-gray-900 dark:border-gray-800 text-slate-700 hover:bg-slate-50 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-mono text-xs font-extrabold">{cell}</span>
                    
                    {/* Bullet representation */}
                    {dayAgendas.length > 0 && (
                      <div className="flex gap-1 overflow-hidden">
                        {dayAgendas.slice(0, 3).map((ag) => (
                          <span
                            key={ag.id}
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isSelected ? 'bg-white' :
                              ag.kategori === 'Rapat' ? 'bg-indigo-500' :
                              ag.kategori === 'Bimtek' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            title={ag.judul}
                          />
                        ))}
                        {dayAgendas.length > 3 && (
                          <span className="text-[7px] font-black leading-none shrink-0 text-slate-400">+</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-[10px] text-slate-400 font-mono mt-4">
            * Klik hari pada grid kalender untuk menyaring daftar harian di sebelah kanan
          </div>
        </div>

        {/* Right Column: Day specific / list of events */}
        <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm h-[500px] flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-gray-850 pb-3 mb-4 uppercase tracking-wide">
            {viewType === 'day' ? `Agenda Hari Ini (Juli ${selectedDay})` : 'Daftar Semua Agenda'}
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-thin pr-1">
            {(viewType === 'day' ? getAgendasForDay(selectedDay) : agendas).length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 h-full">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
                <span className="font-semibold">Tidak ada agenda dinas</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Silakan pilih hari lain atau buat agenda baru</span>
              </div>
            ) : (
              (viewType === 'day' ? getAgendasForDay(selectedDay) : agendas).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => { setSelectedAgenda(ag); setIsDetailOpen(true); }}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-850/30 hover:bg-slate-50 cursor-pointer transition-all space-y-2 text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                      ag.kategori === 'Rapat' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' :
                      ag.kategori === 'Bimtek' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {ag.kategori}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{ag.tanggalMulai}</span>
                  </div>
                  
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 line-clamp-1">{ag.judul}</h4>
                  
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{ag.lokasi}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-gray-800/80 pt-2 text-[10px]">
                    <span className="font-mono text-slate-500 font-semibold">{ag.waktu}</span>
                    <span className={`font-bold uppercase text-[9px] ${ag.disetujui ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {ag.disetujui ? '● Disetujui' : '● Menunggu Approval'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* CREATE NEW AGENDA MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Pendaftaran Agenda Rapat Baru" size="md">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Judul Kegiatan / Rapat <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Cth: Pembahasan Raperda APBD Perubahan"
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Tanggal Mulai <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Tanggal Selesai</label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Jam Kegiatan</label>
              <input
                type="text"
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                placeholder="Cth: 09:00 - 12:00 WIB"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5"
              >
                <option value="Rapat">Rapat Koordinasi</option>
                <option value="Bimtek">Bimtek / Sosialisasi</option>
                <option value="Upacara">Upacara / Protokol</option>
                <option value="Audiensi">Audiensi</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Lokasi Kegiatan <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Cth: Ruang Rapat Pimpinan Bakeuda"
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Deskripsi / Keterangan</label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi pendukung kegiatan..."
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-150 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Simpan Agenda
            </button>
          </div>
        </form>
      </Modal>

      {/* AGENDA DETAIL MODAL */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Rincian Agenda Kerja Dinas" size="md">
        {selectedAgenda && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-50 dark:border-gray-850 pb-3">
              <div>
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">Kategori</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm mt-1 block uppercase">{selectedAgenda.kategori}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase block">Status Kelayakan</span>
                <span className={`font-extrabold text-xs mt-1 block uppercase ${selectedAgenda.disetujui ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {selectedAgenda.disetujui ? 'Disetujui Pimpinan' : 'Menunggu Approval'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-normal">{selectedAgenda.judul}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium bg-slate-50 dark:bg-gray-850/40 p-3 rounded-2xl italic border border-slate-100 dark:border-gray-800">
                "{selectedAgenda.deskripsi || 'Tidak ada deskripsi rincian.'}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-t border-b border-slate-50 dark:border-gray-850/50">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 block uppercase text-[10px]">WAKTU & TANGGAL</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300">{selectedAgenda.tanggalMulai} ({selectedAgenda.waktu})</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-400 block uppercase text-[10px]">LOKASI UTAMA</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300">{selectedAgenda.lokasi}</p>
              </div>
            </div>

            {selectedAgenda.disetujui && selectedAgenda.disetujuiOleh && (
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">Disetujui Oleh Pimpinan</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedAgenda.disetujuiOleh}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 border border-slate-200 dark:border-gray-700 text-slate-500 rounded-xl font-bold"
              >
                Tutup
              </button>
              
              {!selectedAgenda.disetujui && canApprove && (
                <button
                  onClick={() => handleApprove(selectedAgenda.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Setujui Agenda
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
