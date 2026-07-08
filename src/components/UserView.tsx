/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, ShieldAlert, Plus, Edit, Lock, Key, AlertCircle } from 'lucide-react';
import { User, Role } from '../types';
import { Modal } from './Modal';

interface UserViewProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onEditUser: (id: string, fields: Partial<User>) => void;
  currentUser: User;
  addLog: (aktivitas: 'Tambah Data' | 'Edit Data', detail: string) => void;
  triggerToast: (text: string, type: 'success' | 'warning' | 'danger' | 'info') => void;
}

export const UserView: React.FC<UserViewProps> = ({
  users,
  onAddUser,
  onEditUser,
  currentUser,
  addLog,
  triggerToast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [nip, setNip] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Pegawai');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('Sekretariat');
  const [status, setStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  const openNewForm = () => {
    setIsEditing(false);
    setUsername('');
    setNip('');
    setName('');
    setRole('Pegawai');
    setEmail('');
    setPhone('');
    setDivision('Sekretariat');
    setStatus('Aktif');
    setIsOpen(true);
  };

  const openEditForm = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    setUsername(user.username);
    setNip(user.nip);
    setName(user.name);
    setRole(user.role);
    setEmail(user.email);
    setPhone(user.phone);
    setDivision(user.division);
    setStatus(user.status);
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name || !nip || !email) {
       triggerToast('Harap isi field wajib termasuk Email!', 'warning');
       return;
     }
 
     if (!email.includes('@') || !email.includes('.')) {
       triggerToast('Format Email tidak valid!', 'warning');
       return;
     }

    if (isEditing && selectedUser) {
      onEditUser(selectedUser.id, {
        username,
        nip,
        name,
        role,
        email,
        phone,
        division,
        status
      });
      addLog('Edit Data', `Mengubah kredensial pengguna: ${username}`);
      triggerToast('Kredensial pengguna berhasil diperbarui!', 'success');
    } else {
      onAddUser({
        username,
        nip,
        name,
        role,
        status,
        email,
        phone,
        division,
        fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
      });
      addLog('Tambah Data', `Mendaftarkan operator pengguna baru: ${username}`);
      triggerToast('Operator pengguna berhasil didaftarkan!', 'success');
    }
    setIsOpen(false);
  };

  const handleResetPassword = (username: string) => {
    addLog('Edit Data', `Reset password manual pengguna: ${username}`);
    triggerToast(`Kunci keamanan baru disinkronkan ke email pengguna ${username}!`, 'success');
  };

  return (
    <div className="space-y-6 text-xs text-slate-500 font-semibold text-left">
      
      {/* Action Header */}
      <div className="flex justify-between items-center bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Manajemen Pengguna Aplikasi (Operator)
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">Kelola hak akses pimpinan, staf sekretariat, dan superadmin</p>
          </div>
        </div>

        <button
          onClick={openNewForm}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/15"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-gray-900 border border-slate-150 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-850 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-gray-800">
                <th className="p-4 w-12 text-center">No</th>
                <th className="p-4">Nama & Username</th>
                <th className="p-4">NIP Identitas</th>
                <th className="p-4">Bagian / Bidang</th>
                <th className="p-4">Hak Akses (Role)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi Pengamanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/80 font-medium text-slate-700 dark:text-slate-300">
              {users.map((u, idx) => (
                <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="p-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={u.fotoUrl} alt={u.name} className="w-8.5 h-8.5 rounded-full object-cover shrink-0 ring-1 ring-slate-200" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white leading-snug">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{u.nip}</td>
                  <td className="p-4 text-blue-600 dark:text-blue-400 uppercase font-bold text-[10px]">{u.division}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{u.role}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-150 text-slate-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditForm(u)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-850 hover:text-blue-600"
                        title="Edit Profil/Role"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(u.username)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-850 hover:text-amber-600"
                        title="Reset Sandi"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT POPUP */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={isEditing ? 'Ubah Operator Pengguna' : 'Pendaftaran Pengguna Baru'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Username <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cth: rina.sekretariat"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">NIP Pegawai <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="cth: 199011052014022003"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Nama Lengkap & Gelar <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth: Rina Kartika, A.Md."
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Hak Akses (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 text-slate-800"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin Sekretariat">Admin Sekretariat</option>
                <option value="Kepala Subbagian">Kepala Subbagian</option>
                <option value="Kepala Badan">Kepala Badan</option>
                <option value="Pegawai">Pegawai</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Status Akun</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 text-slate-800"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Email (Dinas / Pribadi) <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cth: rina@gmail.com atau rina@pangkalpinangkota.go.id"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Nomor Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812XXXXXXXX"
                className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">Division / Bidang</label>
            <input
              type="text"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              placeholder="cth: Bidang Sekretariat / Subbag Umum"
              className="w-full border border-slate-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Simpan Akun
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
