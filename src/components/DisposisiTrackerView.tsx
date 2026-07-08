/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GitPullRequest,
  Clock,
  UserCheck,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  User as UserIcon,
  Plus
} from 'lucide-react';
import { SuratMasuk, User, TimelineEvent, Disposisi } from '../types';

interface DisposisiTrackerViewProps {
  suratList: SuratMasuk[];
  onUpdateStatus: (id: string, status: SuratMasuk['status'], timelineEvent: TimelineEvent) => void;
  onAddComment: (id: string, event: TimelineEvent) => void;
  currentUser: User;
  addLog: (aktivitas: 'Tambah Data' | 'Edit Data' | 'Hapus Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const DisposisiTrackerView: React.FC<DisposisiTrackerViewProps> = ({
  suratList,
  onUpdateStatus,
  onAddComment,
  currentUser,
  addLog,
  triggerToast
}) => {
  const [selectedSuratId, setSelectedSuratId] = useState<string>(suratList[0]?.id || '');
  const [newComment, setNewComment] = useState('');
  const [targetStatus, setTargetStatus] = useState<SuratMasuk['status']>('Sedang Diproses');
  const [disposisiTujuan, setDisposisiTujuan] = useState('Kepala Subbagian Umum & Kepegawaian');
  const [disposisiInstruksi, setDisposisiInstruksi] = useState('Tindaklanjuti segera');

  const selectedSurat = suratList.find(s => s.id === selectedSuratId);

  const getStatusProgress = (status: SuratMasuk['status']) => {
    switch (status) {
      case 'Belum Diproses': return 15;
      case 'Sedang Diproses': return 50;
      case 'Menunggu Persetujuan': return 80;
      case 'Selesai': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: SuratMasuk['status']) => {
    switch (status) {
      case 'Belum Diproses': return 'text-red-500 bg-red-50 dark:bg-red-950/20 dark:text-red-400';
      case 'Sedang Diproses': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400';
      case 'Menunggu Persetujuan': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400';
      case 'Selesai': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedSurat) return;

    const event: TimelineEvent = {
      id: `comm_${Math.random().toString(36).substr(2, 9)}`,
      status: selectedSurat.status,
      tanggal: new Date().toISOString().slice(0, 16).replace('T', ' '),
      deskripsi: `Komentar baru ditambahkan oleh ${currentUser.role}`,
      olehName: currentUser.name,
      catatan: newComment
    };

    onAddComment(selectedSurat.id, event);
    addLog('Tambah Data', `Menambahkan komentar di Surat Masuk: ${selectedSurat.nomorSurat}`);
    triggerToast('Komentar berhasil ditambahkan!', 'success');
    setNewComment('');
  };

  const handleStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurat) return;

    // Permissions check
    if (currentUser.role === 'Kepala Badan' && targetStatus === 'Selesai') {
      // Kaban can approve
    } else if (currentUser.role === 'Kepala Subbagian' && targetStatus === 'Menunggu Persetujuan') {
      // Kasubbag can set waiting approval
    } else if (currentUser.role === 'Pegawai' && currentUser.role !== 'Super Admin' && currentUser.role !== 'Admin Sekretariat') {
      triggerToast('Anda tidak memiliki wewenang mengubah status alur ini!', 'danger');
      return;
    }

    const event: TimelineEvent = {
      id: `ev_${Math.random().toString(36).substr(2, 9)}`,
      status: targetStatus,
      tanggal: new Date().toISOString().slice(0, 16).replace('T', ' '),
      deskripsi: `Status diubah menjadi ${targetStatus} oleh ${currentUser.role}`,
      olehName: currentUser.name,
      catatan: `Pemindahan tanggungjawab/tindaklanjut.`
    };

    onUpdateStatus(selectedSurat.id, targetStatus, event);
    addLog('Edit Data', `Mengubah status Surat Masuk ${selectedSurat.nomorSurat} menjadi ${targetStatus}`);
    triggerToast(`Status disposisi berhasil diubah ke ${targetStatus}!`, 'success');
  };

  const handleForwardDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurat) return;

    const event: TimelineEvent = {
      id: `ev_${Math.random().toString(36).substr(2, 9)}`,
      status: 'Sedang Diproses',
      tanggal: new Date().toISOString().slice(0, 16).replace('T', ' '),
      deskripsi: `Disposisi diteruskan ke: ${disposisiTujuan}`,
      olehName: currentUser.name,
      catatan: `Instruksi: ${disposisiInstruksi}`
    };

    onUpdateStatus(selectedSurat.id, 'Sedang Diproses', event);
    onEditSuratField(selectedSurat.id, { tujuanDisposisi: disposisiTujuan, keterangan: disposisiInstruksi });
    addLog('Edit Data', `Meneruskan disposisi Surat ${selectedSurat.nomorSurat} ke ${disposisiTujuan}`);
    triggerToast(`Disposisi berhasil diteruskan ke ${disposisiTujuan}!`, 'success');
  };

  // Helper inside properties
  const onEditSuratField = (id: string, fields: Partial<SuratMasuk>) => {
    const s = suratList.find(item => item.id === id);
    if (s) {
      Object.assign(s, fields);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
      
      {/* Left Sidebar: Letters Queue list */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm h-[650px] flex flex-col">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-50 dark:border-gray-850 pb-3">
          <GitPullRequest className="w-5 h-5 text-blue-500" />
          Antrean Disposisi Surat
        </h3>
        <p className="text-[10px] text-slate-400 mt-2 mb-3">Pilih surat masuk di bawah untuk melacak visual timeline atau melakukan disposisi</p>
        
        <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-thin pr-1">
          {suratList.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSuratId(s.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                s.id === selectedSuratId
                  ? 'bg-blue-50/60 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/60 ring-2 ring-blue-500/10'
                  : 'bg-white border-slate-100 hover:bg-slate-50 dark:bg-gray-900 dark:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-start gap-1">
                <span className="font-mono text-[9px] text-slate-400 truncate max-w-[130px]" title={s.nomorSurat}>{s.nomorSurat}</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-bold ${
                  s.prioritas === 'Sangat Penting' ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400' :
                  s.prioritas === 'Penting' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {s.prioritas}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-2 line-clamp-1">{s.asalSurat}</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed text-[11px]">{s.perihal}</p>
              
              <div className="flex justify-between items-center mt-3 border-t border-slate-100 dark:border-gray-850 pt-2 text-[10px]">
                <span className="text-slate-400 font-mono">Diterima: {s.tanggalDiterima}</span>
                <span className={`font-bold uppercase ${
                  s.status === 'Selesai' ? 'text-emerald-500' :
                  s.status === 'Menunggu Persetujuan' ? 'text-blue-500' :
                  s.status === 'Sedang Diproses' ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: Timeline & Disposition controls */}
      <div className="lg:col-span-2 space-y-6">
        {selectedSurat ? (
          <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col min-h-[650px]">
            
            {/* Header / Meta */}
            <div className="border-b border-slate-100 dark:border-gray-850 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full">
                  Smart Tracker
                </span>
                <h2 className="font-black text-base text-slate-800 dark:text-slate-100 mt-2">{selectedSurat.nomorSurat}</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-semibold">Perihal: {selectedSurat.perihal}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className={`px-3 py-1.5 rounded-2xl font-bold uppercase text-[10px] ${getStatusColor(selectedSurat.status)}`}>
                  {selectedSurat.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-1.5">Penanggung Jawab: {selectedSurat.tujuanDisposisi}</span>
              </div>
            </div>

            {/* Progress gauge */}
            <div className="py-4 border-b border-slate-50 dark:border-gray-850/50">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                <span>PROGRESS PENYELESAIAN SURAT</span>
                <span className="text-blue-600 dark:text-blue-400">{getStatusProgress(selectedSurat.status)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${getStatusProgress(selectedSurat.status)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold mt-2">
                <span>Registrasi</span>
                <span className={selectedSurat.status !== 'Belum Diproses' ? 'text-blue-500' : ''}>Disposisi Kaban</span>
                <span className={selectedSurat.status === 'Menunggu Persetujuan' || selectedSurat.status === 'Selesai' ? 'text-blue-500' : ''}>Penyelesaian</span>
                <span className={selectedSurat.status === 'Selesai' ? 'text-emerald-500' : ''}>Selesai & Arsip</span>
              </div>
            </div>

            {/* Smart actions columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 flex-1">
              
              {/* Visual Timeline (Visual tree) */}
              <div className="space-y-4 border-r border-slate-100 dark:border-gray-850 pr-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-4">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Riwayat Alur Dokumen (Timeline)
                  </h4>
                  <div className="relative border-l border-slate-200 dark:border-gray-800 pl-4 ml-2.5 space-y-4 max-h-[350px] overflow-y-auto scrollbar-thin">
                    {selectedSurat.timeline.map((event) => (
                      <div key={event.id} className="relative">
                        {/* Node icon */}
                        <span className={`absolute -left-7.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border bg-white dark:bg-gray-900 ${
                          event.status === 'Selesai' ? 'border-emerald-500 text-emerald-500' :
                          event.status === 'Menunggu Persetujuan' ? 'border-blue-500 text-blue-500' :
                          event.status === 'Sedang Diproses' ? 'border-amber-500 text-amber-500' : 'border-red-500 text-red-500'
                        }`}>
                          <UserCheck className="w-3.5 h-3.5" />
                        </span>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-200">{event.olehName}</span>
                            <span className="font-mono">{event.tanggal}</span>
                          </div>
                          <p className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">{event.deskripsi}</p>
                          {event.catatan && (
                            <p className="p-2.5 bg-slate-50 dark:bg-gray-850/50 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-100/50 dark:border-gray-800 italic leading-relaxed">
                              "{event.catatan}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Comment input */}
                <form onSubmit={handlePostComment} className="pt-4 border-t border-slate-50 dark:border-gray-850">
                  <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1.5">Tulis Komentar / Catatan Tambahan</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Masukkan instruksi atau komentar..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-slate-100 rounded-xl"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

              </div>

              {/* Administrative actions */}
              <div className="space-y-5 flex flex-col justify-between">
                
                {/* 1. Update status (role permissions based) */}
                <div className="p-4 bg-slate-50/50 dark:bg-gray-850 rounded-2xl border border-slate-100 dark:border-gray-800">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    Perbarui Status Administrasi
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-normal mb-3">
                    Ubah status penyelesaian dokumen. Kasubbag mengajukan persetujuan, Kepala Badan menandai Selesai.
                  </p>
                  
                  <form onSubmit={handleStatusChange} className="space-y-3">
                    <div className="flex gap-2">
                      <select
                        value={targetStatus}
                        onChange={(e) => setTargetStatus(e.target.value as any)}
                        className="flex-1 bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-xl px-3 py-2"
                      >
                        <option value="Sedang Diproses">Sedang Diproses</option>
                        <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Disposisi router */}
                <div className="p-4 bg-slate-50/50 dark:bg-gray-850 rounded-2xl border border-slate-100 dark:border-gray-800 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                      <GitPullRequest className="w-4 h-4 text-emerald-500" />
                      Teruskan Disposisi (Forward)
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-normal mb-3">
                      Pindahkan surat atau teruskan delegasi tugas ke subbagian/staf pegawai terkait.
                    </p>
                  </div>

                  <form onSubmit={handleForwardDisposisi} className="space-y-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">Penerima Disposisi</label>
                      <select
                        value={disposisiTujuan}
                        onChange={(e) => setDisposisiTujuan(e.target.value)}
                        className="w-full bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-xl px-3 py-2"
                      >
                        <option value="Kepala Subbagian Umum & Kepegawaian">Kasubbag Umum & Kepegawaian</option>
                        <option value="Kepala Bidang Perbendaharaan">Kabid Perbendaharaan</option>
                        <option value="Kepala Bidang Akuntansi">Kabid Akuntansi</option>
                        <option value="Analis Perencanaan Anggaran (Siti Aminah)">Pegawai: Siti Aminah</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 dark:text-slate-400">Instruksi Khusus</label>
                      <input
                        type="text"
                        required
                        value={disposisiInstruksi}
                        onChange={(e) => setDisposisiInstruksi(e.target.value)}
                        placeholder="cth: pelajari materi dan buat nota dinas pendukung"
                        className="w-full bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-xl px-3.5 py-2"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Teruskan Delegasi</span>
                    </button>
                  </form>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-slate-400 h-[650px]">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Antrean Surat Kosong</h3>
            <p className="text-[11px] text-slate-400 mt-1">Harap daftarkan atau pilih surat masuk terlebih dahulu.</p>
          </div>
        )}
      </div>

    </div>
  );
};
