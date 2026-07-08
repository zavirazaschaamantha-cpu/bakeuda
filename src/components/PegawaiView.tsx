/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Search, Mail, Phone, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { Pegawai } from '../types';

interface PegawaiViewProps {
  pegawaiList: Pegawai[];
}

export const PegawaiView: React.FC<PegawaiViewProps> = ({ pegawaiList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bidangFilter, setBidangFilter] = useState('');

  const filteredPegawai = pegawaiList.filter(p => {
    const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.nip.includes(searchTerm);
    const matchesBidang = !bidangFilter || p.bidang === bidangFilter;
    return matchesSearch && matchesBidang;
  });

  return (
    <div className="space-y-6 text-xs text-slate-500 font-semibold text-left">
      
      {/* Search Bar & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Direktori Kepegawaian (Staf)
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Daftar Pegawai Badan Keuangan Daerah Kota Pangkalpinang</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 max-w-md w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-slate-100 text-xs"
            />
          </div>

          <select
            value={bidangFilter}
            onChange={(e) => setBidangFilter(e.target.value)}
            className="bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-800 rounded-2xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">Semua Bidang</option>
            <option value="Sekretariat">Sekretariat</option>
            <option value="Perbendaharaan">Perbendaharaan</option>
            <option value="Akuntansi">Akuntansi</option>
            <option value="Aset">Pengelolaan Aset</option>
            <option value="Pajak & Retribusi">Pajak & Retribusi</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPegawai.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-8 rounded-3xl text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <span>Pegawai tidak ditemukan</span>
          </div>
        ) : (
          filteredPegawai.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex gap-4 items-start">
                <img
                  src={p.fotoUrl}
                  alt={p.nama}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/10 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden flex-1 space-y-1">
                  <h4 className="text-slate-800 dark:text-white font-black text-sm truncate leading-snug">{p.nama}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">NIP. {p.nip}</p>
                  <p className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">{p.jabatan}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-gray-850/60 p-3 rounded-2xl border border-slate-100/50 dark:border-gray-800 text-[10px] space-y-1.5 font-medium leading-relaxed">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                  <span className="truncate">{p.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>{p.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Bidang: <strong className="text-slate-700 dark:text-slate-200">{p.bidang}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-gray-850 text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1 text-emerald-500 uppercase">
                  <UserCheck className="w-4 h-4" />
                  Aktif PNS
                </span>
                <span className="font-mono text-slate-300">ID: {p.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
