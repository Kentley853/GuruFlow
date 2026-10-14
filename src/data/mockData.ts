import {
  Task,
  ExtractedInboxMessage,
  LessonPlan,
  Worksheet,
  ParentCommunication,
  Student,
  ApprovalItem,
  PilotMetrics,
  WorkloadDistributionDay,
} from '../types';

export const INITIAL_SCHOOL_MESSAGE: ExtractedInboxMessage = {
  id: 'msg-01',
  sender: 'Bapak Dr. Hendra Wijaya, M.Pd.',
  senderRole: 'Kepala Sekolah Cakrawala Jakarta',
  date: 'Hari ini, 07.45 WIB',
  content:
    'Mohon seluruh wali kelas mengumpulkan rekap nilai, catatan perkembangan siswa, dan rancangan kegiatan Hari Literasi paling lambat Jumat pukul 15.00.',
  isProcessed: false,
  reasoning:
    'Sistem menganalisis 3 sub-tugas berurutan: Rekap nilai diprioritaskan terlebih dahulu (Kamis) agar menjadi dasar catatan perkembangan siswa (Jumat pagi), disusul rancangan kegiatan Hari Literasi sebelum batas akhir Jumat sore.',
  tasks: [
    {
      id: 'task-msg-1',
      title: 'Periksa dan lengkapi rekap nilai',
      description:
        'Validasi nilai formatif matematika dan IPAS semester berjalan kelas 5A dari buku nilai harian.',
      category: 'Asesmen & Penilaian',
      deadline: 'Kamis, 16.00',
      deadlineDate: '2026-10-15T16:00:00',
      estimatedMinutes: 45,
      priority: 'tinggi',
      status: 'belum_mulai',
      classRoom: '5A',
      subject: 'Matematika & IPAS',
      source: 'Pesan Kepala Sekolah',
      needsApproval: true,
      isAiGenerated: true,
      createdAt: '2026-10-14T07:45:00',
    },
    {
      id: 'task-msg-2',
      title: 'Buat catatan perkembangan siswa',
      description:
        'Tuliskan narasi kemajuan belajar dan afektif untuk 24 siswa 5A berdasarkan hasil asesmen.',
      category: 'Administrasi Wali Kelas',
      deadline: 'Jumat, 11.00',
      deadlineDate: '2026-10-16T11:00:00',
      estimatedMinutes: 60,
      priority: 'tinggi',
      status: 'belum_mulai',
      classRoom: '5A',
      source: 'Pesan Kepala Sekolah',
      needsApproval: true,
      isAiGenerated: true,
      createdAt: '2026-10-14T07:45:00',
    },
    {
      id: 'task-msg-3',
      title: 'Siapkan rancangan Hari Literasi',
      description:
        'Susun rundown 60 menit sesi membaca terbimbing dan presentasi buku mini kelas 5A.',
      category: 'Kegiatan Sekolah',
      deadline: 'Jumat, 15.00',
      deadlineDate: '2026-10-16T15:00:00',
      estimatedMinutes: 40,
      priority: 'sedang',
      status: 'belum_mulai',
      classRoom: '5A',
      subject: 'Bahasa Indonesia & Literasi',
      source: 'Pesan Kepala Sekolah',
      needsApproval: true,
      isAiGenerated: true,
      createdAt: '2026-10-14T07:45:00',
    },
  ],
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Periksa asesmen formatif matematika 5A',
    description:
      'Analisis lembar kerja perbandingan pecahan dari 24 siswa untuk memetakan pemahaman konsep.',
    category: 'Asesmen & Penilaian',
    deadline: 'Hari ini, 15.30',
    deadlineDate: '2026-10-14T15:30:00',
    estimatedMinutes: 40,
    priority: 'tinggi',
    status: 'sedang_dikerjakan',
    classRoom: '5A',
    subject: 'Matematika',
    source: 'Rutin Mengajar',
    needsApproval: false,
    isAiGenerated: false,
    createdAt: '2026-10-13T09:00:00',
  },
  {
    id: 'task-2',
    title: 'Siapkan pesan evaluasi mingguan orang tua',
    description:
      'Kirimkan rangkuman pencapaian belajar mingguan untuk 4 siswa prioritas via WhatsApp.',
    category: 'Komunikasi Orang Tua',
    deadline: 'Rabu, 16.00',
    deadlineDate: '2026-10-14T16:00:00',
    estimatedMinutes: 30,
    priority: 'sedang',
    status: 'menunggu_persetujuan',
    classRoom: '5A',
    source: 'Rutin Wali Kelas',
    needsApproval: true,
    isAiGenerated: true,
    createdAt: '2026-10-14T08:10:00',
  },
  {
    id: 'task-3',
    title: 'Lengkapi Modul Ajar Pecahan Senilai',
    description:
      'Finalisasi rancangan pembelajaran 2x35 menit dengan penekanan pada diferensiasi proses.',
    category: 'Perencanaan Pembelajaran',
    deadline: 'Kamis, 12.00',
    deadlineDate: '2026-10-15T12:00:00',
    estimatedMinutes: 50,
    priority: 'tinggi',
    status: 'menunggu_persetujuan',
    classRoom: '5A',
    subject: 'Matematika',
    source: 'Koordinator Kurikulum',
    needsApproval: true,
    isAiGenerated: true,
    createdAt: '2026-10-13T14:20:00',
  },
  {
    id: 'task-4',
    title: 'Konfirmasi rencana kegiatan Hari Literasi',
    description:
      'Koordinasi buku bacaan fiksi dan lembar refleksi dengan tim perpustakaan sekolah.',
    category: 'Kegiatan Sekolah',
    deadline: 'Jumat, 14.00',
    deadlineDate: '2026-10-16T14:00:00',
    estimatedMinutes: 25,
    priority: 'sedang',
    status: 'belum_mulai',
    classRoom: '5A',
    source: 'Wakil Kepala Kurikulum',
    needsApproval: false,
    isAiGenerated: false,
    createdAt: '2026-10-14T07:30:00',
  },
  {
    id: 'task-5',
    title: 'Validasi rekap presensi siswa bulan ini',
    description:
      'Cek silang presensi kelas 5A dengan surat izin dokter untuk sinkronisasi arsip sekolah.',
    category: 'Administrasi Wali Kelas',
    deadline: 'Jumat, 10.00',
    deadlineDate: '2026-10-16T10:00:00',
    estimatedMinutes: 20,
    priority: 'rendah',
    status: 'belum_mulai',
    classRoom: '5A',
    source: 'Tata Usaha',
    needsApproval: false,
    isAiGenerated: false,
    createdAt: '2026-10-12T10:00:00',
  },
  {
    id: 'task-6',
    title: 'Siapkan lembar eksplorasi matematika Jumat',
    description:
      'Cetak dan potong kartu pecahan konkrit untuk kerja kelompok meja bundar.',
    category: 'Perencanaan Pembelajaran',
    deadline: 'Kamis, 15.00',
    deadlineDate: '2026-10-15T15:00:00',
    estimatedMinutes: 45,
    priority: 'sedang',
    status: 'belum_mulai',
    classRoom: '5A',
    subject: 'Matematika',
    source: 'Rutin Mengajar',
    needsApproval: false,
    isAiGenerated: false,
    createdAt: '2026-10-13T11:00:00',
  },
  {
    id: 'task-7',
    title: 'Tinjau catatan observasi belajar 2 siswa',
    description:
      'Catat perkembangan Adit Pratama dan Clara Angelica terkait konsentrasi tugas mandiri.',
    category: 'Administrasi Wali Kelas',
    deadline: 'Rabu, 14.00',
    deadlineDate: '2026-10-14T14:00:00',
    estimatedMinutes: 25,
    priority: 'tinggi',
    status: 'selesai',
    classRoom: '5A',
    source: 'Catatan Guru',
    needsApproval: false,
    isAiGenerated: false,
    createdAt: '2026-10-13T16:00:00',
    completedAt: '2026-10-14T08:15:00',
  },
];

export const INITIAL_LESSON_PLAN: LessonPlan = {
  id: 'lp-01',
  title: 'Modul Ajar: Pecahan Senilai & Perbandingan Pecahan',
  subject: 'Matematika',
  grade: '5',
  topic: 'Pecahan',
  duration: '2 x 35 menit',
  learningGoal:
    'Peserta didik dapat membandingkan dan mengurutkan berbagai pecahan biasa dan pecahan campuran menggunakan model konkret serta garis bilangan.',
  classCharacter:
    'Kemampuan siswa beragam; 6 siswa memerlukan scaffolding visual konkrit, 12 siswa mandiri, 6 siswa siap untuk soal cerita kontekstual tingkat lanjut.',
  formatOutput: 'Modul Ajar Ringkas (Kurikulum Merdeka)',
  createdAt: '2026-10-14T08:00:00',
  status: 'draf_ai',
  sections: {
    tujuanPembelajaran:
      '1. Peserta didik dapat membandingkan dua pecahan dengan penyebut berbeda melalui visualisasi model konkret (arsiran bangun datar) secara tepat.\n2. Peserta didik dapat mengurutkan minimal 4 pecahan biasa dari yang terkecil hingga terbesar dengan bernalar kritis dan mandiri.',
    pemahamanBermakna:
      'Pecahan bukan sekadar angka di atas dan di bawah garis bagi, melainkan representasi bagian dari satu kesatuan utuh yang hadir dalam kehidupan sehari-hari (misalnya membagi resep kue, kue lapis Surabaya, dan pembagian waktu belajar).',
    pertanyaanPemantik:
      '“Jika kamu memiliki 1/2 loyang martabak dan adikmu memiliki 2/4 loyang martabak yang sama ukurannya, siapakah yang mendapatkan bagian lebih banyak? Bagaimana cara membuktikannya tanpa menghitung?”',
    kegiatanPembuka:
      '1. Guru membuka pembelajaran dengan salam hangat, doa bersama, dan presensi (3 menit).\n2. Apersepsi: Guru menunjukkan dua lembar kertas lipat origami berukuran identik yang dilipat secara berbeda (1/2 dan 2/4) lalu meminta siswa mengamati luas arsiran (4 menit).\n3. Guru menyampaikan tujuan pembelajaran dan alur aktivitas kelompok hari ini (3 menit).',
    kegiatanInti:
      'Fase 1: Eksplorasi Konsep (15 menit)\n- Siswa mengamati peragaan pecahan batang dan menemukan pecahan yang senilai melalui manipulasi alat peraga.\n- Diskusi kelas singkat mengenai cara menyamakan penyebut menggunakan KPK.\n\nFase 2: Kerja Kelompok Terdiferensiasi (25 menit)\n- Kelompok A (Butuh Bimbingan): Bekerja dengan strip pecahan berwarna dan kartu gambar arsiran untuk membandingkan 1/2, 1/4, 3/4.\n- Kelompok B (Reguler): Mengerjakan lembar eksplorasi perbandingan pecahan berpenyebut tidak sama (misal 2/3 vs 3/5) menggunakan perkalian silang dan garis bilangan.\n- Kelompok C (Pengayaan): Menyelesaikan studi kasus kontekstual pembagian bahan adonan roti di bakery lokal Jakarta.\n\nFase 3: Presentasi & Validasi (10 menit)\n- Perwakilan kelompok mempresentasikan cara mereka membuktikan urutan pecahan di papan tulis.',
    kegiatanPenutup:
      '1. Siswa bersama guru menyimpulkan konsep utama: “Untuk membandingkan pecahan berpenyebut beda, kita dapat menyamakan penyebut atau menggunakan pecahan senilai” (4 menit).\n2. Siswa mengisi tiket keluar (Exit Ticket) berupa 1 soal singkat perbandingan pecahan (3 menit).\n3. Guru menyampaikan apresiasi atas kolaborasi kelas dan menutup dengan doa (3 menit).',
    strategiDiferensiasi:
      '- Diferensiasi Konten: Menyediakan strip pecahan fisik untuk siswa kinestetik/butuh scaffolding visual.\n- Diferensiasi Proses: Guru memberikan pendampingan intensif pada Kelompok A, sementara Kelompok B dan C difasilitasi dengan petunjuk eksplorasi terarah mandiri.\n- Diferensiasi Produk: Tingkat kedalaman soal Exit Ticket disesuaikan dengan kesiapan belajar.',
    asesmenFormatif:
      '1. Observasi keaktifan diskusi dan kerja sama kelompok (Lembar Observasi Sikap Gotong Royong).\n2. Penilaian Kinerja: Lembar kerja manipulasi pecahan konkrit.\n3. Tiket Keluar (Exit Ticket): Membandingkan 3/8 dan 2/5 dengan menunjukkan cara penyelesaian singkat.',
    bahanDibutuhkan:
      '- Strip pecahan warna-warni (Fraction Strips) per kelompok.\n- Kertas lipat origami ukuran 15x15 cm.\n- Lembar Kerja Eksplorasi Siswa 5A.\n- Papan tulis dan spidol warna.',
    refleksiGuru:
      '- Apakah alokasi waktu 25 menit kerja kelompok cukup untuk siswa menyelesaikan eksplorasi?\n- Apakah model konkret berhasil membantu 6 siswa yang sebelumnya kesulitan membedakan pembilang dan penyebut?\n- Bagian mana dari pembelajaran yang perlu penguatan pada pertemuan berikutnya?',
  },
  alternativeVersion: {
    pertanyaanPemantik:
      '“Ibu memiliki dua botol jus jeruk dengan volume sama. Botol pertama terisi 3/4 bagian, botol kedua terisi 5/6 bagian. Tanpa menuangkan ke gelas ukur, bagaimana kamu yakin botol mana yang menampung lebih banyak jus?”',
    strategiDiferensiasi:
      '- Scaffolding Bertingkat: Siswa Kelompok A dipandu dengan diagram lingkaran pizza, Kelompok B dengan garis bilangan desimal ekuivalen, Kelompok C langsung memecahkan tantangan pecahan majemuk.',
    kegiatanInti:
      'Menggunakan model permainan stasiun rotasi matematika (Math Stations) berdurasi 35 menit di mana siswa berpindah antar meja aktivitas: Meja Visual Konkret, Meja Garis Bilangan Digital, dan Meja Soal Cerita Pasar Tradisional.',
  },
};

export const INITIAL_WORKSHEET: Worksheet = {
  id: 'ws-01',
  title: 'Lembar Aktivitas Matematika: Membandingkan & Mengurutkan Pecahan',
  subject: 'Matematika',
  grade: 'Kelas 5 SD',
  topic: 'Pecahan Senilai & Perbandingan',
  difficulty: 'Standar Bertingkat (Mudah s/d Menantang)',
  schoolName: 'Sekolah Cakrawala Jakarta',
  createdAt: '2026-10-14T08:05:00',
  status: 'draf_ai',
  questions: [
    {
      id: 'q-1',
      type: 'pilihan_ganda',
      question:
        'Tanda pembanding yang tepat untuk mengisi titik-titik pada 3/5 ... 4/7 adalah ...',
      options: ['A. >', 'B. <', 'C. =', 'D. ≤'],
      correctAnswer: 'A. >',
      difficulty: 'sedang',
      explanation:
        '3/5 = 21/35, sedangkan 4/7 = 20/35. Karena 21/35 > 20/35, maka 3/5 > 4/7.',
    },
    {
      id: 'q-2',
      type: 'pilihan_ganda',
      question:
        'Pecahan berikut yang senilai dengan 4/6 adalah ...',
      options: ['A. 2/3', 'B. 3/4', 'C. 8/10', 'D. 6/8'],
      correctAnswer: 'A. 2/3',
      difficulty: 'mudah',
      explanation: 'Pembilang dan penyebut dibagi 2: (4:2)/(6:2) = 2/3.',
    },
    {
      id: 'q-3',
      type: 'pilihan_ganda',
      question:
        'Urutan pecahan 1/2, 2/3, dan 1/4 dari yang TERKECIL adalah ...',
      options: [
        'A. 1/4, 1/2, 2/3',
        'B. 1/2, 1/4, 2/3',
        'C. 2/3, 1/2, 1/4',
        'D. 1/4, 2/3, 1/2',
      ],
      correctAnswer: 'A. 1/4, 1/2, 2/3',
      difficulty: 'sedang',
      explanation:
        'Disamakan penyebutnya menjadi 12: 1/4 = 3/12, 1/2 = 6/12, 2/3 = 8/12. Urutan: 1/4, 1/2, 2/3.',
    },
    {
      id: 'q-4',
      type: 'pilihan_ganda',
      question:
        'Manakah di antara pecahan berikut yang nilainya LEBIH BESAR dari 1/2?',
      options: ['A. 2/5', 'B. 3/8', 'C. 4/7', 'D. 5/12'],
      correctAnswer: 'C. 4/7',
      difficulty: 'sedang',
      explanation:
        'Setengah dari 7 adalah 3.5. Karena 4 > 3.5, maka 4/7 lebih besar dari 1/2.',
    },
    {
      id: 'q-5',
      type: 'pilihan_ganda',
      question:
        'Bentuk paling sederhana dari pecahan 18/24 adalah ...',
      options: ['A. 6/8', 'B. 3/4', 'C. 9/12', 'D. 2/3'],
      correctAnswer: 'B. 3/4',
      difficulty: 'mudah',
      explanation: 'FPB dari 18 dan 24 adalah 6. (18:6)/(24:6) = 3/4.',
    },
    {
      id: 'q-6',
      type: 'isian_singkat',
      question:
        'Lengkapilah agar menjadi pecahan senilai: 3/8 = ... / 24',
      correctAnswer: '9',
      difficulty: 'mudah',
      explanation: 'Penyebut 8 dikali 3 = 24, maka pembilang 3 dikali 3 = 9.',
    },
    {
      id: 'q-7',
      type: 'isian_singkat',
      question:
        'Bandingkan pecahan berikut dengan tanda > , < , atau = :\n5/6 ... 7/9',
      correctAnswer: '>',
      difficulty: 'sedang',
      explanation:
        'KPK penyebut 6 dan 9 adalah 18. 5/6 = 15/18 dan 7/9 = 14/18. Maka 15/18 > 14/18 (5/6 > 7/9).',
    },
    {
      id: 'q-8',
      type: 'isian_singkat',
      question:
        'Tuliskan pecahan yang terletak tepat di antara 1/4 dan 3/4 dengan penyebut 8!',
      correctAnswer: '4/8 (atau 1/2)',
      difficulty: 'sedang',
      explanation:
        '1/4 = 2/8 dan 3/4 = 6/8. Pecahan di tengahnya adalah 4/8 (atau 2/4 = 1/2).',
    },
    {
      id: 'q-9',
      type: 'soal_cerita',
      question:
        'Ibu Maya membeli satu loyang kue bolu pandan untuk kegiatan kelas. Ibu Maya memotong kue tersebut menjadi 12 bagian sama besar. Kelompok Melati memakan 4 bagian kue, sedangkan Kelompok Mawar memakan 5 bagian kue.\na. Berapa bagian kue yang dimakan oleh Kelompok Melati dalam pecahan paling sederhana?\nb. Kelompok manakah yang memakan bagian kue lebih banyak? Jelaskan alasanmu!',
      correctAnswer:
        'a. Kelompok Melati: 4/12 = 1/3 bagian kue.\nb. Kelompok Mawar memakan lebih banyak, karena 5/12 bagian lebih besar daripada 4/12 bagian (5 bagian > 4 bagian).',
      difficulty: 'menantang',
      explanation:
        'Soal kontekstual menerapkan pecahan sebagai bagian dari himpunan utuh dan membandingkan pecahan berpenyebut sama.',
    },
    {
      id: 'q-10',
      type: 'soal_cerita',
      question:
        'Adit dan Clara sedang berlatih lari mengelilingi lapangan Sekolah Cakrawala. Dalam waktu 5 menit, Adit sudah menyelesaikan 3/5 putaran lapangan, sedangkan Clara menyelesaikan 2/3 putaran lapangan. Siapakah yang berlari lebih jauh? Tunjukkan langkah pembuktianmu menggunakan penyamaan penyebut!',
      correctAnswer:
        'Clara berlari lebih jauh.\nPembuktian: Samakan penyebut KPK dari 5 dan 3 adalah 15.\nAdit: 3/5 = 9/15 putaran.\nClara: 2/3 = 10/15 putaran.\nKarena 10/15 > 9/15, maka jarak yang ditempuh Clara lebih jauh.',
      difficulty: 'menantang',
      explanation:
        'Menerapkan KPK dua penyebut ganjil dan penalaran perbandingan pecahan pada konteks aktivitas olahraga sekolah.',
    },
  ],
  scoringRubric:
    'Pedoman Penskoran:\n- Soal Pilihan Ganda (No. 1–5): Bobot 6 poin per soal (Total 30 poin)\n- Soal Isian Singkat (No. 6–8): Bobot 10 poin per soal (Total 30 poin)\n- Soal Cerita Terapan (No. 9–10): Bobot 20 poin per soal (Total 40 poin: 10 poin langkah cara, 10 poin kesimpulan tepat)\nTotal Nilai Maksimal: 100 Poin',
};

export const INITIAL_PARENT_COMMS: ParentCommunication[] = [
  {
    id: 'comm-01',
    studentId: 'std-01',
    studentName: 'Adit Pratama',
    parentName: 'Bapak & Ibu Adit Pratama',
    parentPhone: '+62 812-9876-5432',
    context:
      'Adit menunjukkan peningkatan dalam pecahan, tetapi masih perlu berlatih soal cerita.',
    purpose: 'Evaluasi Perkembangan Mingguan (Weekly Progress Update)',
    tone: 'hangat',
    drafts: {
      hangat:
        'Selamat sore, Bapak dan Ibu Adit. Semoga keluarga senantiasa sehat. Minggu ini Adit menunjukkan perkembangan yang sangat baik dalam membandingkan pecahan di kelas 5A. Ia sudah jauh lebih percaya diri saat mengerjakan latihan mandiri di papan tulis. Untuk penguatan soal cerita terapan, Adit masih memerlukan sedikit pendampingan dalam menentukan informasi yang relevan dari teks. Jika memungkinkan di akhir pekan nanti, Adit dapat berlatih dua atau tiga soal singkat bersama di rumah. Terima kasih banyak atas dukungan luar biasa dari Bapak dan Ibu untuk Adit. Salam hangat, Ibu Maya (Wali Kelas 5A).',
      singkat:
        'Selamat sore Bapak/Ibu Adit. Menginfokan bahwa Adit berkembang baik pada materi perbandingan pecahan minggu ini. Untuk soal cerita masih butuh sedikit latihan identifikasi informasi soal. Mohon luangkan waktu latihan 2 soal di rumah akhir pekan ini. Terima kasih, Bu Maya 5A.',
      formal:
        'Yth. Bapak dan Ibu Adit Pratama. Sehubungan dengan evaluasi pembelajaran pekan berjalan di Kelas 5A Sekolah Cakrawala Jakarta, kami menginformasikan bahwa ananda Adit telah menguasai konsep dasar perbandingan pecahan dengan baik. Namun demikian, pada aspek penyelesaian soal cerita aplikatif, ananda masih memerlukan penguatan penalaran teks soal. Kami menyarankan pendampingan mandiri sebanyak 2-3 soal latihan di rumah. Atas perhatian dan kerja sama Bapak dan Ibu, kami haturkan terima kasih. Hormat kami, Maya Putri, S.Pd. - Wali Kelas 5A.',
    },
    currentDraft:
      'Selamat sore, Bapak dan Ibu Adit. Minggu ini Adit menunjukkan perkembangan yang baik dalam membandingkan pecahan. Ia sudah lebih percaya diri saat mengerjakan latihan mandiri. Untuk soal cerita, Adit masih memerlukan sedikit pendampingan dalam menentukan informasi yang relevan. Jika memungkinkan, Adit dapat berlatih dua atau tiga soal singkat di rumah. Terima kasih atas dukungannya.',
    status: 'draf_menunggu',
  },
  {
    id: 'comm-02',
    studentId: 'std-02',
    studentName: 'Clara Angelica',
    parentName: 'Ibu Veronica (Mama Clara)',
    parentPhone: '+62 811-2345-6789',
    context:
      'Clara sangat aktif memimpin diskusi kelompok matematika dan membantu temannya memahami garis bilangan.',
    purpose: 'Apresiasi Kepemimpinan Belajar Siswa',
    tone: 'hangat',
    drafts: {
      hangat:
        'Selamat siang Ibu Veronica. Ingin mengabarkan bahwa Clara tampil luar biasa hari ini di kelas 5A. Tidak hanya menyelesaikan lembar kerja pecahan dengan sangat rapi, Clara juga dengan sabar membimbing teman satu kelompoknya memahami konsep garis bilangan. Sikap empati dan kepemimpinannya sangat membanggakan. Terima kasih atas teladan baik yang ditanamkan di rumah. Salam hangat, Ibu Maya.',
      singkat:
        'Selamat siang Bu Veronica. Clara sangat aktif dan berinisiatif membantu temannya dalam kerja kelompok matematika hari ini. Sangat membanggakan! Terima kasih, Bu Maya 5A.',
      formal:
        'Yth. Ibu Veronica. Kami menyampaikan apresiasi atas pencapaian ananda Clara Angelica pekan ini di Kelas 5A. Ananda menunjukkan kepemimpinan yang matang dan sikap gotong royong tinggi saat memandu diskusi kelompok matematika. Kami mengucapkan terima kasih atas kerja sama keluarga dalam mendampingi ananda. Hormat kami, Maya Putri, S.Pd.',
    },
    currentDraft:
      'Selamat siang Ibu Veronica. Ingin mengabarkan bahwa Clara tampil luar biasa hari ini di kelas 5A. Tidak hanya menyelesaikan tugas dengan tepat waktu, ia juga dengan sabar membimbing rekan sekelompoknya.',
    status: 'draf_menunggu',
  },
  {
    id: 'comm-03',
    studentId: 'std-03',
    studentName: 'Budi Santoso',
    parentName: 'Bapak Santoso & Ibu Ratna',
    parentPhone: '+62 813-4567-8901',
    context:
      'Budi sempat tertidur di jam pertama hari Selasa, namun setelah diajak bicara ia bersemangat kembali.',
    purpose: 'Konfirmasi Pola Istirahat & Kebugaran Siswa',
    tone: 'hangat',
    drafts: {
      hangat:
        'Selamat sore Bapak Santoso dan Ibu Ratna. Mohon izin menyapa. Hari Selasa kemarin Budi tampak agak mengantuk di jam pertama, namun setelah kami ajak minum air dan bergerak santai, Budi kembali fokus mengikuti pelajaran sampai siang. Mohon bantuan Bapak dan Ibu untuk memastikan jam istirahat malam Budi cukup ya agar staminanya tetap prima di sekolah. Terima kasih banyak atas kerja samanya. Salam hangat, Ibu Maya.',
      singkat:
        'Selamat sore Bapak/Ibu. Mohon perhatian untuk jam istirahat malam ananda Budi karena kemarin sempat mengantuk di awal jam belajar. Terima kasih atas kerja samanya. Salam, Bu Maya.',
      formal:
        'Yth. Orang tua ananda Budi Santoso. Demi mengoptimalkan konsentrasi belajar ananda di kelas 5A, kami mohon kerja sama Bapak dan Ibu dalam memantau jadwal tidur dan istirahat ananda di rumah, mengingat kemarin ananda tampak keletihan di sesi pagi. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih. Hormat kami, Maya Putri, S.Pd.',
    },
    currentDraft:
      'Selamat sore Bapak Santoso dan Ibu Ratna. Kami mengamati Budi sempat mengantuk di jam pertama pelajaran kemarin. Mohon bantuan untuk memantau jam istirahat malam ananda agar esok hari tetap segar di sekolah. Terima kasih atas dukungannya.',
    status: 'draf_menunggu',
  },
  {
    id: 'comm-04',
    studentId: 'std-04',
    studentName: 'Siti Rahma',
    parentName: 'Ibu Aisyah (Ibu Siti)',
    parentPhone: '+62 815-6789-0123',
    context:
      'Siti berhasil menyelesaikan target bacaan 3 buku cerita pada program Pojok Literasi minggu ini.',
    purpose: 'Pencapaian Literasi Mingguan',
    tone: 'hangat',
    drafts: {
      hangat:
        'Selamat sore Ibu Aisyah. Senang sekali mengabarkan bahwa Siti berhasil menuntaskan 3 buku di pojok literasi kelas 5A minggu ini! Siti juga menceritakan kembali intisari buku dengan sangat runut di depan teman-temannya. Kebiasaan membaca yang dibangun di rumah sangat terasa buahnya. Terima kasih atas teladan hebat dari keluarga. Salam hangat, Bu Maya.',
      singkat:
        'Selamat sore Bu Aisyah. Siti berhasil membaca 3 buku di pojok baca kelas minggu ini dan bercerita dengan sangat baik. Pertahankan terus semangat membacanya ya Bu. Salam, Bu Maya.',
      formal:
        'Yth. Ibu Aisyah. Kami menyampaikan kabar baik bahwa ananda Siti Rahma telah mencapai target literasi membaca mandiri 3 buku cerita dalam pekan ini dengan pemahaman isi bacaan yang sangat memuaskan. Kami mengapresiasi dukungan literasi keluarga di rumah. Hormat kami, Maya Putri, S.Pd.',
    },
    currentDraft:
      'Selamat sore Ibu Aisyah. Senang sekali mengabarkan bahwa Siti berhasil menuntaskan 3 buku di pojok literasi kelas 5A minggu ini dengan pemahaman bacaan yang sangat baik. Terima kasih atas dukungannya di rumah.',
    status: 'draf_menunggu',
  },
];

export const INITIAL_STUDENTS_ROSTER: Student[] = [
  {
    id: 'std-01',
    nisn: '0129384711',
    name: 'Adit Pratama',
    gender: 'L',
    parentName: 'Bapak Pratama',
    parentPhone: '+62 812-9876-5432',
    mathProgress: 'Sesuai Harapan',
    literacyProgress: 'Sesuai Harapan',
    attendanceRate: 96,
    teacherNotes: 'Pecahan biasa lancar, perlu penguatan soal cerita kontekstual.',
  },
  {
    id: 'std-02',
    nisn: '0129384712',
    name: 'Clara Angelica',
    gender: 'P',
    parentName: 'Ibu Veronica',
    parentPhone: '+62 811-2345-6789',
    mathProgress: 'Sangat Baik',
    literacyProgress: 'Sangat Baik',
    attendanceRate: 100,
    teacherNotes: 'Sangat aktif, berinisiatif menjadi tutor sebaya kelompok.',
  },
  {
    id: 'std-03',
    nisn: '0129384713',
    name: 'Budi Santoso',
    gender: 'L',
    parentName: 'Bapak Santoso',
    parentPhone: '+62 813-4567-8901',
    mathProgress: 'Perlu Pendampingan',
    literacyProgress: 'Sesuai Harapan',
    attendanceRate: 91,
    teacherNotes: 'Membutuhkan alat peraga manipulasi konkret untuk perbandingan pecahan.',
  },
  {
    id: 'std-04',
    nisn: '0129384714',
    name: 'Siti Rahma',
    gender: 'P',
    parentName: 'Ibu Aisyah',
    parentPhone: '+62 815-6789-0123',
    mathProgress: 'Sesuai Harapan',
    literacyProgress: 'Sangat Baik',
    attendanceRate: 98,
    teacherNotes: 'Juara literasi kelas, kosa kata narasi sangat kaya.',
  },
  {
    id: 'std-05',
    nisn: '0129384715',
    name: 'Dimas Arya',
    gender: 'L',
    parentName: 'Bapak Gunawan',
    parentPhone: '+62 817-1234-5678',
    mathProgress: 'Sesuai Harapan',
    literacyProgress: 'Sesuai Harapan',
    attendanceRate: 95,
    teacherNotes: 'Teliti dalam perhitungan pecahan senilai, vokal saat kerja kelompok.',
  },
  {
    id: 'std-06',
    nisn: '0129384716',
    name: 'Zahra Amelia',
    gender: 'P',
    parentName: 'Ibu Fitriani',
    parentPhone: '+62 818-2345-6789',
    mathProgress: 'Sangat Baik',
    literacyProgress: 'Sesuai Harapan',
    attendanceRate: 97,
    teacherNotes: 'Kerap menyelesaikan tantangan pengayaan lebih awal.',
  },
  {
    id: 'std-07',
    nisn: '0129384717',
    name: 'Farhan Kurnia',
    gender: 'L',
    parentName: 'Bapak Kurnia',
    parentPhone: '+62 819-3456-7890',
    mathProgress: 'Perlu Pendampingan',
    literacyProgress: 'Perlu Pendampingan',
    attendanceRate: 88,
    teacherNotes: 'Pendampingan fokus bertahap 15 menit setiap Selasa sore.',
  },
  {
    id: 'std-08',
    nisn: '0129384718',
    name: 'Nadia Salsabila',
    gender: 'P',
    parentName: 'Ibu Nurul',
    parentPhone: '+62 821-4567-8901',
    mathProgress: 'Sesuai Harapan',
    literacyProgress: 'Sangat Baik',
    attendanceRate: 99,
    teacherNotes: 'Sangat rapi dalam mencatat alur penyelesaian matematika.',
  },
];

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-01',
    type: 'modul_ajar',
    title: 'Modul Ajar Matematika Pecahan Senilai 5A',
    category: 'Perencanaan Pembelajaran',
    createdBy: 'Ibu Maya Putri (via Asisten AI GuruFlow)',
    createdAt: 'Hari ini, 08.00 WIB',
    aiGenerated: true,
    riskNotice:
      'Periksa kesesuaian waktu 2x35 menit dengan jadwal istirahat siswa dan pastikan alat peraga origami tersedia.',
    status: 'menunggu',
    referenceId: 'lp-01',
  },
  {
    id: 'appr-02',
    type: 'worksheet',
    title: 'Lembar Aktivitas Matematika & Kunci Jawaban A4',
    category: 'Worksheet dan Kuis',
    createdBy: 'Ibu Maya Putri (via Generator Lembar Kerja)',
    createdAt: 'Hari ini, 08.05 WIB',
    aiGenerated: true,
    riskNotice:
      'Pastikan format A4 sudah diverifikasi kunci jawabannya sebelum dikirim ke mesin fotokopi sekolah.',
    status: 'menunggu',
    referenceId: 'ws-01',
  },
  {
    id: 'appr-03',
    type: 'pesan_ortu',
    title: 'Draft Pesan WhatsApp Perkembangan Adit Pratama',
    category: 'Komunikasi Orang Tua',
    createdBy: 'Ibu Maya Putri (via Asisten Komunikasi)',
    createdAt: 'Hari ini, 08.10 WIB',
    aiGenerated: true,
    riskNotice:
      'Pastikan nama orang tua dan nomor WhatsApp telah diverifikasi secara manual sebelum menekan salin.',
    status: 'menunggu',
    referenceId: 'comm-01',
  },
  {
    id: 'appr-04',
    type: 'tugas_inbox',
    title: '3 Tugas Ekstraksi Pesan Kepala Sekolah (Rekap Nilai, Catatan, Literasi)',
    category: 'Tugas Administratif',
    createdBy: 'Sistem Ekstraksi Pesan Otomatis',
    createdAt: 'Hari ini, 07.45 WIB',
    aiGenerated: true,
    riskNotice:
      'Guru perlu menyetujui estimasi durasi dan penempatan tenggat sebelum dijadwalkan ke kalender mingguan.',
    status: 'menunggu',
    referenceId: 'msg-01',
  },
];

export const INITIAL_WORKLOAD_DAYS: WorkloadDistributionDay[] = [
  { day: 'Senin', allocatedMinutes: 120, maxRecommendedMinutes: 180, taskCount: 2 },
  { day: 'Selasa', allocatedMinutes: 150, maxRecommendedMinutes: 180, taskCount: 3 },
  { day: 'Rabu', allocatedMinutes: 135, maxRecommendedMinutes: 180, taskCount: 3 },
  {
    day: 'Kamis',
    allocatedMinutes: 270, // 4.5 hours -> overloaded!
    maxRecommendedMinutes: 180,
    taskCount: 5,
    isOverloaded: true,
  },
  { day: 'Jumat', allocatedMinutes: 165, maxRecommendedMinutes: 180, taskCount: 3 },
];

export const INITIAL_PILOT_METRICS: PilotMetrics = {
  durationWeeks: 4,
  currentWeek: 2,
  teachersInvited: 5,
  teachersActive: 4,
  feedbackSubmitted: 8,
  tasksCompleted: 68,
  documentsAwaitingApproval: 7,
  avgHoursSavedPerWeek: 3.7,
  bottlenecks: [
    { category: 'Penyusunan Modul Ajar & RPP', percentage: 34, hoursPerWeek: 4.8 },
    { category: 'Komunikasi & Laporan Orang Tua', percentage: 26, hoursPerWeek: 3.6 },
    { category: 'Administrasi & Rekap Asesmen', percentage: 18, hoursPerWeek: 2.5 },
    { category: 'Pemindahan Data Antar Formulir', percentage: 14, hoursPerWeek: 1.9 },
    { category: 'Koordinasi Jadwal & Tenggat', percentage: 8, hoursPerWeek: 1.1 },
  ],
  quotes: [
    {
      author: 'Ibu Maya Putri, S.Pd.',
      role: 'Wali Kelas 5A',
      text: 'Draft pesan WhatsApp untuk orang tua menghemat banyak waktu di sore hari. Nadanya sopan dan tetap dalam kendali saya.',
    },
    {
      author: 'Pak Rizky Pratama, M.Pd.',
      role: 'Guru Sains & Koordinator Level 6',
      text: 'Pembuat lembar kerja langsung menghasilkan kunci jawaban dan rubrik yang sesuai format A4 sekolah kami tanpa perlu menata ulang tabel di Word.',
    },
    {
      author: 'Ibu Dewi Astuti, S.Pd.',
      role: 'Wali Kelas 4B',
      text: 'Fitur ekstraksi pesan grup sekolah mengubah kepanikan tumpukan chat WhatsApp menjadi 3 checklist tugas dengan tenggat yang realistis.',
    },
  ],
};
