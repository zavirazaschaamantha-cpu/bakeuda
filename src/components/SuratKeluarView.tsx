/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowUpDown,
  FileText,
  AlertCircle
} from 'lucide-react';
import { SuratKeluar, User } from '../types';
import { Modal } from './Modal';

interface SuratKeluarViewProps {
  suratList: SuratKeluar[];
  onAddSurat: (surat: Omit<SuratKeluar, 'id'>) => void;
  onEditSurat: (id: string, updated: Partial<SuratKeluar>) => void;
  onDeleteSurat: (id: string) => void;
  currentUser: User;
  addLog: (aktivitas: 'Tambah Data' | 'Edit Data' | 'Hapus Data' | 'Download Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const SuratKeluarView: React.FC<SuratKeluarViewProps> = ({
  suratList,
  onAddSurat,
  onEditSurat,
  onDeleteSurat,
  currentUser,
  addLog,
  triggerToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<SuratKeluar | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields State
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [perihal, setPerihal] = useState('');
  const [kategori, setKategori] = useState<'Undangan' | 'Pemberitahuan' | 'Dinas' | 'Lain-lain'>('Dinas');
  const [lampiran, setLampiran] = useState('1 Lembar');
  const [status, setStatus] = useState<SuratKeluar['status']>('Draf');
  const [penanggungJawab, setPenanggungJawab] = useState('');

  const canModify = currentUser.role === 'Super Admin' || currentUser.role === 'Admin Sekretariat';

  const openNewForm = () => {
    setIsEditing(false);
    setNomorSurat(`900/${Math.floor(Math.random() * 200) + 220}/BAKEUDA/2026`);
    setTanggal(new Date().toISOString().slice(0, 10));
    setTujuan('');
    setPerihal('');
    setKategori('Dinas');
    setLampiran('1 Lembar');
    setStatus('Draf');
    setPenanggungJawab('Dr. Budiyanto, M.Si.');
    setIsFormOpen(true);
  };

  const openEditForm = (surat: SuratKeluar) => {
    setIsEditing(true);
    setSelectedSurat(surat);
    setNomorSurat(surat.nomorSurat);
    setTanggal(surat.tanggal);
    setTujuan(surat.tujuan);
    setPerihal(surat.perihal);
    setKategori(surat.kategori);
    setLampiran(surat.lampiran);
    setStatus(surat.status);
    setPenanggungJawab(surat.penanggungJawab);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomorSurat || !tujuan || !perihal) {
      triggerToast('Harap isi nomor, tujuan, dan perihal!', 'warning');
      return;
    }

    if (isEditing && selectedSurat) {
      onEditSurat(selectedSurat.id, {
        nomorSurat,
        tanggal,
        tujuan,
        perihal,
        kategori,
        lampiran,
        status,
        penanggungJawab
      });
      addLog('Edit Data', `Mengubah Surat Keluar: ${nomorSurat}`);
      triggerToast('Surat keluar diperbarui!', 'success');
    } else {
      onAddSurat({
        nomorSurat,
        tanggal,
        tujuan,
        perihal,
        kategori,
        lampiran,
        status,
        penanggungJawab
      });
      addLog('Tambah Data', `Merekam Surat Keluar baru: ${nomorSurat}`);
      triggerToast('Surat keluar baru berhasil direkam!', 'success');
    }
    setIsFormOpen(false);
  };

  const triggerDelete = (surat: SuratKeluar) => {
    setSelectedSurat(surat);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSurat) {
      onDeleteSurat(selectedSurat.id);
      addLog('Hapus Data', `Menghapus Surat Keluar: ${selectedSurat.nomorSurat}`);
      triggerToast('Surat keluar berhasil dihapus!', 'success');
      setIsDeleteOpen(false);
    }
  };

  const filteredSurat = suratList.filter((item) => {
    const matchesSearch =
      item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tujuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredSurat.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSurat = filteredSurat.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportExcel = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,Nomor Surat,Tanggal,Tujuan,Perihal,Kategori,Status,Penanggung Jawab\n';

    filteredSurat.forEach((s, idx) => {
      csvContent += `${idx + 1},"${s.nomorSurat}","${s.tanggal}","${s.tujuan}","${s.perihal}","${s.kategori}","${s.status}","${s.penanggungJawab}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SODS_Surat_Keluar_Bakeuda_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addLog('Download Data', 'Mengekspor data Surat Keluar ke CSV/Excel.');
    triggerToast('Laporan berhasil diunduh ke Excel!', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor, tujuan, perihal..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-slate-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-2xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="Draf">Draf</option>
            <option value="Sedang Ditinjau">Sedang Ditinjau</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Terkirim">Terkirim</option>
          </select>

          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-gray-700 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel</span>
          </button>

          {canModify && (
            <button
              onClick={openNewForm}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] hover:bg-blue-800 text-white border border-yellow-400/80 rounded-2xl font-extrabold shadow-md shadow-yellow-400/10 transition-all"
            >
              <Plus className="w-4 h-4 text-yellow-400" />
              <span>Registrasi Outgoing</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Outgoing */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-850 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-gray-800">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Nomor & Tanggal</th>
                <th className="p-4">Tujuan Surat</th>
                <th className="p-4 max-w-xs">Perihal</th>
                <th className="p-4">Penanggung Jawab</th>
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
                      <span>Data Surat Keluar tidak ditemukan</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSurat.map((surat, index) => (
                  <tr key={surat.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-850/20 transition-all">
                    <td className="p-4 text-center text-slate-400 font-mono">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100">{surat.nomorSurat}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">Tanggal: {surat.tanggal}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{surat.tujuan}</span>
                      <span className="block text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 font-bold uppercase">{surat.kategori}</span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-300">{surat.perihal}</p>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{surat.penanggungJawab}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        surat.status === 'Terkirim' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' :
                        surat.status === 'Disetujui' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300' :
                        surat.status === 'Sedang Ditinjau' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {surat.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => { setSelectedSurat(surat); setIsPreviewOpen(true); }}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-blue-600"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {canModify && (
                          <>
                            <button
                              onClick={() => openEditForm(surat)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-amber-600"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => triggerDelete(surat)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-red-600"
                              title="Hapus"
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

      {/* CREATE / EDIT FORM MODAL */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={isEditing ? 'Ubah Surat Keluar' : 'Registrasi Surat Keluar Baru'} size="lg">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Nomor Surat Keluar <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Tanggal Pengiriman <span className="text-red-500">*</span></label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Tujuan Surat (Penerima) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Yth. Kepala Dinas Pekerjaan Umum Kota Pangkalpinang"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300">Perihal <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={3}
                value={perihal}
                onChange={(e) => setPerihal(e.target.value)}
                placeholder="Perihal surat keluar..."
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
              <label className="font-bold text-slate-700 dark:text-slate-300">Lampiran</label>
              <input
                type="text"
                value={lampiran}
                onChange={(e) => setLampiran(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Penanggung Jawab / Penandatangan</label>
              <input
                type="text"
                value={penanggungJawab}
                onChange={(e) => setPenanggungJawab(e.target.value)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Status Alur Dokumen</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200"
              >
                <option value="Draf">Draf</option>
                <option value="Sedang Ditinjau">Sedang Ditinjau</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Terkirim">Terkirim</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white border border-yellow-400/80 rounded-xl font-extrabold shadow-md transition-all"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Hapus Surat Keluar" size="sm">
        <div className="space-y-4 text-xs font-semibold text-slate-500">
          <p>
            Yakin ingin menghapus Surat Keluar dengan nomor <strong className="text-slate-800 dark:text-white font-black">{selectedSurat?.nomorSurat}</strong>?
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
              Hapus
            </button>
          </div>
        </div>
      </Modal>

      {/* PREVIEW OUTGOING MODAL */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title={`Preview Dokumen Keluar: ${selectedSurat?.nomorSurat}`} size="lg">
        <div className="bg-slate-50 dark:bg-gray-950 p-6 rounded-2xl border border-slate-150 dark:border-gray-800 font-serif text-slate-800 dark:text-slate-200 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center border-b-4 border-double border-slate-800 pb-4 relative flex flex-col items-center">
            <span className="font-bold text-xs uppercase tracking-wider block">PEMERINTAH KOTA PANGKALPINANG</span>
            <span className="font-extrabold text-lg uppercase block tracking-wide mt-1">BADAN KEUANGAN DAERAH</span>
            <span className="text-[10px] font-sans text-slate-400 block leading-normal mt-1">
              Jl. Merdeka No. 4, Pangkalpinang, Prov. Kepulauan Bangka Belitung 33111 <br/>
              Telepon (0717) 421255 | Email: bakeuda@pangkalpinangkota.go.id
            </span>
          </div>

          <div className="text-xs space-y-4 font-sans leading-relaxed">
            <div className="flex justify-between font-mono">
              <div>
                <p>Nomor : {selectedSurat?.nomorSurat}</p>
                <p>Sifat &nbsp;&nbsp;&nbsp;: Segera / Biasa</p>
                <p>Hal &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {selectedSurat?.perihal}</p>
              </div>
              <div className="text-right">
                <p>Pangkalpinang, {selectedSurat?.tanggal}</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="font-bold text-slate-700">Kepada Yth :</p>
              <p className="font-extrabold mt-1">{selectedSurat?.tujuan}</p>
              <p>Di - Tempat</p>
            </div>

            <div className="pt-4 space-y-3 font-serif">
              <p className="indent-8 text-justify">
                Dengan ini disampaikan laporan dan rincian administratif instansi mengenai <strong>{selectedSurat?.perihal}</strong>. Kelengkapan data ini disusun berdasarkan keputusan resmi pimpinan Sekretariat Badan Keuangan Daerah Kota Pangkalpinang.
              </p>
              <p className="indent-8 text-justify">
                Demikian penyampaian rincian surat keluar ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.
              </p>
            </div>

            <div className="flex justify-end pt-10 font-sans">
              <div className="text-center w-64 space-y-12">
                <div>
                  <p className="font-semibold">PENANGGUNG JAWAB</p>
                  <p className="text-[10px] text-slate-400">Tandatangan Elektronik Resmi</p>
                </div>
                <div className="border-t border-slate-300 pt-1">
                  <p className="font-extrabold text-slate-800 dark:text-white">{selectedSurat?.penanggungJawab}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Badan Keuangan Daerah Kota Pangkalpinang</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 text-xs">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="px-4 py-2 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold"
          >
            Tutup
          </button>
        </div>
      </Modal>

    </div>
  );
};
