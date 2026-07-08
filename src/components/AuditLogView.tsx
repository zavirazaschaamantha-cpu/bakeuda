/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileCheck2, Info, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogViewProps {
  auditLogs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-6 text-xs text-slate-500 font-semibold text-left">
      
      {/* Overview header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Log Audit Keamanan Sistem (Audit Trail)
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Catatan seluruh aktivitas dan interaksi operator dengan basis data SODS</p>
          </div>
        </div>

        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Logger Aktif
        </div>
      </div>

      {/* Audit table logs */}
      <div className="bg-white dark:bg-gray-900 border border-slate-150 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-850 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-gray-800">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Tanggal & Waktu</th>
                <th className="p-4">Pengguna (Operator)</th>
                <th className="p-4">Hak Akses</th>
                <th className="p-4">Aktivitas</th>
                <th className="p-4 max-w-xs">Detail Deskripsi Operasi</th>
                <th className="p-4 text-center">Alamat IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80 font-medium text-slate-700 dark:text-slate-300">
              {auditLogs.map((log, idx) => (
                <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-4 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{log.userName}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 dark:bg-gray-850 px-2.5 py-0.5 rounded text-[10px] font-bold">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      log.aktivitas === 'Login' ? 'bg-blue-50 text-blue-600' :
                      log.aktivitas === 'Tambah Data' ? 'bg-emerald-50 text-emerald-600' :
                      log.aktivitas === 'Edit Data' ? 'bg-amber-50 text-amber-600' :
                      log.aktivitas === 'Hapus Data' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {log.aktivitas}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {log.detail}
                  </td>
                  <td className="p-4 text-center font-mono text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
