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

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // Core State Engines
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
  const addLog = (aktivitas: 'Login' | 'Tambah Data' | 'Edit Data' | 'Hapus Data' | 'Download Data' | 'Backup Database', detail: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `lg_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      aktivitas,
      detail,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ipAddress: '192.168.10.' + Math.floor(Math.random() * 250 + 1)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Core Mutation Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const log: AuditLog = {
      id: `lg_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      aktivitas: 'Login',
      detail: 'Pengguna masuk sesi lewat portal.',
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ipAddress: '192.168.10.45'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleLogout = () => {
    addLog('Login', 'Pengguna mengakhiri sesi dashboard (Logout).');
    setCurrentUser(null);
    setActiveView('dashboard');
    triggerToast('Sesi telah diakhiri secara aman!', 'info');
  };

  const handleRoleChange = (role: Role) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    // Sync inside userList too
    setUsersList(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    triggerToast(`Hak akses simulasi diubah ke: ${role}`, 'warning');
    addLog('Edit Data', `Simulasi peralihan hak akses ke: ${role}`);
  };

  // Surat Masuk CRUD
  const handleAddSuratMasuk = (surat: Omit<SuratMasuk, 'id' | 'timeline'>) => {
    const newSurat: SuratMasuk = {
      ...surat,
      id: `sm_${Math.random().toString(36).substr(2, 9)}`,
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
    setSuratMasukList(prev => [newSurat, ...prev]);
  };

  const handleEditSuratMasuk = (id: string, fields: Partial<SuratMasuk>) => {
    setSuratMasukList(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s));
  };

  const handleDeleteSuratMasuk = (id: string) => {
    setSuratMasukList(prev => prev.filter(s => s.id !== id));
  };

  // Surat Keluar CRUD
  const handleAddSuratKeluar = (surat: Omit<SuratKeluar, 'id'>) => {
    const newSurat: SuratKeluar = {
      ...surat,
      id: `sk_${Math.random().toString(36).substr(2, 9)}`
    };
    setSuratKeluarList(prev => [newSurat, ...prev]);
  };

  const handleEditSuratKeluar = (id: string, fields: Partial<SuratKeluar>) => {
    setSuratKeluarList(prev => prev.map(s => s.id === id ? { ...s, ...fields } : s));
  };

  const handleDeleteSuratKeluar = (id: string) => {
    setSuratKeluarList(prev => prev.filter(s => s.id !== id));
  };

  // Disposition mutations
  const handleUpdateDispositionStatus = (id: string, status: SuratMasuk['status'], timelineEvent: TimelineEvent) => {
    setSuratMasukList(prev => prev.map(s => {
      if (s.id === id) {
        // Sync inside mockDisposisi too if exist
        setDisposisiList(prevD => prevD.map(d => d.suratMasukId === id ? { ...d, status } : d));
        return {
          ...s,
          status,
          timeline: [timelineEvent, ...s.timeline]
        };
      }
      return s;
    }));
  };

  const handleAddCommentToDisposition = (id: string, timelineEvent: TimelineEvent) => {
    setSuratMasukList(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          timeline: [timelineEvent, ...s.timeline]
        };
      }
      return s;
    }));
  };

  // Agendas
  const handleAddAgenda = (agenda: Omit<Agenda, 'id'>) => {
    const newAg: Agenda = {
      ...agenda,
      id: `ag_${Math.random().toString(36).substr(2, 9)}`
    };
    setAgendaList(prev => [newAg, ...prev]);
  };

  const handleApproveAgenda = (id: string, approverName: string) => {
    setAgendaList(prev => prev.map(ag => ag.id === id ? { ...ag, disetujui: true, disetujuiOleh: approverName } : ag));
  };

  // Reminders
  const handleCompleteReminder = (id: string) => {
    setReminderList(prev => prev.map(rem => rem.id === id ? { ...rem, status: 'Selesai' } : rem));
    triggerToast('Reminder telah ditandai selesai!', 'success');
  };

  // Archives Digital
  const handleUploadArsip = (arsip: Omit<Arsip, 'id' | 'riwayat'>) => {
    const newAr: Arsip = {
      ...arsip,
      id: `ar_${Math.random().toString(36).substr(2, 9)}`,
      riwayat: [`Diunggah oleh ${currentUser?.name || 'PNS'}`]
    };
    setArsipList(prev => [newAr, ...prev]);
  };

  const handleDeleteArsip = (id: string) => {
    setArsipList(prev => prev.filter(a => a.id !== id));
  };

  // Announcements Bulletins
  const handleAddPengumuman = (p: Omit<Pengumuman, 'id' | 'tanggal'>) => {
    const newP: Pengumuman = {
      ...p,
      id: `p_${Math.random().toString(36).substr(2, 9)}`,
      tanggal: new Date().toISOString().slice(0, 10)
    };
    setPengumumanList(prev => [newP, ...prev]);
  };

  const handleDeletePengumuman = (id: string) => {
    setPengumumanList(prev => prev.filter(p => p.id !== id));
  };

  // Operators Users
  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `u_${Math.random().toString(36).substr(2, 9)}`
    };
    setUsersList(prev => [...prev, newUser]);
  };

  const handleEditUser = (id: string, fields: Partial<User>) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
  };

  // Notifications
  const handleMarkNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#070B14] font-sans antialiased text-slate-700 transition-colors">
      
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
