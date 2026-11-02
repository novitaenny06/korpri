import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'korpri_db.json');
const UPLOADS_DIR = path.resolve(__dirname, 'data', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Password Hashing
function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): string {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, combined: string): boolean {
  try {
    const [salt, key] = combined.split(':');
    if (!salt || !key) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    const keyBuf = Buffer.from(key, 'hex');
    const hashBuf = Buffer.from(hash, 'hex');
    if (keyBuf.length !== hashBuf.length) return false;
    return crypto.timingSafeEqual(keyBuf, hashBuf);
  } catch {
    return false;
  }
}

// Initial Database Seeding
const defaultDbData = {
  users: [
    {
      id: 'admin-1',
      username: 'admin',
      name: 'Administrator DP KORPRI',
      passwordHash: hashPassword('korprikabsemarang2024'), // Default secure credentials
      role: 'superadmin',
    },
  ],
  settings: {
    siteName: 'Dewan Pengurus KORPRI Kabupaten Semarang',
    shortName: 'DP KORPRI Kabupaten Semarang',
    tagline: 'KORPRI Berkarya, Melayani, dan Menyatukan Bangsa',
    logoUrl: '/assets/aistudio/_Pngtree_korpri_logo_in_gold_and_8812182_2f03f2ab.png',
    heroBanner: '/assets/aistudio/Upacara_Bendera_di_Gedung_Pemerintahan__1__0b8c6b33.png',
    address: 'Kompleks Kantor Bupati Semarang, Gedung KORPRI / BKD Lt. 2, Jl. Diponegoro No. 14, Sidomulyo, Ungaran Barat, Kabupaten Semarang, Jawa Tengah 50511',
    phone: '(024) 6921014',
    email: 'korpri@semarangkab.go.id',
    instagram: '@korprikabsemarang',
    instagramUrl: 'https://instagram.com/korprikabsemarang',
    operationalHours: 'Senin - Jumat: 07.30 - 15.30 WIB',
    copyright: '© Dewan Pengurus KORPRI Kabupaten Semarang. Seluruh hak cipta dilindungi.',
    memberCount: 9480,
    unitCount: 48,
  },
  profile: {
    aboutKorpri: 'Korps Pegawai Republik Indonesia (KORPRI) didirikan pada tanggal 29 November 1971 berdasarkan Keputusan Presiden Nomor 82 Tahun 1971. KORPRI merupakan wadah berhimpun seluruh Pegawai Republik Indonesia yang independen, berdedikasi tinggi, dan profesional dalam mengabdi kepada bangsa, negara, dan masyarakat.',
    profileSemarang: 'Dewan Pengurus KORPRI Kabupaten Semarang merupakan organisasi resmi yang menaungi segenap Aparatur Sipil Negara (PNS dan PPPK) di seluruh jajaran Pemerintah Kabupaten Semarang. Berkedudukan di ibukota kabupaten di Ungaran, DP KORPRI Kabupaten Semarang aktif menyelenggarakan program pembinaan jiwa korsa, kesejahteraan anggota, santunan purna tugas, advokasi kedinasan, kegiatan sosial kemanusiaan, serta olahraga dan seni budaya.',
    pancaPrasetya: [
      'Setia dan taat kepada Negara Kesatuan dan Pemerintah Republik Indonesia yang berdasarkan Pancasila dan Undang-Undang Dasar 1945.',
      'Menjunjung tinggi kehormatan bangsa dan negara serta memegang teguh rahasia jabatan dan rahasia negara.',
      'Mengutamakan kepentingan negara dan masyarakat di atas kepentingan pribadi dan golongan.',
      'Memelihara persatuan dan kesatuan bangsa serta kesetiakawanan Korps Pegawai Republik Indonesia.',
      'Menegakkan kejujuran, keadilan, dan disiplin serta meningkatkan kesejahteraan dan profesionalisme.',
    ],
    vision: 'Terwujudnya KORPRI Kabupaten Semarang yang Solid, Netral, Profesional, Sejahtera, dan Berdaya Saing dalam Mendukung Pelayanan Publik Prima Menuju Kabupaten Semarang yang Sejahtera, Mandiri, Berakhlak, dan Berkeadilan (SEMERBAK).',
    missions: [
      'Memperkokoh soliditas, jiwa korsa, dan etika profesi ASN berlandaskan nilai inti BerAKHLAK.',
      'Meningkatkan kompetensi, integritas, dan profesionalisme anggota KORPRI Kabupaten Semarang.',
      'Mengoptimalkan program kesejahteraan, jaminan sosial, dan santunan purna tugas bagi segenap anggota.',
      'Memberikan perlindungan hukum dan advokasi yang nyata bagi aparatur sipil negara dalam pelaksanaan tugas kedinasan.',
      'Menyelenggarakan kegiatan sosial kemanusiaan, keagamaan, olahraga, dan kesenian yang inklusif serta dirasakan manfaatnya oleh masyarakat luas.',
    ],
    tasks: [
      'Menyelenggarakan pembinaan jiwa korps, integritas, netralitas, dan kesetiakawanan seluruh anggota KORPRI di lingkungan Pemerintah Kabupaten Semarang.',
      'Mengelola dan menyalurkan program bantuan kesejahteraan sosial, santunan duka, serta tali asih purna tugas.',
      'Memberikan pendampingan hukum dan konsultasi kedinasan bagi anggota yang menghadapi persoalan hukum dalam pelaksanaan kewajibannya.',
      'Mendorong peningkatan kualitas pelayanan publik melalui inovasi kerja dan pengembangan kapasitas aparatur sipil negara.',
    ],
    functions: [
      'Wadah pembinaan dan pengembangan segenap pegawai aparatur sipil negara di Kabupaten Semarang.',
      'Penyalur aspirasi, pemelihara solidaritas dan persatuan antar aparatur di seluruh unit kerja dan kecamatan.',
      'Penggerak kepedulian sosial kemasyarakatan, kegiatan donor darah, bantuan bencana alam, dan bakti sosial kemanusiaan.',
      'Pelaksana koordinasi dengan Dewan Pengurus KORPRI Provinsi Jawa Tengah dan Dewan Pengurus KORPRI Nasional.',
    ],
    workPrograms: [
      {
        title: 'Program KORPRI Peduli & Kesejahteraan Anggota',
        description: 'Penyaluran santunan tali asih purna tugas secara berkala, santunan duka/kematian, serta bantuan musibah bagi anggota KORPRI Kabupaten Semarang.',
        items: [
          'Pemberian santunan tali asih purna tugas ASN tiap triwulan di Pendopo Rumah Dinas Bupati Semarang.',
          'Penyaluran santunan rawat inap dan santunan duka bagi keluarga anggota KORPRI.',
          'Pemberian bantuan kemanusiaan tanggap bencana bagi masyarakat dan keluarga ASN yang terdampak.',
        ],
      },
      {
        title: 'Program Pembinaan Rohani, Olahraga & Seni Budaya',
        description: 'Mewujudkan anggota KORPRI yang sehat jasmani dan rohani, berjiwa korsa kuat, serta berprestasi dalam ajang olahraga dan seni.',
        items: [
          'Senam sehat berkala dan gerak jalan massal ASN Kabupaten Semarang.',
          'Penyelenggaraan Pekan Olahraga & Seni (Porseni) KORPRI tingkat kabupaten.',
          'Pengiriman kontingen atlet ASN Kabupaten Semarang pada Porseni KORPRI Tingkat Provinsi Jawa Tengah.',
          'Peringatan hari besar keagamaan dan pengajian aparatur sipil negara.',
        ],
      },
      {
        title: 'Program Kepedulian Sosial & Kemanusiaan',
        description: 'Bakti nyata KORPRI bagi masyarakat luas sebagai wujud pengabdian insan korps.',
        items: [
          'Aksi kemanusiaan donor darah serentak ASN di aula Sekretariat Daerah Ungaran.',
          'Bakti sosial pembagian sembako dan khitanan massal dalam rangka peringatan HUT KORPRI.',
          'Penanaman pohon penghijauan di wilayah lereng pegunungan Kabupaten Semarang.',
        ],
      },
      {
        title: 'Program Advokasi & Perlindungan Hukum',
        description: 'Memberikan kepastian perlindungan dan konsultasi hukum kedinasan bagi aparatur.',
        items: [
          'Sosialisasi netralitas dan etika profesi ASN dalam setiap perhelatan pesta demokrasi.',
          'Layanan konsultasi hukum dan pendampingan profesi anggota KORPRI.',
          'Penyuluhan anti korupsi dan gratifikasi bersama inspektorat daerah.',
        ],
      },
    ],
    secretariatInfo: {
      office: 'Gedung KORPRI / BKD Kabupaten Semarang Lt. 2',
      address: 'Jl. Diponegoro No. 14, Sidomulyo, Ungaran Barat, Kabupaten Semarang 50511',
      phone: '(024) 6921014 / 6921125',
      email: 'korpri@semarangkab.go.id',
      hours: 'Senin s/d Jumat, 07.30 - 15.30 WIB',
    },
  },
  officials: [
    {
      id: 'off-4',
      name: 'Drs. H. Djarot Supriyoto, M.M.',
      titleSuffix: '',
      role: 'Ketua DP KORPRI',
      category: 'harian',
      division: 'Pengurus Harian',
      agency: 'Ketua DP KORPRI Kab. Semarang / Asisten I Setda',
      order: 1,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
    {
      id: 'off-5',
      name: 'Dr. Wenny Maya Kartika, M.Si.',
      titleSuffix: '',
      role: 'Wakil Ketua I',
      category: 'harian',
      division: 'Bidang Organisasi, Kelembagaan & Disiplin',
      agency: 'Kepala BKPSDM Kabupaten Semarang',
      order: 2,
      photoUrl: '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
    },
    {
      id: 'off-6',
      name: 'Ir. Rudatin Chenkretnowati, M.Si.',
      titleSuffix: '',
      role: 'Wakil Ketua II',
      category: 'harian',
      division: 'Bidang Usaha, Kesejahteraan & Pengabdian',
      agency: 'Kepala Dinas Pertanian, Perikanan dan Pangan',
      order: 3,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
    {
      id: 'off-7',
      name: 'M. Taufiqurrahman, S.STP, M.M.',
      titleSuffix: '',
      role: 'Sekretaris',
      category: 'harian',
      division: 'Sekretariat DP KORPRI',
      agency: 'Sekretaris BKPSDM Kabupaten Semarang',
      order: 4,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
    {
      id: 'off-8',
      name: 'Sri Wahyuni, S.Sos., M.Si.',
      titleSuffix: '',
      role: 'Wakil Sekretaris',
      category: 'harian',
      division: 'Sekretariat DP KORPRI',
      agency: 'Kepala Bagian Organisasi Setda Kab. Semarang',
      order: 5,
      photoUrl: '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
    },
    {
      id: 'off-9',
      name: 'Dra. Hj. Enny Setyowati, M.M.',
      titleSuffix: '',
      role: 'Bendahara',
      category: 'harian',
      division: 'Pengelolaan Keuangan & Iuran',
      agency: 'Kepala BKD Kabupaten Semarang',
      order: 6,
      photoUrl: '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
    },
    {
      id: 'off-10',
      name: 'Bambang Sulistiyono, S.H.',
      titleSuffix: '',
      role: 'Koordinator',
      category: 'bidang',
      division: 'Bidang Organisasi dan Kelembagaan',
      agency: 'Inspektorat Kabupaten Semarang',
      order: 7,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
    {
      id: 'off-11',
      name: 'Tri Martono, S.H., M.M.',
      titleSuffix: '',
      role: 'Koordinator',
      category: 'bidang',
      division: 'Bidang Pembinaan Jiwa Korps dan Disiplin',
      agency: 'Satpol PP dan Damkar Kabupaten Semarang',
      order: 8,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
    {
      id: 'off-12',
      name: 'Joko Lestari, S.E., M.M.',
      titleSuffix: '',
      role: 'Koordinator',
      category: 'bidang',
      division: 'Bidang Usaha dan Kesejahteraan',
      agency: 'Dinas Koperasi, UMKM, Perindag',
      order: 9,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
    {
      id: 'off-13',
      name: 'Drs. H. Nur Kholis, M.Pd.',
      titleSuffix: '',
      role: 'Koordinator',
      category: 'bidang',
      division: 'Bidang Rohani, Olahraga, dan Seni Budaya',
      agency: 'Dinas Pendidikan, Kebudayaan, Kepemudaan dan Olahraga',
      order: 10,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
    {
      id: 'off-14',
      name: 'Danang Purnomo, S.H., M.H.',
      titleSuffix: '',
      role: 'Koordinator',
      category: 'bidang',
      division: 'Bidang Bantuan Hukum dan HAM',
      agency: 'Bagian Hukum Setda Kabupaten Semarang',
      order: 11,
      photoUrl: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
    },
  ],
  activities: [
    {
      id: 'act-1',
      title: 'Upacara Penyerahan Santunan Purna Tugas dan Tali Asih KORPRI Kabupaten Semarang Tahun 2024',
      slug: 'upacara-penyerahan-santunan-purna-tugas-dan-tali-asih-korpri-2024',
      category: 'Sosial & Kesejahteraan',
      date: '2024-10-18',
      location: 'Gedung Pertemuan Graha KORPRI / Pendopo Rumah Dinas Bupati, Ungaran',
      coverImage: '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
      content: `UNGARAN - Dewan Pengurus Korps Pegawai Republik Indonesia (KORPRI) Kabupaten Semarang kembali menyelenggarakan Upacara Penyerahan Santunan Purna Tugas dan Tali Asih bagi Aparatur Sipil Negara (ASN) di lingkungan Pemerintah Kabupaten Semarang yang telah purna tugas.

Penyerahan tali asih secara simbolis dipimpin langsung oleh jajaran pengurus DP KORPRI Kabupaten Semarang disaksikan para kepala Organisasi Perangkat Daerah (OPD). Pada periode ini, sebanyak 142 orang PNS purna tugas menerima penghargaan serta santunan sebagai bentuk apresiasi dan penghormatan setinggi-tingginya atas dedikasi dan loyalitas yang telah dicurahkan selama berpuluh-puluh tahun mengabdi bagi kemajuan Bumi Serasi Kabupaten Semarang.

Ketua DP KORPRI Kabupaten Semarang menyampaikan bahwa santunan tali asih ini bersumber dari iuran kebersamaan anggota KORPRI yang dikelola secara amanah, akuntabel, dan transparan. "KORPRI adalah rumah besar kita bersama. Menjelang masa purna, organisasi berkomitmen terus mendampingi agar silaturahmi tetap terjalin erat dan para purna ASN tetap dapat berkarya di tengah masyarakat," ujarnya dalam sambutan.

Para purna tugas juga mendapatkan penjelasan mengenai kemudahan administrasi klaim Taspen serta program wirausaha produktif purna tugas yang diinisiasi KORPRI bekerja sama dengan Bank Jateng Cabang Ungaran.`,
      galleryImages: [
        '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
        '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
        '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
      ],
      author: 'Humas DP KORPRI Kab. Semarang',
      publishedAt: '2024-10-19T08:30:00.000Z',
      isPublished: true,
    },
    {
      id: 'act-2',
      title: 'Aksi Kemanusiaan Donor Darah ASN KORPRI Kabupaten Semarang Peduli Sesama',
      slug: 'aksi-kemanusiaan-donor-darah-asn-korpri-kabupaten-semarang-peduli-sesama',
      category: 'Sosial & Kesejahteraan',
      date: '2024-11-12',
      location: 'Aula Sekretariat Daerah Kabupaten Semarang, Ungaran',
      coverImage: '/src/assets/images/kegiatan_donor_darah_1793022976420.jpg',
      content: `UNGARAN - Sebagai wujud kepedulian sosial dan solidaritas kemanusiaan, Dewan Pengurus KORPRI Kabupaten Semarang menggelar bakti sosial Donor Darah Korpri bekerja sama dengan Unit Donor Darah Palang Merah Indonesia (PMI) Kabupaten Semarang.

Kegiatan yang berlangsung di Aula Kantor Sekretariat Daerah Kabupaten Semarang di Ungaran ini diikuti dengan antusias oleh ratusan aparatur sipil negara dari berbagai badan, dinas, kantor, serta perwakilan kantor kecamatan.

Koordinator Bidang Sosial KORPRI menjelaskan bahwa aksi donor darah ini merupakan agenda rutin yang diselenggarakan dalam rangkaian peringatan Hari Ulang Tahun (HUT) KORPRI. Dari target awal 150 kantong, tercatat sebanyak 240 ASN yang mendaftar dan berhasil terkumpul 215 kantong darah yang siap disalurkan ke rumah sakit dan fasilitas kesehatan yang membutuhkan di wilayah Kabupaten Semarang.

"Setetes darah yang disumbangkan oleh bapak ibu anggota KORPRI hari ini adalah bukti nyata komitmen ASN bukan hanya melayani secara administratif di kantor, melainkan hadir menolong sesama yang sedang berjuang melawan sakit," ungkap panitia pelaksana di sela-sela kegiatan.`,
      galleryImages: [
        '/src/assets/images/kegiatan_donor_darah_1793022976420.jpg',
        '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
      ],
      author: 'Redaksi KORPRI Kab. Semarang',
      publishedAt: '2024-11-13T09:15:00.000Z',
      isPublished: true,
    },
    {
      id: 'act-3',
      title: 'Apel Bersama Peringatan HUT KORPRI ke-53 Tingkat Kabupaten Semarang Khidmat dan Semarak',
      slug: 'apel-bersama-peringatan-hut-korpri-ke-53-tingkat-kabupaten-semarang',
      category: 'Upacara',
      date: '2024-11-29',
      location: 'Halaman Kompleks Kantor Bupati Semarang, Jl. Diponegoro Ungaran',
      coverImage: '/src/assets/images/kegiatan_upacara_korpri_1793022976404.jpg',
      content: `UNGARAN - Ribuan Pegawai Negeri Sipil dan PPPK di lingkungan Pemerintah Kabupaten Semarang memadati Halaman Kantor Bupati Semarang untuk mengikuti Upacara Peringatan Hari Ulang Tahun ke-53 Korps Pegawai Republik Indonesia (KORPRI).

Bertindak selaku inspektur upacara membacakan sambutan Ketua Umum Dewan Pengurus KORPRI Nasional yang menggarisbawahi pentingnya netralitas, integritas, dan percepatan adaptasi teknologi digital bagi segenap anggota KORPRI demi memberikan pelayanan publik yang semakin mudah, cepat, dan transparan.

Pada kesempatan apel akbar tersebut, diserahkan pula penghargaan Satyalancana Karya Satya dari Presiden Republik Indonesia kepada ASN dengan masa pengabdian 10, 20, dan 30 tahun, serta penghargaan bagi Unit KORPRI Perangkat Daerah terbaik dalam penegakan disiplin dan partisipasi kegiatan keorganisasian.

Upacara diakhiri dengan persembahan lagu mars KORPRI oleh Paduan Suara KORPRI Kabupaten Semarang dan pemotongan tumpeng syukuran HUT KORPRI.`,
      galleryImages: [
        '/src/assets/images/kegiatan_upacara_korpri_1793022976404.jpg',
        '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
      ],
      author: 'Humas DP KORPRI Kab. Semarang',
      publishedAt: '2024-11-29T11:00:00.000Z',
      isPublished: true,
    },
    {
      id: 'act-4',
      title: 'Semarak Porseni dan Senam Sehat Bersama KORPRI Kabupaten Semarang di Kawasan Wisata Bandungan',
      slug: 'semarak-porseni-dan-senam-sehat-bersama-korpri-kabupaten-semarang',
      category: 'Olahraga & Seni',
      date: '2024-09-20',
      location: 'Kawasan Wisata & Olahraga Bandungan, Kabupaten Semarang',
      coverImage: '/src/assets/images/kegiatan_senam_olahraga_1793022977361.jpg',
      content: `BANDUNGAN - Ratusan aparatur sipil negara dari 48 Organisasi Perangkat Daerah (OPD) dan 19 Kecamatan di Kabupaten Semarang tumpah ruah mengikuti Senam Sehat Massal KORPRI sekaligus pembukaan Pekan Olahraga dan Seni (Porseni) KORPRI Tingkat Kabupaten Semarang.

Kegiatan yang dibuka langsung oleh jajaran pengurus KORPRI Kabupaten Semarang ini bertujuan membudayakan gaya hidup sehat jasmani dan rohani bagi seluruh aparatur negara, serta mempererat tali silaturahmi lintas instansi di tengah kesibukan rutinitas kedinasan.

Adapun cabang olahraga dan seni yang dipertandingkan dalam Porseni KORPRI Kabupaten Semarang tahun ini antara lain bulu tangkis, tenis meja, catur, bola voli, senam kreasi, serta lomba pengucapan Panca Prasetya Korpri dan paduan suara. Para juara nantinya akan mewakili kontingen Kabupaten Semarang pada ajang Porseni KORPRI Tingkat Jawa Tengah.`,
      galleryImages: [
        '/src/assets/images/kegiatan_senam_olahraga_1793022977361.jpg',
        '/src/assets/images/kegiatan_upacara_korpri_1793022976404.jpg',
      ],
      author: 'Bidang Olahraga DP KORPRI',
      publishedAt: '2024-09-21T10:00:00.000Z',
      isPublished: true,
    },
    {
      id: 'act-5',
      title: 'Rapat Kerja Dewan Pengurus KORPRI Kabupaten Semarang: Penguatan Integritas dan Tata Kelola Digital',
      slug: 'rapat-kerja-dewan-pengurus-korpri-kabupaten-semarang-tata-kelola-digital',
      category: 'Rapat Kerja',
      date: '2025-01-15',
      location: 'Ruang Rapat Graha KORPRI Ungaran',
      coverImage: '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
      content: `UNGARAN - Dewan Pengurus KORPRI Kabupaten Semarang menggelar Rapat Kerja Evaluasi Tahunan dan Penetapan Program Prioritas. Rapat dipimpin langsung oleh Ketua DP KORPRI Kabupaten Semarang didampingi segenap ketua bidang dan koordinator perwakilan unit KORPRI OPD.

Fokus utama rapat kerja kali ini adalah penguatan digitalisasi sistem administrasi iuran anggota, perluasan jangkauan program santunan duka dan pensiun, serta advokasi perlindungan profesi ASN dalam menghadapi dinamika regulasi kepegawaian terkini.

Ketua DP KORPRI menegaskan bahwa organisasi harus terus adaptif, transparan, dan memberikan kemanfaatan konkret yang dirasakan langsung oleh setiap anggotanya hingga di pelosok unit kerja kecamatan dan kelurahan/desa.`,
      galleryImages: [
        '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
        '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
      ],
      author: 'Sekretariat DP KORPRI',
      publishedAt: '2025-01-16T14:00:00.000Z',
      isPublished: true,
    },
  ],
  agendas: [
    {
      id: 'age-1',
      title: 'Upacara Peringatan Hari Jadi KORPRI ke-55 & Penyerahan Satyalancana Karya Satya',
      date: '2026-11-29',
      time: '07.30 - 10.30 WIB',
      location: 'Halaman Kantor Bupati Semarang, Jl. Diponegoro No. 14 Ungaran',
      description: 'Upacara bendera peringatan Hari KORPRI dihadiri seluruh perwakilan OPD dan kecamatan se-Kabupaten Semarang dengan mengenakan seragam resmi Batik KORPRI.',
      status: 'akan_datang',
    },
    {
      id: 'age-2',
      title: 'Penyaluran Santunan Tali Asih Purna Tugas ASN Triwulan IV Tahun 2026',
      date: '2026-12-15',
      time: '08.30 - 12.00 WIB',
      location: 'Pendopo Rumah Dinas Bupati Semarang, Ungaran',
      description: 'Penyerahan tali asih dan piagam penghargaan bagi 130 aparatur sipil negara yang purna tugas periode Oktober - Desember 2026.',
      status: 'akan_datang',
    },
    {
      id: 'age-3',
      title: 'Aksi Donor Darah Massal KORPRI Peduli Sesama Bekerjasama dengan PMI',
      date: '2026-11-10',
      time: '08.00 - 13.00 WIB',
      location: 'Aula Sekretariat Daerah Kabupaten Semarang, Ungaran',
      description: 'Donor darah massal untuk ASN Pemkab Semarang dalam menyambut rangkaian HUT KORPRI. Terbuka untuk seluruh pegawai dan masyarakat sekitar.',
      status: 'akan_datang',
    },
    {
      id: 'age-4',
      title: 'Sosialisasi Tabungan Hari Tua dan Layanan Taspen Terintegrasi ASN KORPRI',
      date: '2026-08-14',
      time: '08.30 - 13.00 WIB',
      location: 'Aula BKD / Diskominfo Kabupaten Semarang, Ungaran',
      description: 'Sosialisasi kepengurusan hak pensiun dini dan program perlindungan hari tua kerja sama DP KORPRI dan PT Taspen.',
      status: 'selesai',
    },
    {
      id: 'age-5',
      title: 'Seleksi Kontingen Porseni KORPRI Tingkat Kabupaten Semarang',
      date: '2026-07-22',
      time: '08.00 - 16.00 WIB',
      location: 'GOR Pandanaran Ungaran',
      description: 'Penyaringan atlet cabang bulu tangkis, tenis meja, dan catur untuk kontingen KORPRI Kabupaten Semarang.',
      status: 'selesai',
    },
  ],
  galleries: [
    {
      id: 'gal-1',
      title: 'Dokumentasi Upacara dan Apel HUT KORPRI Kabupaten Semarang',
      date: '2024-11-29',
      category: 'Upacara & Apel',
      coverImage: '/src/assets/images/kegiatan_upacara_korpri_1793022976404.jpg',
      description: 'Momen kebersamaan dan kedisiplinan jajaran ASN Pemkab Semarang dalam upacara bendera memperingati HUT KORPRI di Ungaran.',
      images: [
        {
          id: 'img-1',
          url: '/src/assets/images/kegiatan_upacara_korpri_1793022976404.jpg',
          caption: 'Barisan khidmat peserta apel KORPRI di halaman Kantor Bupati Semarang',
        },
        {
          id: 'img-2',
          url: '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
          caption: 'Suasana pembukaan sidang paripurna peringatan hari KORPRI',
        },
        {
          id: 'img-3',
          url: '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
          caption: 'Ketua DP KORPRI Kabupaten Semarang memberikan arahan disiplin',
        },
      ],
    },
    {
      id: 'gal-2',
      title: 'Penyaluran Santunan Tali Asih Purna Tugas KORPRI',
      date: '2024-10-18',
      category: 'Sosial & Kesejahteraan',
      coverImage: '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
      description: 'Penghormatan dan pemberian tali asih bagi para purna tugas ASN Kabupaten Semarang atas jasa pengabdiannya.',
      images: [
        {
          id: 'img-4',
          url: '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
          caption: 'Penyerahan simbolis piagam penghargaan dan santunan tali asih kepada perwakilan purna tugas',
        },
        {
          id: 'img-5',
          url: '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
          caption: 'Foto bersama jajaran dewan pengurus KORPRI dan para purna bhakti',
        },
      ],
    },
    {
      id: 'gal-3',
      title: 'Aksi Kemanusiaan Donor Darah KORPRI Peduli Sesama',
      date: '2024-11-12',
      category: 'Sosial & Kemanusiaan',
      coverImage: '/src/assets/images/kegiatan_donor_darah_1793022976420.jpg',
      description: 'Aksi donor darah sukarela ratusan ASN Kabupaten Semarang bekerja sama dengan UDD Palang Merah Indonesia.',
      images: [
        {
          id: 'img-6',
          url: '/src/assets/images/kegiatan_donor_darah_1793022976420.jpg',
          caption: 'Antusiasme pegawai negeri sipil mendonorkan darah di aula Setda',
        },
        {
          id: 'img-7',
          url: '/src/assets/images/kegiatan_penyerahan_taliasih_1793023008002.jpg',
          caption: 'Pemeriksaan kesehatan awal sebelum pelaksanaan donor darah',
        },
      ],
    },
    {
      id: 'gal-4',
      title: 'Pekan Olahraga dan Senam Bersama ASN Kabupaten Semarang',
      date: '2024-09-20',
      category: 'Olahraga & Seni',
      coverImage: '/src/assets/images/kegiatan_senam_olahraga_1793022977361.jpg',
      description: 'Semarak olahraga pagi dan perlombaan persahabatan antar OPD di kawasan Bandungan Kabupaten Semarang.',
      images: [
        {
          id: 'img-8',
          url: '/src/assets/images/kegiatan_senam_olahraga_1793022977361.jpg',
          caption: 'Gerak senam bugar massal yang diikuti ratusan ASN di kawasan sejuk lereng gunung',
        },
        {
          id: 'img-9',
          url: '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
          caption: 'Pelepasan kontingen olahraga KORPRI Kabupaten Semarang',
        },
      ],
    },
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Surat Edaran: Ketentuan Penggunaan Pakaian Seragam Batik KORPRI Terbaru dan Kelengkapannya',
      category: 'surat_edaran',
      documentNumber: 'SE/028/DP-KORPRI/X/2024',
      date: '2024-10-05',
      fileName: 'SE_Seragam_Batik_KORPRI_Kab_Semarang.pdf',
      fileSize: '1.4 MB',
      fileUrl: '#download-se-seragam',
      description: 'Pedoman resmi pemakaian seragam batik KORPRI motif baru berserat emas dan kelengkapan lencana pin serta peci nasional pada upacara bendera dan tanggal 17 setiap bulan.',
      downloadCount: 428,
    },
    {
      id: 'ann-2',
      title: 'Pengumuman: Mekanisme dan Kelengkapan Berkas Klaim Santunan Purna Tugas & Duka Anggota KORPRI',
      category: 'pengumuman',
      documentNumber: 'PENG/012/DP-KORPRI/2024',
      date: '2024-09-18',
      fileName: 'Panduan_Klaim_Santunan_Korpri_2024.pdf',
      fileSize: '890 KB',
      fileUrl: '#download-klaim-santunan',
      description: 'Tata cara, formulir, dan persyaratan administrasi pengajuan bantuan santunan purna tugas bagi PNS/PPPK yang memasuki batas usia pensiun.',
      downloadCount: 615,
    },
    {
      id: 'ann-3',
      title: 'Pedoman Penegakan Netralitas Pegawai ASN Anggota KORPRI Kabupaten Semarang',
      category: 'surat_edaran',
      documentNumber: 'SE/035/DP-KORPRI/XI/2024',
      date: '2024-11-01',
      fileName: 'SE_Netralitas_ASN_Korpri_Semarang.pdf',
      fileSize: '2.1 MB',
      fileUrl: '#download-netralitas',
      description: 'Instruksi menjaga netralitas, integritas, dan kode etik aparatur sipil negara dalam penyelenggaraan pemilu dan pilkada.',
      downloadCount: 310,
    },
    {
      id: 'ann-4',
      title: 'Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) KORPRI Hasil Musyawarah Nasional',
      category: 'dokumen',
      documentNumber: 'KEP-MUNAS/IX/KORPRI',
      date: '2024-01-10',
      fileName: 'AD_ART_KORPRI_Nasional.pdf',
      fileSize: '3.6 MB',
      fileUrl: '#download-ad-art',
      description: 'Dokumen lengkap landasan konstitusional, kelembagaan, hak dan kewajiban anggota Korps Pegawai Republik Indonesia.',
      downloadCount: 890,
    },
  ],
  messages: [
    {
      id: 'msg-1',
      name: 'Budi Raharjo',
      email: 'budi.raharjo@gmail.com',
      phone: '081234567890',
      subject: 'Pertanyaan Syarat Pengajuan Santunan Purna Tugas',
      message: 'Selamat pagi admin Korpri Kabupaten Semarang. Saya ingin menanyakan apakah SK Pensiun asli wajib dibawa saat pengambilan tali asih di Gedung Korpri Ungaran? Terima kasih.',
      createdAt: '2026-10-20T09:20:00.000Z',
      read: true,
    },
  ],
};

// Database persistence helper
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(defaultDbData);
      return defaultDbData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using default data:', err);
    return defaultDbData;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

// Ensure DB exists on boot
readDb();

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Auth Token Store (simple secure in-memory sessions)
const activeSessions = new Set<string>();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ error: 'Sesi administrator tidak sah atau telah berakhir. Silakan login kembali.' });
  }
  next();
}

// API Routes

// 1. Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  const db = readDb();
  const user = db.users.find((u: any) => u.username.toLowerCase() === username.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Username atau password yang Anda masukkan salah.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.add(token);

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token) {
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Berhasil keluar.' });
});

app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token && activeSessions.has(token)) {
    const db = readDb();
    const user = db.users[0];
    return res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  }
  return res.status(401).json({ valid: false });
});

app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal harus 6 karakter.' });
  }

  const db = readDb();
  const user = db.users[0];
  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Password lama Anda tidak sesuai.' });
  }

  user.passwordHash = hashPassword(newPassword);
  writeDb(db);
  return res.json({ success: true, message: 'Password administrator berhasil diperbarui.' });
});

// 2. Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.settings);
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  return res.json({ success: true, data: db.settings });
});

// 3. Profile
app.get('/api/profile', (req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.profile);
});

app.put('/api/profile', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.profile = { ...db.profile, ...req.body };
  writeDb(db);
  return res.json({ success: true, data: db.profile });
});

// 4. Officials / Pengurus
app.get('/api/officials', (req: Request, res: Response) => {
  const db = readDb();
  const sorted = [...db.officials].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  return res.json(sorted);
});

app.post('/api/officials', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newOfficial = {
    id: 'off-' + Date.now(),
    name: req.body.name,
    titleSuffix: req.body.titleSuffix || '',
    role: req.body.role,
    category: req.body.category || 'bidang',
    division: req.body.division || '',
    agency: req.body.agency || '',
    order: parseInt(req.body.order, 10) || db.officials.length + 1,
    photoUrl: req.body.photoUrl || '/src/assets/images/ketua_dp_korpri_1793023021428.jpg',
  };
  db.officials.push(newOfficial);
  writeDb(db);
  return res.status(201).json(newOfficial);
});

app.put('/api/officials/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = db.officials.findIndex((o: any) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Pengurus tidak ditemukan.' });

  db.officials[index] = { ...db.officials[index], ...req.body, id: req.params.id };
  writeDb(db);
  return res.json(db.officials[index]);
});

app.delete('/api/officials/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.officials = db.officials.filter((o: any) => o.id !== req.params.id);
  writeDb(db);
  return res.json({ success: true, message: 'Pengurus berhasil dihapus.' });
});

app.put('/api/officials/reorder/batch', requireAdmin, (req: Request, res: Response) => {
  const { orderList } = req.body; // array of { id, order }
  if (!Array.isArray(orderList)) return res.status(400).json({ error: 'Invalid order list' });

  const db = readDb();
  const orderMap = new Map<string, number>();
  orderList.forEach((item: any) => orderMap.set(item.id, item.order));

  db.officials.forEach((off: any) => {
    if (orderMap.has(off.id)) {
      off.order = orderMap.get(off.id);
    }
  });
  writeDb(db);
  return res.json({ success: true });
});

// 5. Activities / Berita
app.get('/api/activities', (req: Request, res: Response) => {
  const db = readDb();
  let list = db.activities || [];

  // Filter public view vs admin view
  const includeUnpublished = req.query.admin === 'true';
  if (!includeUnpublished) {
    list = list.filter((a: any) => a.isPublished !== false);
  }

  // Search
  const search = (req.query.search as string || '').toLowerCase().trim();
  if (search) {
    list = list.filter((a: any) =>
      a.title.toLowerCase().includes(search) ||
      a.content.toLowerCase().includes(search) ||
      (a.location && a.location.toLowerCase().includes(search))
    );
  }

  // Category filter
  const category = req.query.category as string;
  if (category && category !== 'Semua') {
    list = list.filter((a: any) => a.category === category);
  }

  // Year filter
  const year = req.query.year as string;
  if (year && year !== 'Semua') {
    list = list.filter((a: any) => (a.date || '').startsWith(year));
  }

  // Sort descending by date
  list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return res.json(list);
});

app.get('/api/activities/:slugOrId', (req: Request, res: Response) => {
  const db = readDb();
  const item = db.activities.find(
    (a: any) => a.slug === req.params.slugOrId || a.id === req.params.slugOrId
  );
  if (!item) return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });
  return res.json(item);
});

app.post('/api/activities', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const title = req.body.title || 'Kegiatan Tanpa Judul';
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const newActivity = {
    id: 'act-' + Date.now(),
    title,
    slug,
    category: req.body.category || 'Berita',
    date: req.body.date || new Date().toISOString().split('T')[0],
    location: req.body.location || 'Kabupaten Semarang',
    coverImage: req.body.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
    content: req.body.content || '',
    galleryImages: Array.isArray(req.body.galleryImages) ? req.body.galleryImages : [],
    author: req.body.author || 'Humas DP KORPRI Kab. Semarang',
    publishedAt: new Date().toISOString(),
    isPublished: req.body.isPublished !== false,
  };

  db.activities.unshift(newActivity);
  writeDb(db);
  return res.status(201).json(newActivity);
});

app.put('/api/activities/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = db.activities.findIndex((a: any) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Kegiatan tidak ditemukan.' });

  db.activities[index] = { ...db.activities[index], ...req.body, id: req.params.id };
  writeDb(db);
  return res.json(db.activities[index]);
});

app.delete('/api/activities/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.activities = db.activities.filter((a: any) => a.id !== req.params.id);
  writeDb(db);
  return res.json({ success: true, message: 'Kegiatan berhasil dihapus.' });
});

// 6. Agendas
app.get('/api/agendas', (req: Request, res: Response) => {
  const db = readDb();
  const today = new Date().toISOString().split('T')[0];

  // Auto calculate status based on date
  const agendas = (db.agendas || []).map((ag: any) => {
    let computedStatus = ag.status;
    if (ag.date < today) {
      computedStatus = 'selesai';
    } else {
      computedStatus = 'akan_datang';
    }
    return { ...ag, status: computedStatus };
  });

  agendas.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return res.json(agendas);
});

app.post('/api/agendas', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newAgenda = {
    id: 'age-' + Date.now(),
    title: req.body.title,
    date: req.body.date,
    time: req.body.time || '08.00 WIB - Selesai',
    location: req.body.location || 'Kabupaten Semarang',
    description: req.body.description || '',
    status: req.body.status || 'akan_datang',
  };
  db.agendas.push(newAgenda);
  writeDb(db);
  return res.status(201).json(newAgenda);
});

app.put('/api/agendas/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = db.agendas.findIndex((a: any) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Agenda tidak ditemukan.' });

  db.agendas[index] = { ...db.agendas[index], ...req.body, id: req.params.id };
  writeDb(db);
  return res.json(db.agendas[index]);
});

app.delete('/api/agendas/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.agendas = db.agendas.filter((a: any) => a.id !== req.params.id);
  writeDb(db);
  return res.json({ success: true, message: 'Agenda berhasil dihapus.' });
});

// 7. Galleries
app.get('/api/galleries', (req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.galleries || []);
});

app.post('/api/galleries', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newAlbum = {
    id: 'gal-' + Date.now(),
    title: req.body.title,
    date: req.body.date || new Date().toISOString().split('T')[0],
    category: req.body.category || 'Dokumentasi',
    coverImage: req.body.coverImage || '/src/assets/images/hero_korpri_semarang_1793022975960.jpg',
    description: req.body.description || '',
    images: Array.isArray(req.body.images) ? req.body.images : [],
  };
  db.galleries.unshift(newAlbum);
  writeDb(db);
  return res.status(201).json(newAlbum);
});

app.put('/api/galleries/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = db.galleries.findIndex((g: any) => g.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Album galeri tidak ditemukan.' });

  db.galleries[index] = { ...db.galleries[index], ...req.body, id: req.params.id };
  writeDb(db);
  return res.json(db.galleries[index]);
});

app.delete('/api/galleries/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.galleries = db.galleries.filter((g: any) => g.id !== req.params.id);
  writeDb(db);
  return res.json({ success: true, message: 'Album galeri berhasil dihapus.' });
});

// 8. Announcements & Documents
app.get('/api/announcements', (req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.announcements || []);
});

app.post('/api/announcements', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newAnn = {
    id: 'ann-' + Date.now(),
    title: req.body.title,
    category: req.body.category || 'pengumuman',
    documentNumber: req.body.documentNumber || '',
    date: req.body.date || new Date().toISOString().split('T')[0],
    fileName: req.body.fileName || 'Dokumen_Resmi_KORPRI.pdf',
    fileSize: req.body.fileSize || '1.2 MB',
    fileUrl: req.body.fileUrl || '#unduh',
    description: req.body.description || '',
    downloadCount: 0,
  };
  db.announcements.unshift(newAnn);
  writeDb(db);
  return res.status(201).json(newAnn);
});

app.put('/api/announcements/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const index = db.announcements.findIndex((a: any) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Pengumuman tidak ditemukan.' });

  db.announcements[index] = { ...db.announcements[index], ...req.body, id: req.params.id };
  writeDb(db);
  return res.json(db.announcements[index]);
});

app.delete('/api/announcements/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.announcements = db.announcements.filter((a: any) => a.id !== req.params.id);
  writeDb(db);
  return res.json({ success: true, message: 'Pengumuman berhasil dihapus.' });
});

// 9. Public Contact Messages
app.get('/api/messages', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  return res.json(db.messages || []);
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi.' });
  }

  const db = readDb();
  if (!db.messages) db.messages = [];
  const newMsg = {
    id: 'msg-' + Date.now(),
    name: name.trim(),
    email: email.trim(),
    phone: (phone || '').trim(),
    subject: (subject || 'Pesan Melalui Website KORPRI').trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.messages.unshift(newMsg);
  writeDb(db);
  return res.status(201).json({ success: true, message: 'Pesan Anda telah berhasil dikirimkan ke Sekretariat DP KORPRI Kabupaten Semarang.' });
});

app.delete('/api/messages/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  db.messages = (db.messages || []).filter((m: any) => m.id !== req.params.id);
  writeDb(db);
  return res.json({ success: true });
});

// 10. File Upload (Store base64 / generated file)
app.post('/api/upload', requireAdmin, (req: Request, res: Response) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl) {
    return res.status(400).json({ error: 'Data URL gambar tidak boleh kosong.' });
  }

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already a path or standard url, return as is
      return res.json({ url: dataUrl });
    }

    const ext = matches[1].includes('png') ? 'png' : matches[1].includes('webp') ? 'webp' : 'jpg';
    const cleanFileName = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, cleanFileName);
    fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

    return res.json({
      url: `/data/uploads/${cleanFileName}`,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Gagal mengunggah gambar: ' + err.message });
  }
});

// Serve uploaded assets
app.use('/data/uploads', express.static(UPLOADS_DIR));

// 11. Database Backup & Restore
app.get('/api/backup/export', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=korpri_semarang_backup_${Date.now()}.json`);
  return res.send(JSON.stringify(db, null, 2));
});

app.post('/api/backup/restore', requireAdmin, (req: Request, res: Response) => {
  const { backupData } = req.body;
  if (!backupData || !backupData.settings || !backupData.profile) {
    return res.status(400).json({ error: 'Format data cadangan (backup) tidak valid.' });
  }

  writeDb(backupData);
  return res.json({ success: true, message: 'Database KORPRI Kabupaten Semarang berhasil dipulihkan.' });
});

// Summary stats for Dashboard
app.get('/api/stats', requireAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const today = new Date().toISOString().split('T')[0];
  const upcomingAgendas = (db.agendas || []).filter((a: any) => a.date >= today).length;
  const unreadMessages = (db.messages || []).filter((m: any) => !m.read).length;

  return res.json({
    totalActivities: (db.activities || []).length,
    totalAgendas: (db.agendas || []).length,
    upcomingAgendas,
    totalOfficials: (db.officials || []).length,
    totalGalleries: (db.galleries || []).length,
    totalAnnouncements: (db.announcements || []).length,
    unreadMessages,
  });
});

// Mount Vite or serve static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DP KORPRI Kab. Semarang] Server listening on port ${PORT}`);
  });
}

startServer();
