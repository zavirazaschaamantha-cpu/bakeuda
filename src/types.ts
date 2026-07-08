/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Super Admin' | 'Admin Sekretariat' | 'Kepala Subbagian' | 'Kepala Badan' | 'Pegawai';

export interface User {
  id: string;
  username: string;
  nip: string;
  name: string;
  role: Role;
  status: 'Aktif' | 'Nonaktif';
  email: string;
  phone: string;
  division: string;
  fotoUrl: string;
}

export interface TimelineEvent {
  id: string;
  status: 'Belum Diproses' | 'Sedang Diproses' | 'Menunggu Persetujuan' | 'Selesai';
  tanggal: string;
  deskripsi: string;
  olehName: string;
  catatan?: string;
}

export interface SuratMasuk {
  id: string;
  nomorSurat: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  asalSurat: string;
  perihal: string;
  kategori: 'Undangan' | 'Pemberitahuan' | 'Dinas' | 'Lain-lain';
  lampiran: string; // e.g. "1 Berkas"
  status: 'Belum Diproses' | 'Sedang Diproses' | 'Menunggu Persetujuan' | 'Selesai';
  tujuanDisposisi: string; // e.g. "Kepala Badan", "Kepala Subbagian Umum"
  prioritas: 'Biasa' | 'Penting' | 'Sangat Penting';
  keterangan: string;
  pdfUrl?: string;
  timeline: TimelineEvent[];
}

export interface SuratKeluar {
  id: string;
  nomorSurat: string;
  tanggal: string;
  tujuan: string;
  perihal: string;
  kategori: 'Undangan' | 'Pemberitahuan' | 'Dinas' | 'Lain-lain';
  lampiran: string;
  status: 'Draf' | 'Sedang Ditinjau' | 'Disetujui' | 'Terkirim';
  penanggungJawab: string; // e.g. "Siti Aminah, M.Si."
  pdfUrl?: string;
}

export interface Disposisi {
  id: string;
  suratMasukId: string;
  nomorSurat: string;
  perihal: string;
  pengirim: string;
  penerima: string;
  catatan: string;
  instruksi: string;
  tanggal: string;
  status: 'Belum Diproses' | 'Sedang Diproses' | 'Menunggu Persetujuan' | 'Selesai';
}

export interface Agenda {
  id: string;
  judul: string;
  deskripsi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  waktu: string; // e.g. "09:00 - Selesai"
  kategori: 'Rapat' | 'Upacara' | 'Bimtek' | 'Audiensi' | 'Lain-lain';
  lokasi: string;
  disetujui: boolean;
  disetujuiOleh?: string;
}

export interface Reminder {
  id: string;
  tipe: 'Surat Masuk' | 'Surat Keluar' | 'Agenda' | 'Arsip';
  referensiId: string;
  referensiJudul: string;
  tanggalDeadline: string;
  status: 'Aktif' | 'Selesai' | 'Melewati Batas';
  deskripsi: string;
}

export interface Arsip {
  id: string;
  nama: string;
  kategori: 'Surat Masuk' | 'Surat Keluar' | 'SK Kepala Badan' | 'Undangan' | 'Laporan Keuangan';
  tag: string[];
  tanggalUpload: string;
  ukuran: string; // e.g. "2.4 MB"
  tipeFile: string; // e.g. "pdf", "docx"
  folder: 'Surat' | 'SK & Peraturan' | 'Keuangan' | 'Umum';
  riwayat: string[]; // List of actions like "Diunduh oleh Admin Sekretariat", etc.
  pdfUrl?: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  lampiran?: string;
  tanggal: string;
  status: 'Aktif' | 'Arsip';
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  bidang: 'Sekretariat' | 'Perbendaharaan' | 'Aset' | 'Akuntansi' | 'Pajak & Retribusi';
  email: string;
  phone: string;
  status: 'Aktif' | 'Cuti' | 'Pensiun';
  fotoUrl: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  aktivitas: 'Login' | 'Logout' | 'Tambah Data' | 'Edit Data' | 'Hapus Data' | 'Download Data' | 'Backup Database';
  detail: string;
  timestamp: string;
  ipAddress: string;
}

export interface Notification {
  id: string;
  judul: string;
  pesan: string;
  tipe: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  read: boolean;
}

export interface SystemSetting {
  id: string;
  instansiName: string;
  singkatanInstansi: string;
  alamat: string;
  telepon: string;
  email: string;
  website: string;
  kepalaBadanNama: string;
  kepalaBadanNip: string;
  sekretarisNama: string;
  sekretarisNip: string;
}
