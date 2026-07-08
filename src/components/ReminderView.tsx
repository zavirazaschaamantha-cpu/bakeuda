/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BellRing, Clock, AlertTriangle, CheckCircle, Flame, CalendarRange } from 'lucide-react';
import { Reminder } from '../types';

interface ReminderViewProps {
  reminders: Reminder[];
  onCompleteReminder: (id: string) => void;
}

export const ReminderView: React.FC<ReminderViewProps> = ({ reminders, onCompleteReminder }) => {
  const getStatusBadge = (status: Reminder['status']) => {
    switch (status) {
      case 'Aktif': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20';
      case 'Selesai': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20';
      case 'Melewati Batas': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20';
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-500 font-semibold">
      
      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-white dark:bg-gray-900 p-4 border border-slate-100 dark:border-gray-800 rounded-3xl shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-2xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Terlewat Deadline</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-1 block">
              {reminders.filter(r => r.status === 'Melewati Batas').length} Dokumen
            </span>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3 border-l border-r border-slate-50 dark:border-gray-800">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Reminder Aktif</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-1 block">
              {reminders.filter(r => r.status === 'Aktif').length} Tersisa
            </span>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Diselesaikan</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-1 block">
              {reminders.filter(r => r.status === 'Selesai').length} Berkas
            </span>
          </div>
        </div>
      </div>

      {/* Main Reminders list */}
      <div className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-3xl p-5 shadow-sm">
        <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-gray-850 pb-3 mb-4 uppercase tracking-wide flex items-center gap-2">
          <BellRing className="w-5 h-5 text-blue-500" />
          Daftar Pengingat Batas Waktu
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 border rounded-2xl flex flex-col justify-between transition-all space-y-4 text-left ${
                rem.status === 'Melewati Batas'
                  ? 'border-red-100 bg-red-50/10 dark:border-red-950/50'
                  : 'border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900'
              }`}
            >
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{rem.tipe}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase border ${getStatusBadge(rem.status)}`}>
                    {rem.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-2">{rem.referensiJudul}</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed text-[11px] font-medium">{rem.deskripsi}</p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 dark:border-gray-850 pt-3 text-[10px]">
                <span className="text-red-500 dark:text-red-400 font-bold flex items-center gap-1">
                  <CalendarRange className="w-4 h-4" />
                  Deadline: {rem.tanggalDeadline}
                </span>

                {rem.status === 'Aktif' && (
                  <button
                    onClick={() => onCompleteReminder(rem.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md shadow-emerald-500/10 transition-colors"
                  >
                    Tandai Selesai
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
