/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  mockUsers,
  mockSuratMasuk,
  mockSuratKeluar,
  mockDisposisi,
  mockAgenda,
  mockReminders,
  mockArsip,
  mockPengumuman,
  mockPegawai,
  mockAuditLogs,
  mockNotifications
} from './data/mockData';
import { User, SuratMasuk, SuratKeluar, Disposisi, Agenda, Reminder, Arsip, Pengumuman, Pegawai, AuditLog, Notification, Role, TimelineEvent } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SuratMasukView } from './components/SuratMasukView';
import { SuratKeluarView } from './components/SuratKeluarView';
import { DisposisiTrackerView } from './components/DisposisiTrackerView';
import { AgendaView } from './components/AgendaView';
import { ReminderView } from './components/ReminderView';
import { ArsipView } from './components/ArsipView';
import { PengumumanView } from './components/PengumumanView';
import { PegawaiView } from './components/PegawaiView';
import { UserView } from './components/UserView';
import { AuditLogView } from './components/AuditLogView';
import { LaporanView } from './components/LaporanView';
import { PengaturanView } from './components/PengaturanView';
import { LoginView } from './components/LoginView';
import { Toast } from './components/Toast';
import {
  db,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  seedCollectionIfEmpty
} from './lib/firebase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sods_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // Core State Engines initialized with mockData as fallback before Firestore syncs
  const [usersList, setUsersList] = useState<User[]>(mockUsers);
  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(mockSuratMasuk);
  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(mockSuratKeluar);
  const [disposisiList, setDisposisiList] = useState<Disposisi[]>(mockDisposisi);
  const [agendaList, setAgendaList] = useState<Agenda[]>(mockAgenda);
  const [reminderList, setReminderList] = useState<Reminder[]>(mockReminders);
  const [arsipList, setArsipList] = useState<Arsip[]>(mockArsip);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(mockPengumuman);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(mockPegawai);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Automatically synchronize active session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sods_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sods_current_user');
    }
  }, [currentUser]);

  // Firestore Seeding & Real-Time Sync on component mount
  useEffect(() => {
    let isSubscribed = true;
    const unsubscribes: (() => void)[] = [];

    const initializeFirestoreData = async () => {
      // 1. Seed all collections if they are empty
      try {
        await seedCollectionIfEmpty('users', mockUsers);
        await seedCollectionIfEmpty('surat_masuk', mockSuratMasuk);
        await seedCollectionIfEmpty('surat_keluar', mockSuratKeluar);
        await seedCollectionIfEmpty('disposisi', mockDisposisi);
        await seedCollectionIfEmpty('agenda', mockAgenda);
        await seedCollectionIfEmpty('reminders', mockReminders);
        await seedCollectionIfEmpty('arsip', mockArsip);
        await seedCollectionIfEmpty('pengumuman', mockPengumuman);
        await seedCollectionIfEmpty('pegawai', mockPegawai);
        await seedCollectionIfEmpty('audit_logs', mockAuditLogs);
        await seedCollectionIfEmpty('notifications', mockNotifications);
      } catch (err) {
        console.error('Initialization/Seeding error:', err);
      }

      if (!isSubscribed) return;

      // 2. Setup Real-time Listeners
      const u1 = onSnapshot(collection(db, 'users'), (snapshot) => {
        const list: User[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as User));
        if (list.length > 0) setUsersList(list);
      });
      unsubscribes.push(u1);

      const u2 = onSnapshot(collection(db, 'surat_masuk'), (snapshot) => {
        const list: SuratMasuk[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as SuratMasuk));
        if (list.length > 0) setSuratMasukList(list);
      });
      unsubscribes.push(u2);

      const u3 = onSnapshot(collection(db, 'surat_keluar'), (snapshot) => {
        const list: SuratKeluar[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as SuratKeluar));
        if (list.length > 0) setSuratKeluarList(list);
      });
      unsubscribes.push(u3);

      const u4 = onSnapshot(collection(db, 'disposisi'), (snapshot) => {
        const list: Disposisi[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as Disposisi));
        if (list.length > 0) setDisposisiList(list);
      });
      unsubscribes.push(u4);

      const u5 = onSnapshot(collection(db, 'agenda'), (snapshot) => {
        const list: Agenda[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as Agenda));
        if (list.length > 0) setAgendaList(list);
      });
      unsubscribes.push(u5);

      const u6 = onSnapshot(collection(db, 'reminders'), (snapshot) => {
        const list: Reminder[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as Reminder));
        if (list.length > 0) setReminderList(list);
      });
      unsubscribes.push(u6);

      const u7 = onSnapshot(collection(db, 'arsip'), (snapshot) => {
        const list: Arsip[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as Arsip));
        if (list.length > 0) setArsipList(list);
      });
      unsubscribes.push(u7);

      const u8 = onSnapshot(collection(db, 'pengumuman'), (snapshot) => {
        const list: Pengumuman[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as Pengumuman));
        if (list.length > 0) setPengumumanList(list);
      });
      unsubscribes.push(u8);

      const u9 = onSnapshot(collection(db, 'pegawai'), (snapshot) => {
        const list: Pegawai[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as Pegawai));
        if (list.length > 0) setPegawaiList(list);
      });
      unsubscribes.push(u9);

      const u10 = onSnapshot(collection(db, 'audit_logs'), (snapshot) => {
        const list: AuditLog[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as AuditLog));
        list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        if (list.length > 0) setAuditLogs(list);
      });
      unsubscribes.push(u10);

      const u11 = onSnapshot(collection(db, 'notifications'), (snapshot) => {
        const list: Notification[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as Notification));
        if (list.length > 0) setNotifications(list);
      });
      unsubscribes.push(u11);
    };

    initializeFirestoreData();

    return () => {
      isSubscribed = false;
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // Toast alert states
  const [toast, setToast] = useState<{ show: boolean; text: string; type: 'success' | 'warning' | 'danger' | 'info' }>({
    show: false,
    text: '',
    type: 'success'
  });

  // Dark mode class sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Helper trigger toast
  const triggerToast = (text: string, type: 'success' | 'warning' | 'danger' | 'info') => {
    setToast({ show: true, text, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Helper push action audit log
  const addLog = async (aktivitas: 'Login' | 'Tambah Data' | 'Edit Data' | 'Hapus Data' | 'Download Data' | 'Backup Database', detail: string) => {
    if (!currentUser) return;
    const logId = `lg_${Math.random().toString(36).substr(2, 9)}`;
    const newLog: AuditLog = {
      id: logId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      aktivitas,
      detail,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ipAddress: '192.168.10.' + Math.floor(Math.random() * 250 + 1)
    };
    try {
      await setDoc(doc(db, 'audit_logs', logId), newLog);
    } catch (e) {
      console.error('Error adding log to Firestore:', e);
    }
  };

  // Core Mutation Handlers
  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    const logId = `lg_${Math.random().toString(36).substr(2, 9)}`;
    const log: AuditLog = {
      id: logId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      aktivitas: 'Login',
      detail: 'Pengguna masuk sesi lewat portal.',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ipAddress: '192.168.10.45'
    };
    try {
      await setDoc(doc(db, 'audit_logs', logId), log);
    } catch (e) {
      console.error('Error adding login log:', e);
    }
  };

  const handleLogout = () => {
    addLog('Login', 'Pengguna mengakhiri sesi dashboard (Logout).');
    setCurrentUser(null);
    setActiveView('dashboard');
    triggerToast('Sesi telah diakhiri secara aman!', 'info');
  };

  const handleRoleChange = async (role: Role) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    try {
      await setDoc(doc(db, 'users', currentUser.id), updated);
      triggerToast(`Hak akses simulasi diubah ke: ${role}`, 'warning');
      addLog('Edit Data', `Simulasi peralihan hak akses ke: ${role}`);
    } catch (e) {
      console.error('Error changing role:', e);
    }
  };

  // Surat Masuk CRUD
  const handleAddSuratMasuk = async (surat: Omit<SuratMasuk, 'id' | 'timeline'>) => {
    const sId = `sm_${Math.random().toString(36).substr(2, 9)}`;
    const newSurat: SuratMasuk = {
      ...surat,
      id: sId,
      timeline: [
        {
          id: `t_${Math.random().toString(36).substr(2, 9)}`,
          status: 'Belum Diproses',
          tanggal: new Date().toISOString().slice(0, 16).replace('T', ' '),
          deskripsi: 'Registrasi dokumen selesai oleh operator.',
          olehName: currentUser?.name || 'Operator'
        }
      ]
    };
    try {
      await setDoc(doc(db, 'surat_masuk', sId), newSurat);
      triggerToast('Surat Masuk berhasil ditambahkan!', 'success');
      addLog('Tambah Data', `Mendaftarkan Surat Masuk No: ${surat.nomorSurat}`);
    } catch (e) {
      console.error('Error adding surat masuk:', e);
      triggerToast('Gagal menyimpan surat masuk ke database!', 'danger');
    }
  };

  const handleEditSuratMasuk = async (id: string, fields: Partial<SuratMasuk>) => {
    const existing = suratMasukList.find(s => s.id === id);
    if (!existing) return;
    const updated = { ...existing, ...fields };
    try {
      await setDoc(doc(db, 'surat_masuk', id), updated);
      triggerToast('Surat Masuk berhasil diperbarui!', 'success');
      addLog('Edit Data', `Memperbarui Surat Masuk No: ${existing.nomorSurat}`);
    } catch (e) {
      console.error('Error editing surat masuk:', e);
      triggerToast('Gagal memperbarui surat masuk!', 'danger');
    }
  };

  const handleDeleteSuratMasuk = async (id: string) => {
    const existing = suratMasukList.find(s => s.id === id);
    try {
      await deleteDoc(doc(db, 'surat_masuk', id));
      triggerToast('Surat Masuk berhasil dihapus!', 'success');
      if (existing) {
        addLog('Hapus Data', `Menghapus Surat Masuk No: ${existing.nomorSurat}`);
      }
    } catch (e) {
      console.error('Error deleting surat masuk:', e);
      triggerToast('Gagal menghapus surat masuk!', 'danger');
    }
  };

  // Surat Keluar CRUD
  const handleAddSuratKeluar = async (surat: Omit<SuratKeluar, 'id'>) => {
    const sId = `sk_${Math.random().toString(36).substr(2, 9)}`;
    const newSurat: SuratKeluar = {
      ...surat,
      id: sId
    };
    try {
      await setDoc(doc(db, 'surat_keluar', sId), newSurat);
      triggerToast('Surat Keluar berhasil didaftarkan!', 'success');
      addLog('Tambah Data', `Mendaftarkan Surat Keluar No: ${surat.nomorSurat}`);
    } catch (e) {
      console.error('Error adding surat keluar:', e);
      triggerToast('Gagal menyimpan surat keluar!', 'danger');
    }
  };

  const handleEditSuratKeluar = async (id: string, fields: Partial<SuratKeluar>) => {
    const existing = suratKeluarList.find(s => s.id === id);
    if (!existing) return;
    const updated = { ...existing, ...fields };
    try {
      await setDoc(doc(db, 'surat_keluar', id), updated);
      triggerToast('Surat Keluar berhasil diperbarui!', 'success');
      addLog('Edit Data', `Memperbarui Surat Keluar No: ${existing.nomorSurat}`);
    } catch (e) {
      console.error('Error editing surat keluar:', e);
      triggerToast('Gagal memperbarui surat keluar!', 'danger');
    }
  };

  const handleDeleteSuratKeluar = async (id: string) => {
    const existing = suratKeluarList.find(s => s.id === id);
    try {
      await deleteDoc(doc(db, 'surat_keluar', id));
      triggerToast('Surat Keluar berhasil dihapus!', 'success');
      if (existing) {
        addLog('Hapus Data', `Menghapus Surat Keluar No: ${existing.nomorSurat}`);
      }
    } catch (e) {
      console.error('Error deleting surat keluar:', e);
      triggerToast('Gagal menghapus surat keluar!', 'danger');
    }
  };

  // Disposition mutations
  const handleUpdateDispositionStatus = async (id: string, status: SuratMasuk['status'], timelineEvent: TimelineEvent) => {
    const existing = suratMasukList.find(s => s.id === id);
    if (!existing) return;
    const updated = {
      ...existing,
      status,
      timeline: [timelineEvent, ...existing.timeline]
    };
    try {
      await setDoc(doc(db, 'surat_masuk', id), updated);
      
      // Update disposisi if exists
      const disp = disposisiList.find(d => d.suratMasukId === id);
      if (disp) {
        await setDoc(doc(db, 'disposisi', disp.id), { ...disp, status });
      } else {
        // Create matching disposisi document if missing
        const dId = `dp_${Math.random().toString(36).substr(2, 9)}`;
        const newDisp: Disposisi = {
          id: dId,
          suratMasukId: id,
          nomorSurat: existing.nomorSurat,
          perihal: existing.perihal,
          pengirim: existing.asalSurat,
          penerima: existing.tujuanDisposisi || 'Sekretaris',
          tanggal: new Date().toISOString().slice(0, 10),
          catatan: timelineEvent.catatan || '',
          instruksi: 'Segera laksanakan dan tindak lanjuti.',
          status
        };
        await setDoc(doc(db, 'disposisi', dId), newDisp);
      }
      triggerToast(`Status disposisi diubah ke: ${status}`, 'info');
      addLog('Edit Data', `Memperbarui status disposisi Surat No: ${existing.nomorSurat} ke ${status}`);
    } catch (e) {
      console.error('Error updating disposition:', e);
    }
  };

  const handleAddCommentToDisposition = async (id: string, timelineEvent: TimelineEvent) => {
    const existing = suratMasukList.find(s => s.id === id);
    if (!existing) return;
    const updated = {
      ...existing,
      timeline: [timelineEvent, ...existing.timeline]
    };
    try {
      await setDoc(doc(db, 'surat_masuk', id), updated);
      triggerToast('Catatan tanggapan berhasil ditambahkan!', 'success');
      addLog('Edit Data', `Menambahkan tanggapan disposisi Surat No: ${existing.nomorSurat}`);
    } catch (e) {
      console.error('Error adding disposition comment:', e);
    }
  };

  // Agendas
  const handleAddAgenda = async (agenda: Omit<Agenda, 'id'>) => {
    const aId = `ag_${Math.random().toString(36).substr(2, 9)}`;
    const newAg: Agenda = {
      ...agenda,
      id: aId
    };
    try {
      await setDoc(doc(db, 'agenda', aId), newAg);
      triggerToast('Agenda berhasil ditambahkan!', 'success');
      addLog('Tambah Data', `Menambahkan agenda baru: ${agenda.judul}`);
    } catch (e) {
      console.error('Error adding agenda:', e);
      triggerToast('Gagal menyimpan agenda!', 'danger');
    }
  };

  const handleApproveAgenda = async (id: string, approverName: string) => {
    const existing = agendaList.find(a => a.id === id);
    if (!existing) return;
    const updated = { ...existing, disetujui: true, disetujuiOleh: approverName };
    try {
      await setDoc(doc(db, 'agenda', id), updated);
      triggerToast('Agenda berhasil disetujui!', 'success');
      addLog('Edit Data', `Menyetujui agenda: ${existing.title}`);
    } catch (e) {
      console.error('Error approving agenda:', e);
    }
  };

  // Reminders
  const handleCompleteReminder = async (id: string) => {
    const existing = reminderList.find(rem => rem.id === id);
    if (!existing) return;
    const updated = { ...existing, status: 'Selesai' as const };
    try {
      await setDoc(doc(db, 'reminders', id), updated);
      triggerToast('Reminder telah ditandai selesai!', 'success');
      addLog('Edit Data', `Menyelesaikan pengingat: ${existing.task}`);
    } catch (e) {
      console.error('Error completing reminder:', e);
    }
  };

  // Archives Digital
  const handleUploadArsip = async (arsip: Omit<Arsip, 'id' | 'riwayat'>) => {
    const arId = `ar_${Math.random().toString(36).substr(2, 9)}`;
    const newAr: Arsip = {
      ...arsip,
      id: arId,
      riwayat: [`Diunggah oleh ${currentUser?.name || 'PNS'}`]
    };
    try {
      await setDoc(doc(db, 'arsip', arId), newAr);
      triggerToast('Berkas berhasil diarsipkan ke database!', 'success');
      addLog('Tambah Data', `Mengarsipkan dokumen digital: ${arsip.nama}`);
    } catch (e) {
      console.error('Error uploading archive:', e);
      triggerToast('Gagal mengarsipkan berkas!', 'danger');
    }
  };

  const handleDeleteArsip = async (id: string) => {
    const existing = arsipList.find(a => a.id === id);
    try {
      await deleteDoc(doc(db, 'arsip', id));
      triggerToast('Arsip berhasil dihapus!', 'success');
      if (existing) {
        addLog('Hapus Data', `Menghapus arsip dokumen: ${existing.nama}`);
      }
    } catch (e) {
      console.error('Error deleting archive:', e);
      triggerToast('Gagal menghapus arsip!', 'danger');
    }
  };

  // Announcements Bulletins
  const handleAddPengumuman = async (p: Omit<Pengumuman, 'id' | 'tanggal'>) => {
    const pId = `p_${Math.random().toString(36).substr(2, 9)}`;
    const newP: Pengumuman = {
      ...p,
      id: pId,
      tanggal: new Date().toISOString().slice(0, 10)
    };
    try {
      await setDoc(doc(db, 'pengumuman', pId), newP);
      triggerToast('Pengumuman berhasil diterbitkan!', 'success');
      addLog('Tambah Data', `Menerbitkan pengumuman: ${p.judul}`);
    } catch (e) {
      console.error('Error adding announcement:', e);
      triggerToast('Gagal mempublikasikan pengumuman!', 'danger');
    }
  };

  const handleDeletePengumuman = async (id: string) => {
    const existing = pengumumanList.find(p => p.id === id);
    try {
      await deleteDoc(doc(db, 'pengumuman', id));
      triggerToast('Pengumuman berhasil dihapus!', 'success');
      if (existing) {
        addLog('Hapus Data', `Menghapus pengumuman: ${existing.judul}`);
      }
    } catch (e) {
      console.error('Error deleting announcement:', e);
      triggerToast('Gagal menghapus pengumuman!', 'danger');
    }
  };

  // Operators Users
  const handleAddUser = async (user: Omit<User, 'id'>) => {
    const uId = `u_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      ...user,
      id: uId
    };
    try {
      await setDoc(doc(db, 'users', uId), newUser);
      triggerToast('Akun pegawai berhasil didaftarkan ke cloud database!', 'success');
      addLog('Tambah Data', `Mendaftarkan akun staf baru: ${user.name} (${user.username})`);
    } catch (e) {
      console.error('Error adding user:', e);
      triggerToast('Gagal mendaftarkan akun!', 'danger');
    }
  };

  const handleEditUser = async (id: string, fields: Partial<User>) => {
    const existing = usersList.find(u => u.id === id);
    if (!existing) return;
    const updated = { ...existing, ...fields };
    try {
      await setDoc(doc(db, 'users', id), updated);
      triggerToast('Profil pegawai berhasil diperbarui!', 'success');
      addLog('Edit Data', `Memperbarui data profil staf: ${existing.name}`);
    } catch (e) {
      console.error('Error editing user:', e);
      triggerToast('Gagal memperbarui profil!', 'danger');
    }
  };

  // Notifications
  const handleMarkNotification = async (id: string) => {
    const existing = notifications.find(n => n.id === id);
    if (!existing) return;
    const updated = { ...existing, read: true };
    try {
      await setDoc(doc(db, 'notifications', id), updated);
    } catch (e) {
      console.error('Error marking notification:', e);
    }
  };

  // Global search proxy
  const handleGlobalSearch = (term: string) => {
    if (!term) return;
    if (term.toUpperCase() === 'PROFIL') {
      setActiveView('pengaturan');
      triggerToast('Membuka setelan profil operator!', 'info');
      return;
    }
    triggerToast(`Pencarian global disaring: "${term}"`, 'info');
  };

  // Render subviews safely
  const renderView = () => {
    if (!currentUser) return null;

    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            suratMasuk={suratMasukList}
            suratKeluar={suratKeluarList}
            disposisi={disposisiList}
            reminders={reminderList}
            agendas={agendaList}
            auditLogs={auditLogs}
            currentUser={currentUser}
            setActiveView={setActiveView}
          />
        );
      case 'surat_masuk':
        return (
          <SuratMasukView
            suratList={suratMasukList}
            onAdd={handleAddSuratMasuk}
            onEdit={handleEditSuratMasuk}
            onDelete={handleDeleteSuratMasuk}
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'surat_keluar':
        return (
          <SuratKeluarView
            suratList={suratKeluarList}
            onAdd={handleAddSuratKeluar}
            onEdit={handleEditSuratKeluar}
            onDelete={handleDeleteSuratKeluar}
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'disposisi':
        return (
          <DisposisiTrackerView
            suratList={suratMasukList}
            onUpdateStatus={handleUpdateDispositionStatus}
            onAddComment={handleAddCommentToDisposition}
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'agenda':
        return (
          <AgendaView
            agendas={agendaList}
            onAddAgenda={handleAddAgenda}
            onApproveAgenda={handleApproveAgenda}
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'reminder':
        return (
          <ReminderView
            reminders={reminderList}
            onCompleteReminder={handleCompleteReminder}
          />
        );
      case 'arsip':
        return (
          <ArsipView
            arsipList={arsipList}
            onUploadArsip={handleUploadArsip}
            onDeleteArsip={handleDeleteArsip}
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'pengumuman':
        return (
          <PengumumanView
            pengumumanList={pengumumanList}
            onAddPengumuman={handleAddPengumuman}
            onDeletePengumuman={handleDeletePengumuman}
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'pegawai':
        return (
          <PegawaiView
            pegawaiList={pegawaiList}
          />
        );
      case 'user':
        return (
          <UserView
            users={usersList}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'audit':
        return (
          <AuditLogView
            auditLogs={auditLogs}
          />
        );
      case 'laporan':
        return (
          <LaporanView
            suratMasuk={suratMasukList}
            suratKeluar={suratKeluarList}
            disposisi={disposisiList}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      case 'pengaturan':
        return (
          <PengaturanView
            currentUser={currentUser}
            addLog={addLog}
            triggerToast={triggerToast}
          />
        );
      default:
        return <div className="text-center p-8">Halaman Tidak Ditemukan.</div>;
    }
  };

  // Portal Access gate
  if (!currentUser) {
    return (
      <div className="dark:bg-gray-950 min-h-screen transition-colors">
        <LoginView
          onLoginSuccess={handleLogin}
          mockUsersList={usersList}
          triggerToast={triggerToast}
          onRegister={handleAddUser}
        />
        {toast.show && <Toast text={toast.text} type={toast.type} />}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] dark:bg-[#070B14] font-sans antialiased text-slate-700 transition-colors">
      
      {/* Left Sidebar Menu */}
      <Sidebar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      {/* Main viewport */}
      <div className="flex flex-1 flex-col overflow-hidden h-screen">
        
        {/* Dynamic header navigation */}
        <Navbar
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotification}
          onGlobalSearch={handleGlobalSearch}
          currentView={activeView}
        />

        {/* View body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          {renderView()}
        </main>

      </div>

      {/* Interactive overlays */}
      {toast.show && <Toast text={toast.text} type={toast.type} />}

    </div>
  );
}
