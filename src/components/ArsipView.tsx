/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  Tag,
  Clock,
  ChevronRight,
  Upload,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Arsip, User } from '../types';
import { Modal } from './Modal';

interface ArsipViewProps {
  arsipList: Arsip[];
  onUploadArsip: (arsip: Omit<Arsip, 'id' | 'riwayat'>) => void;
  onDeleteArsip: (id: string) => void;
  currentUser: User;
  addLog: (aktivitas: 'Tambah Data' | 'Hapus Data' | 'Download Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const ArsipView: React.FC<ArsipViewProps> = ({
  arsipList,
  onUploadArsip,
  onDeleteArsip,
  currentUser,
  addLog,
  triggerToast
}) => {
  const [activeFolder, setActiveFolder] = useState<'Semua' | 'Surat' | 'SK & Peraturan' | 'Keuangan' | 'Umum'>('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Arsip | null>(null);

  // Form Field State
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<'Surat Masuk' | 'Surat Keluar' | 'SK Kepala Badan' | 'Undangan' | 'Laporan Keuangan'>('Surat Masuk');
  const [tagInput, setTagInput] = useState('');
  const [folder, setFolder] = useState<'Surat' | 'SK & Peraturan' | 'Keuangan' | 'Umum'>('Surat');

  const canModify = currentUser.role === 'Super Admin' || currentUser.role === 'Admin Sekretariat';

  // Folders list
  const folders = [
    { name: 'Semua', count: arsipList.length },
    { name: 'Surat', count: arsipList.filter(a => a.folder === 'Surat').length },
    { name: 'SK & Peraturan', count: arsipList.filter(a => a.folder === 'SK & Peraturan').length },
    { name: 'Keuangan', count: arsipList.filter(a => a.folder === 'Keuangan').length },
    { name: 'Umum', count: arsipList.filter(a => a.folder === 'Umum').length }
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) {
      triggerToast('Harap masukkan nama file!', 'warning');
      return;
    }

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    onUploadArsip({
      nama: nama.endsWith('.pdf') ? nama : `${nama}.pdf`,
      kategori,
      tag: tags,
      tanggalUpload: new Date().toISOString().slice(0, 10),
      ukuran: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      tipeFile: 'pdf',
      folder
    });

    addLog('Tambah Data', `Mengunggah dokumen arsip digital: ${nama}`);
    triggerToast('Dokumen baru berhasil diarsipkan!', 'success');
    setIsUploadOpen(false);

    // reset Form
    setNama('');
    setTagInput('');
  };

  const handleDelete = (id: string, fileName: string) => {
    onDeleteArsip(id);
    addLog('Hapus Data', `Menghapus dokumen arsip: ${fileName}`);
    triggerToast('Dokumen berhasil dihapus dari arsip!', 'success');
    setIsDetailOpen(false);
  };

  const handleDownload = (file: Arsip) => {
    // Simulate Download
    const text = `Simulasi unduhan berkas ${file.nama}.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.nama;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update history
    file.riwayat.unshift(`Diunduh oleh ${currentUser.name} (${currentUser.role}) pada ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`);
    addLog('Download Data', `Mengunduh berkas arsip: ${file.nama}`);
    triggerToast('Berkas berhasil diunduh!', 'success');
  };

  const filteredArsip = arsipList.filter(file => {
    const matchesSearch = file.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.tag.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFolder = activeFolder === 'Semua' || file.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-semibold text-slate-500">
      
      {/* Left panel: Folders Directory sidebar */}
      <div className="md:col-span-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-50 dark:border-gray-850 pb-3">
          Arsip Direktori
        </h3>
        
        <div className="space-y-1">
          {folders.map((f) => (
            <button
              key={f.name}
              onClick={() => setActiveFolder(f.name as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                activeFolder === f.name
                  ? 'bg-blue-50 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400 font-bold'
                  : 'hover:bg-slate-50 text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {activeFolder === f.name ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-slate-400" />}
                <span className="truncate">{f.name}</span>
              </div>
              <span className="bg-slate-100 dark:bg-gray-800 text-[10px] font-mono px-2 py-0.5 rounded-full">{f.count}</span>
            </button>
          ))}
        </div>

        {canModify && (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Arsip</span>
          </button>
        )}
      </div>

      {/* Right panel: File grid and list search */}
      <div className="md:col-span-3 space-y-4">
        
        {/* Search header bar */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-4 rounded-3xl shadow-sm flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari arsip berdasarkan nama file atau tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-slate-100 transition-all text-xs"
            />
          </div>
        </div>

        {/* Files Grid list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArsip.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 text-center text-slate-400 flex flex-col items-center justify-center h-48">
              <Folder className="w-10 h-10 text-slate-200 mb-2" />
              <span>Tidak ada dokumen yang diarsipkan di folder ini</span>
            </div>
          ) : (
            filteredArsip.map((file) => (
              <div
                key={file.id}
                onClick={() => { setSelectedFile(file); setIsDetailOpen(true); }}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between space-y-3 text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors" title={file.nama}>{file.nama}</h4>
                    <span className="text-[10px] text-slate-400 block mt-1 uppercase font-bold">{file.kategori}</span>
                  </div>
                </div>

                {/* Tags block */}
                <div className="flex flex-wrap gap-1">
                  {file.tag.map((t, idx) => (
                    <span key={idx} className="bg-slate-50 dark:bg-gray-850 border border-slate-100 dark:border-gray-800 text-[9px] text-slate-400 font-bold px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2.5 border-t border-slate-50 dark:border-gray-850">
                  <span className="font-mono">{file.ukuran}</span>
                  <span className="font-mono">{file.tanggalUpload}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* UPLOAD FILE MODAL */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Arsipkan Berkas Baru" size="md">
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Nama File / Dokumen <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Cth: Laporan_Aset_Semester_1"
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Kategori File</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5"
              >
                <option value="Surat Masuk">Surat Masuk</option>
                <option value="Surat Keluar">Surat Keluar</option>
                <option value="SK Kepala Badan">SK Kepala Badan</option>
                <option value="Undangan">Undangan</option>
                <option value="Laporan Keuangan">Laporan Keuangan</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Folder Direktori</label>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value as any)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5"
              >
                <option value="Surat">Surat</option>
                <option value="SK & Peraturan">SK & Peraturan</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Tag / Keyword (Dipisahkan koma)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Cth: 2026, LKPD, BPK, Urgent"
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Unggah Berkas PDF/DOCX (Drag & Drop)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500">
              <Upload className="w-8 h-8 text-slate-300 mx-auto" />
              <span className="block text-[11px] font-bold text-slate-500 mt-2">Pilih file atau seret file Anda ke sini</span>
              <span className="block text-[10px] text-slate-400 mt-1">Hanya file PDF, DOCX, XLSX (Maksimal 15 MB)</span>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Mulai Arsipkan
            </button>
          </div>
        </form>
      </Modal>

      {/* FILE DETAILS & HISTORY MODAL */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Detail & Riwayat Arsip Digital" size="md">
        {selectedFile && (
          <div className="space-y-4 text-xs font-semibold text-slate-500">
            <div className="flex gap-4 border-b border-slate-50 dark:border-gray-850 pb-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl shrink-0 h-14 w-14 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className="text-base font-extrabold text-slate-800 dark:text-white leading-normal">{selectedFile.nama}</h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Kategori: {selectedFile.kategori} | Folder: {selectedFile.folder}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 text-[11px] text-slate-600 dark:text-slate-400 border-b border-slate-50 dark:border-gray-850/50">
              <p>Diunggah Pada: <strong className="text-slate-800 dark:text-white font-bold">{selectedFile.tanggalUpload}</strong></p>
              <p>Ukuran File: <strong className="text-slate-800 dark:text-white font-bold">{selectedFile.ukuran}</strong></p>
            </div>

            {/* Riwayat Logs */}
            <div className="space-y-2">
              <h5 className="font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide text-[10px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Riwayat Akses Dokumen
              </h5>
              <div className="bg-slate-50 dark:bg-gray-950 border border-slate-100 dark:border-gray-800 rounded-2xl p-3.5 space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
                {selectedFile.riwayat.map((log, idx) => (
                  <p key={idx} className="text-[10px] text-slate-500 dark:text-slate-400 border-l border-blue-500 pl-2 leading-relaxed">
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* Actions button */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-gray-800/80">
              {canModify ? (
                <button
                  onClick={() => handleDelete(selectedFile.id, selectedFile.nama)}
                  className="px-3.5 py-2 hover:bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-1"
                  title="Hapus berkas"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              ) : <div />}

              <div className="flex gap-2">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-gray-700 text-slate-500 rounded-xl font-bold"
                >
                  Tutup
                </button>
                <button
                  onClick={() => handleDownload(selectedFile)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
