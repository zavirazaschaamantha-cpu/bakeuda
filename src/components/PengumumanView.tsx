/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Calendar, FileText, AlertCircle } from 'lucide-react';
import { Pengumuman, User } from '../types';
import { Modal } from './Modal';

interface PengumumanViewProps {
  pengumumanList: Pengumuman[];
  onAddPengumuman: (p: Omit<Pengumuman, 'id' | 'tanggal'>) => void;
  onDeletePengumuman: (id: string) => void;
  currentUser: User;
  addLog: (aktivitas: 'Tambah Data' | 'Hapus Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const PengumumanView: React.FC<PengumumanViewProps> = ({
  pengumumanList,
  onAddPengumuman,
  onDeletePengumuman,
  currentUser,
  addLog,
  triggerToast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [lampiran, setLampiran] = useState('');

  const canModify = currentUser.role === 'Super Admin' || currentUser.role === 'Admin Sekretariat';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !isi) {
      triggerToast('Judul dan isi pengumuman wajib diisi!', 'warning');
      return;
    }

    onAddPengumuman({
      judul,
      isi,
      lampiran: lampiran || undefined,
      status: 'Aktif'
    });

    addLog('Tambah Data', `Mempublikasikan Pengumuman Baru: ${judul}`);
    triggerToast('Pengumuman baru berhasil diterbitkan!', 'success');
    setIsOpen(false);
    setJudul('');
    setIsi('');
    setLampiran('');
  };

  const handleDelete = (id: string, name: string) => {
    onDeletePengumuman(id);
    addLog('Hapus Data', `Menghapus pengumuman: ${name}`);
    triggerToast('Pengumuman telah diarsipkan/dihapus!', 'success');
  };

  return (
    <div className="space-y-6 text-xs text-slate-500 font-semibold text-left">
      
      {/* Header bar */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Papan Pengumuman & Informasi
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Berita & Edaran Resmi Badan Keuangan Daerah Kota Pangkalpinang</p>
          </div>
        </div>

        {canModify && (
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/15"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Informasi</span>
          </button>
        )}
      </div>

      {/* Announcements Board list */}
      <div className="space-y-4">
        {pengumumanList.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-8 text-center rounded-3xl">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <span>Tidak ada pengumuman aktif</span>
          </div>
        ) : (
          pengumumanList.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 border border-slate-150 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white leading-normal uppercase">{p.judul}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Diterbitkan: {p.tanggal}
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 px-2 py-0.5 rounded font-bold">
                      Aktif
                    </span>
                  </div>
                </div>

                {canModify && (
                  <button
                    onClick={() => handleDelete(p.id, p.judul)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                    title="Hapus Informasi"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed indent-4 text-justify">
                {p.isi}
              </p>

              {p.lampiran && (
                <div className="pt-3 border-t border-slate-50 dark:border-gray-850/80 flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                    <FileText className="w-4 h-4" />
                    Lampiran: {p.lampiran}
                  </span>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); triggerToast('Simulasi mengunduh lampiran pengumuman!', 'info'); }}
                    className="hover:underline hover:text-blue-700 font-bold uppercase tracking-wider"
                  >
                    Download Lampiran
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* CREATE POPUP */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Penerbitan Pengumuman Baru" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Judul Pengumuman <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Cth: Pemberitahuan Pemeliharaan Server SIPD RI"
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Isi Informasi <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={5}
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder="Tulis pesan pengumuman resmi instansi di sini..."
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 leading-relaxed font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Nama Lampiran File (Opsional)</label>
            <input
              type="text"
              value={lampiran}
              onChange={(e) => setLampiran(e.target.value)}
              placeholder="Cth: Surat_Edaran_Absensi.pdf"
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10"
            >
              Terbitkan Berita
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
