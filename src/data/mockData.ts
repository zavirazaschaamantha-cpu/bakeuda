/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, SuratMasuk, SuratKeluar, Disposisi, Agenda, Reminder, Arsip, Pengumuman, Pegawai, AuditLog, Notification, SystemSetting } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'superadmin',
    nip: '198504122010011002',
    name: 'Hendra Wijaya, S.Kom.',
    role: 'Super Admin',
    status: 'Aktif',
    email: 'hendra.wijaya@pangkalpinangkota.go.id',
    phone: '081234567890',
    division: 'Subbagian Umum & TI',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'u2',
    username: 'adminsekretariat',
    nip: '199011052014022003',
    name: 'Rina Kartika, A.Md.',
    role: 'Admin Sekretariat',
    status: 'Aktif',
    email: 'rina.kartika@pangkalpinangkota.go.id',
    phone: '082345678901',
    division: 'Sekretariat',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'u3',
    username: 'kasubbag',
    nip: '197808242005011001',
    name: 'Agus Setiawan, S.E., M.M.',
    role: 'Kepala Subbagian',
    status: 'Aktif',
    email: 'agus.setiawan@pangkalpinangkota.go.id',
    phone: '081122334455',
    division: 'Subbagian Umum & Kepegawaian',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'u4',
    username: 'kaban',
    nip: '197103151996031002',
    name: 'Dr. Budiyanto, M.Si.',
    role: 'Kepala Badan',
    status: 'Aktif',
    email: 'budiyanto@pangkalpinangkota.go.id',
    phone: '081199887766',
    division: 'Pimpinan',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'u5',
    username: 'pegawai',
    nip: '199507182020012004',
    name: 'Siti Aminah, S.A.P.',
    role: 'Pegawai',
    status: 'Aktif',
    email: 'siti.aminah@pangkalpinangkota.go.id',
    phone: '085211223344',
    division: 'Sekretariat',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
  }
];

export const mockSuratMasuk: SuratMasuk[] = [
  {
    id: 'sm1',
    nomorSurat: '005/320/WALIKOTA/2026',
    tanggalSurat: '2026-07-02',
    tanggalDiterima: '2026-07-03',
    asalSurat: 'Sekretariat Daerah Kota Pangkalpinang',
    perihal: 'Undangan Rapat Koordinasi Pembahasan APBD Perubahan Tahun Anggaran 2026',
    kategori: 'Undangan',
    lampiran: '1 Berkas',
    status: 'Selesai',
    tujuanDisposisi: 'Kepala Badan',
    prioritas: 'Sangat Penting',
    keterangan: 'Harap dihadiri tepat waktu bersama tim anggaran Bakeuda.',
    pdfUrl: 'pdf_dummy_url',
    timeline: [
      {
        id: 't1_1',
        status: 'Belum Diproses',
        tanggal: '2026-07-03 08:30',
        deskripsi: 'Surat masuk diterima oleh Admin Sekretariat',
        olehName: 'Rina Kartika, A.Md.',
        catatan: 'Diserahkan ke pimpinan via sistem.'
      },
      {
        id: 't1_2',
        status: 'Sedang Diproses',
        tanggal: '2026-07-03 10:15',
        deskripsi: 'Disposisi oleh Kepala Badan',
        olehName: 'Dr. Budiyanto, M.Si.',
        catatan: 'Kasubbag Umum koordinasikan bahan dan siapkan draf anggaran pendukung.'
      },
      {
        id: 't1_3',
        status: 'Menunggu Persetujuan',
        tanggal: '2026-07-04 14:00',
        deskripsi: 'Draf pendukung disiapkan dan diajukan oleh Kasubbag',
        olehName: 'Agus Setiawan, S.E., M.M.',
        catatan: 'Draf siap, mohon persetujuan Kaban untuk dibawa rapat.'
      },
      {
        id: 't1_4',
        status: 'Selesai',
        tanggal: '2026-07-05 09:30',
        deskripsi: 'Disetujui oleh Kepala Badan & Diarsipkan',
        olehName: 'Dr. Budiyanto, M.Si.',
        catatan: 'Selesai. Siap dilaksanakan, draf sesuai.'
      }
    ]
  },
  {
    id: 'sm2',
    nomorSurat: '700/145/BPK-RI/2026',
    tanggalSurat: '2026-07-04',
    tanggalDiterima: '2026-07-05',
    asalSurat: 'Badan Pemeriksa Keuangan RI Perwakilan Prov. Kep. Bangka Belitung',
    perihal: 'Pemberitahuan Pemeriksaan Interim Laporan Keuangan Pemerintah Daerah (LKPD) 2026',
    kategori: 'Pemberitahuan',
    lampiran: '3 Lampiran',
    status: 'Sedang Diproses',
    tujuanDisposisi: 'Kepala Badan',
    prioritas: 'Sangat Penting',
    keterangan: 'Dimohon menyiapkan berkas transaksi dan laporan aset semester 1.',
    pdfUrl: 'pdf_dummy_url',
    timeline: [
      {
        id: 't2_1',
        status: 'Belum Diproses',
        tanggal: '2026-07-05 09:00',
        deskripsi: 'Surat masuk dicatat oleh Admin Sekretariat',
        olehName: 'Rina Kartika, A.Md.',
        catatan: 'Kategori penting, diteruskan ke Kaban'
      },
      {
        id: 't2_2',
        status: 'Sedang Diproses',
        tanggal: '2026-07-06 08:30',
        deskripsi: 'Disposisi Kaban ke Kasubbag Umum dan Bidang Akuntansi',
        olehName: 'Dr. Budiyanto, M.Si.',
        catatan: 'Segera siapkan berkas pendukung dan fasilitasi tim auditor BPK.'
      }
    ]
  },
  {
    id: 'sm3',
    nomorSurat: '090/512/BAKEUDA-PROV/2026',
    tanggalSurat: '2026-07-05',
    tanggalDiterima: '2026-07-06',
    asalSurat: 'Badan Keuangan Daerah Provinsi Kepulauan Bangka Belitung',
    perihal: 'Penyampaian Evaluasi Target Retribusi dan Pajak Daerah Triwulan II',
    kategori: 'Dinas',
    lampiran: '1 Berkas',
    status: 'Belum Diproses',
    tujuanDisposisi: 'Belum Ditentukan',
    prioritas: 'Penting',
    keterangan: 'Laporan evaluasi untuk pencapaian PAD Kota Pangkalpinang.',
    pdfUrl: 'pdf_dummy_url',
    timeline: [
      {
        id: 't3_1',
        status: 'Belum Diproses',
        tanggal: '2026-07-06 11:00',
        deskripsi: 'Surat masuk diterima dan dimasukkan sistem oleh Admin',
        olehName: 'Rina Kartika, A.Md.',
        catatan: 'Belum diposisikan Kaban.'
      }
    ]
  },
  {
    id: 'sm4',
    nomorSurat: '005/112/KEC.GERUNGGANG/2026',
    tanggalSurat: '2026-07-06',
    tanggalDiterima: '2026-07-07',
    asalSurat: 'Kantor Kecamatan Gerunggang Pangkalpinang',
    perihal: 'Undangan Kegiatan Sosialisasi PBB Perdesaan dan Perkotaan (PBB-P2)',
    kategori: 'Undangan',
    lampiran: 'Tidak ada',
    status: 'Belum Diproses',
    tujuanDisposisi: 'Belum Ditentukan',
    prioritas: 'Biasa',
    keterangan: 'Untuk mengirim delegasi tim penyuluhan pajak.',
    pdfUrl: 'pdf_dummy_url',
    timeline: [
      {
        id: 't4_1',
        status: 'Belum Diproses',
        tanggal: '2026-07-07 09:00',
        deskripsi: 'Registrasi surat oleh Admin',
        olehName: 'Rina Kartika, A.Md.'
      }
    ]
  }
];

export const mockSuratKeluar: SuratKeluar[] = [
  {
    id: 'sk1',
    nomorSurat: '900/180/BAKEUDA/2026',
    tanggal: '2026-07-01',
    tujuan: 'Yth. Seluruh Kepala OPD Se-Kota Pangkalpinang',
    perihal: 'Penyampaian Batas Akhir Pengajuan SPM-LS Semester Ganjil Tahun 2026',
    kategori: 'Dinas',
    lampiran: '1 Lembar',
    status: 'Terkirim',
    penanggungJawab: 'Dr. Budiyanto, M.Si.',
    pdfUrl: 'pdf_dummy_url'
  },
  {
    id: 'sk2',
    nomorSurat: '005/192/BAKEUDA/2026',
    tanggal: '2026-07-04',
    tujuan: 'Yth. Kepala Kantor Pajak Pratama Pangkalpinang',
    perihal: 'Undangan Rapat Koordinasi Rekonsiliasi DBH Pajak Semester I Tahun 2026',
    kategori: 'Undangan',
    lampiran: '1 Lembar',
    status: 'Terkirim',
    penanggungJawab: 'Agus Setiawan, S.E., M.M.',
    pdfUrl: 'pdf_dummy_url'
  },
  {
    id: 'sk3',
    nomorSurat: '900/215/BAKEUDA/2026',
    tanggal: '2026-07-07',
    tujuan: 'Yth. Sekretaris Daerah Kota Pangkalpinang',
    perihal: 'Laporan Bulanan Realisasi Pendapatan dan Belanja Daerah s/d Juni Tahun 2026',
    kategori: 'Dinas',
    lampiran: '1 Berkas',
    status: 'Sedang Ditinjau',
    penanggungJawab: 'Dr. Budiyanto, M.Si.',
    pdfUrl: 'pdf_dummy_url'
  }
];

export const mockDisposisi: Disposisi[] = [
  {
    id: 'dp1',
    suratMasukId: 'sm1',
    nomorSurat: '005/320/WALIKOTA/2026',
    perihal: 'Undangan Rapat Koordinasi Pembahasan APBD Perubahan Tahun Anggaran 2026',
    pengirim: 'Dr. Budiyanto, M.Si. (Kepala Badan)',
    penerima: 'Agus Setiawan, S.E., M.M. (Kasubbag Umum)',
    catatan: 'Siapkan berkas dan ikuti rapat bersama tim anggaran.',
    instruksi: 'Hadiri & Koordinasikan',
    tanggal: '2026-07-03',
    status: 'Selesai'
  },
  {
    id: 'dp2',
    suratMasukId: 'sm2',
    nomorSurat: '700/145/BPK-RI/2026',
    perihal: 'Pemberitahuan Pemeriksaan Interim Laporan Keuangan Pemerintah Daerah (LKPD) 2026',
    pengirim: 'Dr. Budiyanto, M.Si. (Kepala Badan)',
    penerima: 'Agus Setiawan, S.E., M.M. (Kasubbag Umum & Kepegawaian)',
    catatan: 'Segera kumpulkan data keuangan dan koordinasikan dengan Bidang Akuntansi dan Aset.',
    instruksi: 'Tindaklanjuti Segera',
    tanggal: '2026-07-06',
    status: 'Sedang Diproses'
  }
];

export const mockAgenda: Agenda[] = [
  {
    id: 'ag1',
    judul: 'Rapat Koordinasi Evaluasi Realisasi PAD Triwulan II',
    deskripsi: 'Evaluasi pencapaian target pajak daerah, retribusi daerah, dan pendapatan lainnya bersama Bidang Pajak & Retribusi.',
    tanggalMulai: '2026-07-08',
    tanggalSelesai: '2026-07-08',
    waktu: '09:00 - 12:00 WIB',
    kategori: 'Rapat',
    lokasi: 'Ruang Rapat Utama BAKEUDA Kota Pangkalpinang',
    disetujui: true,
    disetujuiOleh: 'Dr. Budiyanto, M.Si.'
  },
  {
    id: 'ag2',
    judul: 'Sosialisasi Aplikasi SIPD RI Penatausahaan Keuangan',
    deskripsi: 'Bimbingan teknis penggunaan aplikasi SIPD RI versi terbaru untuk bendahara pengeluaran pembantu seluruh OPD.',
    tanggalMulai: '2026-07-10',
    tanggalSelesai: '2026-07-10',
    waktu: '08:00 - 16:00 WIB',
    kategori: 'Bimtek',
    lokasi: 'Gedung Pertemuan Tudung Saji Kantor Walikota',
    disetujui: true,
    disetujuiOleh: 'Dr. Budiyanto, M.Si.'
  },
  {
    id: 'ag3',
    judul: 'Audiensi dengan Tim Pemeriksa BPK-RI Perwakilan Babel',
    deskripsi: 'Pertemuan awal (entry meeting) terkait pemeriksaan interim LKPD tahun 2026.',
    tanggalMulai: '2026-07-09',
    tanggalSelesai: '2026-07-09',
    waktu: '13:30 - 15:30 WIB',
    kategori: 'Audiensi',
    lokasi: 'Ruang Kerja Kepala BAKEUDA',
    disetujui: false
  }
];

export const mockReminders: Reminder[] = [
  {
    id: 'rem1',
    tipe: 'Surat Masuk',
    referensiId: 'sm2',
    referensiJudul: 'Pemeriksaan Interim BPK-RI (LKPD 2026)',
    tanggalDeadline: '2026-07-12',
    status: 'Aktif',
    deskripsi: 'Batas penyiapan Laporan Aset dan Berkas Transaksi Keuangan Semester I.'
  },
  {
    id: 'rem2',
    tipe: 'Surat Keluar',
    referensiId: 'sk3',
    referensiJudul: 'Laporan Bulanan Realisasi APBD s/d Juni',
    tanggalDeadline: '2026-07-09',
    status: 'Aktif',
    deskripsi: 'Batas akhir penyampaian laporan bulanan ke Sekretaris Daerah.'
  },
  {
    id: 'rem3',
    tipe: 'Agenda',
    referensiId: 'ag1',
    referensiJudul: 'Rapat Evaluasi Realisasi PAD',
    tanggalDeadline: '2026-07-08',
    status: 'Aktif',
    deskripsi: 'Menyiapkan materi paparan target realisasi pajak s/d Juni.'
  }
];

export const mockArsip: Arsip[] = [
  {
    id: 'ar1',
    nama: 'Laporan_Keuangan_Pemerintah_Daerah_LKPD_2025.pdf',
    kategori: 'Laporan Keuangan',
    tag: ['LKPD', '2025', 'Audit BPK', 'WTP'],
    tanggalUpload: '2026-02-15',
    ukuran: '12.4 MB',
    tipeFile: 'pdf',
    folder: 'Keuangan',
    riwayat: ['Diunggah oleh Hendra Wijaya', 'Diunduh oleh Dr. Budiyanto', 'Diunduh oleh Siti Aminah']
  },
  {
    id: 'ar2',
    nama: 'Peraturan_Walikota_No_12_Tahun_2026_Tentang_Tukin_PNS.pdf',
    kategori: 'SK Kepala Badan',
    tag: ['Perwa', 'Tukin', 'PNS', 'Kepegawaian'],
    tanggalUpload: '2026-04-10',
    ukuran: '3.1 MB',
    tipeFile: 'pdf',
    folder: 'SK & Peraturan',
    riwayat: ['Diunggah oleh Hendra Wijaya', 'Diunduh oleh Rina Kartika']
  },
  {
    id: 'ar3',
    nama: 'Undangan_Rakor_Keuangan_Pusat_Daerah.pdf',
    kategori: 'Undangan',
    tag: ['Undangan', 'Kemenkeu', 'Rakor'],
    tanggalUpload: '2026-06-20',
    ukuran: '1.2 MB',
    tipeFile: 'pdf',
    folder: 'Surat',
    riwayat: ['Diunggah oleh Rina Kartika']
  }
];

export const mockPengumuman: Pengumuman[] = [
  {
    id: 'p1',
    judul: 'Penerapan Sistem Absensi Fingerprint Terintegrasi per 1 Agustus 2026',
    isi: 'Diberitahukan kepada seluruh pegawai di lingkungan Badan Keuangan Daerah Kota Pangkalpinang, bahwa guna meningkatkan disiplin kerja, sistem absensi berbasis fingerprint digital akan disinkronisasikan langsung dengan perhitungan Tambahan Penghasilan Pegawai (TPP). Harap dipersiapkan berkas e-KTP dan verifikasi ulang sidik jari di Subbagian Kepegawaian.',
    lampiran: 'Surat_Edaran_Absensi.pdf',
    tanggal: '2026-07-06',
    status: 'Aktif'
  },
  {
    id: 'p2',
    judul: 'Kebijakan Work From Home (WFH) Selama Rehabilitasi Gedung Bakeuda',
    isi: 'Sehubungan dengan pengerjaan rehabilitasi atap dan ruang pelayanan kantor Bakeuda mulai tanggal 15 Juli 2026 s/d 25 Juli 2026, maka akan diberlakukan sistem piket dan WFH bergantian per bidang. Jadwal detail akan dibagikan oleh masing-masing Kepala Bidang.',
    lampiran: 'Jadwal_WFH_Bakeuda.pdf',
    tanggal: '2026-07-05',
    status: 'Aktif'
  }
];

export const mockPegawai: Pegawai[] = [
  {
    id: 'peg1',
    nama: 'Dr. Budiyanto, M.Si.',
    nip: '197103151996031002',
    jabatan: 'Kepala Badan Keuangan Daerah',
    bidang: 'Sekretariat',
    email: 'budiyanto@pangkalpinangkota.go.id',
    phone: '081199887766',
    status: 'Aktif',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'peg2',
    nama: 'Agus Setiawan, S.E., M.M.',
    nip: '197808242005011001',
    jabatan: 'Kepala Subbagian Umum & Kepegawaian',
    bidang: 'Sekretariat',
    email: 'agus.setiawan@pangkalpinangkota.go.id',
    phone: '081122334455',
    status: 'Aktif',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'peg3',
    nama: 'Siti Aminah, S.A.P.',
    nip: '199507182020012004',
    jabatan: 'Analis Perencanaan Anggaran',
    bidang: 'Sekretariat',
    email: 'siti.aminah@pangkalpinangkota.go.id',
    phone: '085211223344',
    status: 'Aktif',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'peg4',
    nama: 'Bambang Utomo, S.E.',
    nip: '198205102008121001',
    jabatan: 'Kepala Bidang Perbendaharaan',
    bidang: 'Perbendaharaan',
    email: 'bambang.u@pangkalpinangkota.go.id',
    phone: '081288776655',
    status: 'Aktif',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'peg5',
    nama: 'Dewi Lestari, S.E., Ak.',
    nip: '198810232011012002',
    jabatan: 'Kepala Bidang Akuntansi',
    bidang: 'Akuntansi',
    email: 'dewi.lestari@pangkalpinangkota.go.id',
    phone: '081322446688',
    status: 'Aktif',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'lg1',
    userId: 'u1',
    userName: 'Hendra Wijaya, S.Kom.',
    userRole: 'Super Admin',
    aktivitas: 'Login',
    detail: 'Pengguna melakukan login ke dalam sistem.',
    timestamp: '2026-07-07 08:00',
    ipAddress: '192.168.10.45'
  },
  {
    id: 'lg2',
    userId: 'u2',
    userName: 'Rina Kartika, A.Md.',
    userRole: 'Admin Sekretariat',
    aktivitas: 'Tambah Data',
    detail: 'Menambahkan Surat Masuk baru: Nomor 005/112/KEC.GERUNGGANG/2026',
    timestamp: '2026-07-07 09:15',
    ipAddress: '192.168.10.82'
  },
  {
    id: 'lg3',
    userId: 'u4',
    userName: 'Dr. Budiyanto, M.Si.',
    userRole: 'Kepala Badan',
    aktivitas: 'Edit Data',
    detail: 'Melakukan disposisi pada Surat Masuk BPK-RI: Nomor 700/145/BPK-RI/2026',
    timestamp: '2026-07-06 08:30',
    ipAddress: '192.168.110.12'
  },
  {
    id: 'lg4',
    userId: 'u1',
    userName: 'Hendra Wijaya, S.Kom.',
    userRole: 'Super Admin',
    aktivitas: 'Backup Database',
    detail: 'Melakukan backup manual basis data sistem (format sql.gz).',
    timestamp: '2026-07-07 10:00',
    ipAddress: '192.168.10.45'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    judul: 'Surat Masuk Baru',
    pesan: 'Surat dari BPK-RI Perwakilan Babel (Nomor: 700/145/BPK-RI/2026) memerlukan disposisi.',
    tipe: 'warning',
    timestamp: '2026-07-05 09:00',
    read: false
  },
  {
    id: 'n2',
    judul: 'Batas Waktu Dokumen',
    pesan: 'Reminder: Laporan APBD s/d Juni ke Sekda harus segera diselesaikan (Deadline: 2026-07-09).',
    tipe: 'danger',
    timestamp: '2026-07-07 08:05',
    read: false
  },
  {
    id: 'n3',
    judul: 'Agenda Disetujui',
    pesan: 'Agenda Rapat Evaluasi Realisasi PAD Triwulan II telah disetujui Kepala Badan.',
    tipe: 'success',
    timestamp: '2026-07-06 14:00',
    read: true
  }
];

export const defaultSystemSettings: SystemSetting = {
  id: 'set1',
  instansiName: 'Badan Keuangan Daerah Kota Pangkalpinang',
  singkatanInstansi: 'BAKEUDA Kota Pangkalpinang',
  alamat: 'Jl. Merdeka No.4, Pangkalpinang, Prov. Kep. Bangka Belitung 33111',
  telepon: '(0717) 421255',
  email: 'bakeuda@pangkalpinangkota.go.id',
  website: 'https://bakeuda.pangkalpinangkota.go.id',
  kepalaBadanNama: 'Dr. Budiyanto, M.Si.',
  kepalaBadanNip: '197103151996031002',
  sekretarisNama: 'Ir. Muhammad Yusuf',
  sekretarisNip: '197509122002121004'
};
