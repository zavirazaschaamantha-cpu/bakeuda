/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  FileDown,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  FileText,
  AlertCircle
} from 'lucide-react';
import { SuratMasuk, User, Role } from '../types';
import { Modal } from './Modal';

interface SuratMasukViewProps {
  suratList: SuratMasuk[];
  onAddSurat: (surat: Omit<SuratMasuk, 'id' | 'timeline'>) => void;
  onEditSurat: (id: string, updated: Partial<SuratMasuk>) => void;
  onDeleteSurat: (id: string) => void;
  currentUser: User;
  addLog: (aktivitas: 'Tambah Data' | 'Edit Data' | 'Hapus Data' | 'Download Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const SuratMasukView: React.FC<SuratMasukViewProps> = ({
  suratList,
  onAddSurat,
  onEditSurat,
  onDeleteSurat,
  currentUser,
  addLog,
  triggerToast
}) => {
  // Local state for filters, search, pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [prioritasFilter, setPrioritasFilter] = useState('');
  const [sortField, setSortField] = useState<keyof SuratMasuk>('tanggalDiterima');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratMasuk | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields State
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggalSurat, setTanggalSurat] = useState('');
  const [tanggalDiterima, setTanggalDiterima] = useState('');
  const [asalSurat, setAsalSurat] = useState('');
  const [perihal, setPerihal] = useState('');
  const [kategori, setKategori] = useState<'Undangan' | 'Pemberitahuan' | 'Dinas' | 'Lain-lain'>('Dinas');
  const [lampiran, setLampiran] = useState('1 Berkas');
  const [prioritas, setPrioritas] = useState<'Biasa' | 'Penting' | 'Sangat Penting'>('Biasa');
  const [tujuanDisposisi, setTujuanDisposisi] = useState('Belum Ditentukan');
  const [keterangan, setKeterangan] = useState('');
  const [status, setStatus] = useState<SuratMasuk['status']>('Belum Diproses');

  // Permissions
  const canModify = currentUser.role === 'Super Admin' || currentUser.role === 'Admin Sekretariat';
  const isViewOnly = currentUser.role === 'Kepala Badan';

  // Handle opening modal for new surat
  const openNewForm = () => {
    setIsEditing(false);
    setNomorSurat('');
    setTanggalSurat('');
    setTanggalDiterima('');
    setAsalSurat('');
    setPerihal('');
    setKategori('Dinas');
    setLampiran('1 Berkas');
    setPrioritas('Biasa');
    setTujuanDisposisi('Belum Ditentukan');
    setKeterangan('');
    setStatus('Belum Diproses');
    setIsFormOpen(true);
  };

  // Handle opening modal for editing
  const openEditForm = (surat: SuratMasuk) => {
    setIsEditing(true);
    setSelectedSurat(surat);
    setNomorSurat(surat.nomorSurat);
    setTanggalSurat(surat.tanggalSurat);
    setTanggalDiterima(surat.tanggalDiterima);
    setAsalSurat(surat.asalSurat);
    setPerihal(surat.perihal);
    setKategori(surat.kategori);
    setLampiran(surat.lampiran);
    setPrioritas(surat.prioritas);
    setTujuanDisposisi(surat.tujuanDisposisi);
    setKeterangan(surat.keterangan);
    setStatus(surat.status);
    setIsFormOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorSurat || !asalSurat || !perihal) {
      triggerToast('Harap lengkapi field wajib!', 'warning');
      return;
    }

    if (isEditing && selectedSurat) {
      onEditSurat(selectedSurat.id, {
        nomorSurat,
        tanggalSurat,
        tanggalDiterima,
        asalSurat,
        perihal,
        kategori,
        lampiran,
        prioritas,
        tujuanDisposisi,
        keterangan,
        status
      });
      addLog('Edit Data', `Mengubah Surat Masuk: ${nomorSurat}`);
      triggerToast('Surat masuk berhasil diperbarui!', 'success');
    } else {
      onAddSurat({
        nomorSurat,
        tanggalSurat,
        tanggalDiterima,
        asalSurat,
        perihal,
        kategori,
        lampiran,
        prioritas,
        tujuanDisposisi,
        keterangan,
        status
      });
      addLog('Tambah Data', `Menambahkan Surat Masuk baru: ${nomorSurat}`);
      triggerToast('Surat masuk baru berhasil dicatat!', 'success');
    }
    setIsFormOpen(false);
  };

  // Handle Delete Confirmation
  const triggerDelete = (surat: SuratMasuk) => {
    setSelectedSurat(surat);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSurat) {
      onDeleteSurat(selectedSurat.id);
      addLog('Hapus Data', `Menghapus Surat Masuk: ${selectedSurat.nomorSurat}`);
      triggerToast('Surat masuk berhasil dihapus!', 'success');
      setIsDeleteOpen(false);
    }
  };

  // Sorting Handler
  const handleSort = (field: keyof SuratMasuk) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter & Search Logic
  const filteredSurat = suratList.filter((item) => {
    const matchesSearch =
      item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asalSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKategori = !kategoriFilter || item.kategori === kategoriFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesPrioritas = !prioritasFilter || item.prioritas === prioritasFilter;

    // Pegawai only sees letters assigned or targeted to them
    if (currentUser.role === 'Pegawai') {
      return matchesSearch && matchesKategori && matchesStatus && matchesPrioritas &&
        (item.tujuanDisposisi.includes('Pegawai') || item.tujuanDisposisi.includes(currentUser.name));
    }

    return matchesSearch && matchesKategori && matchesStatus && matchesPrioritas;
  });

  // Sorting logic
  const sortedSurat = [...filteredSurat].sort((a, b) => {
    const valA = a[sortField] ?? '';
    const valB = b[sortField] ?? '';
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const totalItems = sortedSurat.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSurat = sortedSurat.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Export CSV/Excel simulation
  const exportExcel = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,Nomor Surat,Tanggal Surat,Asal Surat,Perihal,Kategori,Prioritas,Status\n';

    sortedSurat.forEach((s, idx) => {
      csvContent += `${idx + 1},"${s.nomorSurat}","${s.tanggalSurat}","${s.asalSurat}","${s.perihal}","${s.kategori}","${s.prioritas}","${s.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SODS_Surat_Masuk_Bakeuda_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog('Download Data', 'Mengekspor data Surat Masuk ke CSV/Excel.');
    triggerToast('Laporan berhasil diunduh ke Excel!', 'success');
  };

  // Export PDF / Print trigger
  const triggerPrint = () => {
    window.print();
    addLog('Download Data', 'Mencetak laporan Surat Masuk.');
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor, asal, perihal surat..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-slate-100 transition-all"
          />
        </div>
        
        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-gray-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel</span>
          </button>
          
          <button
            onClick={triggerPrint}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-gray-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Cetak</span>
          </button>

          {canModify && (
            <button
              onClick={openNewForm}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white border border-yellow-400/80 rounded-2xl text-xs font-extrabold shadow-md shadow-yellow-400/10 transition-all"
            >
              <Plus className="w-4 h-4 text-yellow-400" />
              <span>Registrasi Surat</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-gray-850 border border-slate-100 dark:border-gray-800/80 p-4 rounded-3xl">
        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Filter Kategori</label>
          <select
            value={kategoriFilter}
            onChange={(e) => { setKategoriFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-2xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">Semua Kategori</option>
            <option value="Dinas">Dinas</option>
            <option value="Undangan">Undangan</option>
            <option value="Pemberitahuan">Pemberitahuan</option>
            <option value="Lain-lain">Lain-lain</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Filter Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-2xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="Belum Diproses">Belum Diproses</option>
            <option value="Sedang Diproses">Sedang Diproses</option>
            <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Filter Prioritas</label>
          <select
            value={prioritasFilter}
            onChange={(e) => { setPrioritasFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-2xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">Semua Prioritas</option>
            <option value="Biasa">Biasa</option>
            <option value="Penting">Penting</option>
            <option value="Sangat Penting">Sangat Penting</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-850 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-gray-800">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => handleSort('nomorSurat')}>
                  <div className="flex items-center gap-1.5">
                    Nomor & Tanggal Surat
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-blue-600" onClick={() => handleSort('asalSurat')}>
                  <div className="flex items-center gap-1.5">
                    Asal Surat
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 max-w-xs">Perihal</th>
                <th className="p-4 text-center">Prioritas</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80 font-medium text-slate-700 dark:text-slate-300">
              {paginatedSurat.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-300" />
                      <span>Data Surat Masuk tidak ditemukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSurat.map((surat, index) => (
                  <tr key={surat.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-850/20 transition-all">
                    <td className="p-4 text-center text-slate-400 font-mono">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100">{surat.nomorSurat}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">Surat: {surat.tanggalSurat} | Terima: {surat.tanggalDiterima}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{surat.asalSurat}</span>
                      <span className="block text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 font-bold uppercase">{surat.kategori}</span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-300">{surat.perihal}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        surat.prioritas === 'Sangat Penting' ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300' :
                        surat.prioritas === 'Penting' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {surat.prioritas}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        surat.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' :
                        surat.status === 'Menunggu Persetujuan' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300' :
                        surat.status === 'Sedang Diproses' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300'
                      }`}>
                        {surat.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedSurat(surat); setIsPreviewOpen(true); }}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-blue-600"
                          title="Preview Surat PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {canModify && !isViewOnly && (
                          <>
                            <button
                              onClick={() => openEditForm(surat)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-amber-600"
                              title="Edit Surat"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => triggerDelete(surat)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-red-600"
                              title="Hapus Surat"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-slate-500 font-semibold text-xs">
            <span>Menampilkan {paginatedSurat.length} dari {totalItems} surat</span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-100 dark:border-gray-800 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono">{currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-100 dark:border-gray-800 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL FORM */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={isEditing ? 'Ubah Registrasi Surat Masuk' : 'Registrasi Surat Masuk Baru'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Nomor Surat <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                placeholder="cth: 005/12/BAKEUDA/2026"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Asal Surat <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={asalSurat}
                onChange={(e) => setAsalSurat(e.target.value)}
                placeholder="cth: BPK Perwakilan Bangka Belitung"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Tanggal Surat</label>
              <input
                type="date"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Tanggal Diterima</label>
              <input
                type="date"
                value={tanggalDiterima}
                onChange={(e) => setTanggalDiterima(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Perihal Surat <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={3}
                value={perihal}
                onChange={(e) => setPerihal(e.target.value)}
                placeholder="Perihal surat secara detail..."
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              >
                <option value="Dinas">Dinas</option>
                <option value="Undangan">Undangan</option>
                <option value="Pemberitahuan">Pemberitahuan</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Prioritas</label>
              <select
                value={prioritas}
                onChange={(e) => setPrioritas(e.target.value as any)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              >
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Sangat Penting">Sangat Penting</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Lampiran</label>
              <input
                type="text"
                value={lampiran}
                onChange={(e) => setLampiran(e.target.value)}
                placeholder="Cth: 1 Berkas / Tanpa Lampiran"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Tujuan Disposisi Awal</label>
              <input
                type="text"
                value={tujuanDisposisi}
                onChange={(e) => setTujuanDisposisi(e.target.value)}
                placeholder="cth: Kepala Badan / Kepala Subbagian"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {isEditing && (
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Status Proses</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
                >
                  <option value="Belum Diproses">Belum Diproses</option>
                  <option value="Sedang Diproses">Sedang Diproses</option>
                  <option value="Menunggu Persetujuan">Menunggu Persetujuan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            )}

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Catatan / Keterangan</label>
              <textarea
                rows={2}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Catatan tambahan untuk disposisi..."
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Upload Lampiran PDF (Simulasi)</label>
              <div className="border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-500">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <span className="block text-[11px] font-bold text-slate-500 mt-2">Pilih file PDF atau seret ke sini</span>
                <span className="block text-[10px] text-slate-400 mt-1">Ukuran Maksimal 10 MB</span>
              </div>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white border border-yellow-400/80 rounded-xl text-xs font-extrabold shadow-md transition-all"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL CONFIRMATION */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Hapus Surat Masuk" size="sm">
        <div className="space-y-4 text-xs">
          <p className="text-slate-500 leading-relaxed font-semibold">
            Apakah Anda yakin ingin menghapus data Surat Masuk dengan nomor <strong className="text-slate-800 dark:text-white font-black">{selectedSurat?.nomorSurat}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex justify-end gap-2.5 pt-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-gray-700 text-slate-500 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>

      {/* PDF ATTACHMENT PREVIEW MODAL */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Preview PDF: ${selectedSurat?.nomorSurat}`}
        size="lg"
      >
        <div className="bg-slate-50 dark:bg-gray-950 p-6 rounded-2xl border border-slate-150 dark:border-gray-800 font-serif text-slate-800 dark:text-slate-200 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Government Letter Head */}
          <div className="text-center border-b-4 border-double border-slate-800 pb-4 relative flex flex-col items-center">
            <span className="font-bold text-xs uppercase tracking-wider block">PEMERINTAH KOTA PANGKALPINANG</span>
            <span className="font-extrabold text-lg uppercase block tracking-wide mt-1">BADAN KEUANGAN DAERAH</span>
            <span className="text-[10px] font-sans text-slate-500 block leading-normal mt-1">
              Jl. Merdeka No. 4, Pangkalpinang, Prov. Kepulauan Bangka Belitung 33111 <br/>
              Telepon (0717) 421255 | Email: bakeuda@pangkalpinangkota.go.id
            </span>
          </div>

          <div className="text-xs space-y-4 font-sans leading-relaxed">
            <div className="flex justify-between font-mono">
              <div>
                <p>Nomor : {selectedSurat?.nomorSurat}</p>
                <p>Sifat &nbsp;&nbsp;&nbsp;: {selectedSurat?.prioritas}</p>
                <p>Lamp &nbsp;&nbsp;: {selectedSurat?.lampiran}</p>
                <p>Hal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {selectedSurat?.perihal}</p>
              </div>
              <div className="text-right">
                <p>Pangkalpinang, {selectedSurat?.tanggalSurat}</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="font-bold text-slate-700 dark:text-slate-300">Kepada Yth :</p>
              <p className="font-extrabold mt-1">{selectedSurat?.asalSurat}</p>
              <p>Di - Pangkalpinang</p>
            </div>

            <div className="pt-4 space-y-3 font-serif">
              <p className="indent-8 text-justify">
                Dengan hormat, sehubungan dengan urusan administrasi pemerintahan daerah, kami menyampaikan berkas permohonan koordinasi ini untuk ditindaklanjuti secara resmi di lingkungan instansi Badan Keuangan Daerah Kota Pangkalpinang.
              </p>
              <p className="indent-8 text-justify">
                Adapun perihal inti yang kami sampaikan adalah mengenai <strong>{selectedSurat?.perihal}</strong>. Harap dikoordinasikan dengan bidang-bidang teknis terkait guna penyusunan kelengkapan laporan keuangan dan tata usaha yang dipersyaratkan.
              </p>
              <p className="indent-8 text-justify">
                Demikian penyampaian surat ini, atas perhatian dan kerjasama bapak/ibu pimpinan, kami ucapkan terima kasih.
              </p>
            </div>

            {/* Official Signature */}
            <div className="flex justify-end pt-10 font-sans">
              <div className="text-center w-64 space-y-12">
                <div>
                  <p className="font-semibold">KEPALA INSTANSI</p>
                  <p className="text-[10px] text-slate-400">Tanda Tangan Elektronik (TTE)</p>
                </div>
                <div className="border-t border-slate-300 pt-1">
                  <p className="font-extrabold text-slate-800 dark:text-white">Dr. Budiyanto, M.Si.</p>
                  <p className="text-[10px] text-slate-400 font-mono">NIP. 197103151996031002</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-gray-800 mt-4 text-xs">
          <span className="text-slate-400 font-mono text-[10px]">Dokumen Terverifikasi Digital</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold"
            >
              Tutup
            </button>
            <a
              href="data:application/pdf;base64,JVBERi0xLjQKJ..."
              download={`DRAFT_${selectedSurat?.id}.pdf`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5"
              onClick={() => addLog('Download Data', `Mengunduh PDF Surat: ${selectedSurat?.nomorSurat}`)}
            >
              <FileDown className="w-4 h-4" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </Modal>

    </div>
  );
};
