import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let genAIClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export const isGeminiConfigured = (): boolean => {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
};

export class GeminiService {
  /**
   * Scenario 1: Ubah Pesan Sekolah Menjadi Tugas Terstruktur
   */
  async extractTasks(messageText: string, context?: { schoolName?: string; senderRole?: string }) {
    const ai = getClient();
    if (!ai) {
      throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    }

    const prompt = `Anda adalah asisten cerdas pimpinan sekolah di Indonesia (GuruFlow).
Tugas Anda adalah membaca pesan / pengumuman / instruksi sekolah berikut dan mengekstraksi tugas-tugas administratif yang spesifik, terukur, dan realistis untuk dikerjakan guru atau wali kelas.

Pesan Sekolah:
"${messageText}"

Konteks Sekolah: ${context?.schoolName || 'Sekolah Swasta di Jakarta'}

Instruksi Analisis:
1. Ekstraksi setiap sub-tugas yang wajib diselesaikan.
2. Tentukan kategori tugas (Perencanaan Pembelajaran, Komunikasi Orang Tua, Asesmen & Penilaian, Administrasi Wali Kelas, atau Kegiatan Sekolah).
3. Tentukan tenggat waktu yang logis dan realistis berdasarkan pesan (hari dan jam, misal: "Kamis, 16.00").
4. Berikan estimasi waktu pengerjaan dalam menit (misal 30, 45, 60 menit).
5. Tentukan tingkat prioritas (tinggi, sedang, atau rendah).
6. Jelaskan alasan urutan prioritas tersebut secara pedagogis dan alur administrasi sekolah.

Berikan jawaban HANYA dalam format JSON dengan struktur:
{
  "reasoning": "Penjelasan mengapa urutan tugas dan prioritas dipilih",
  "tasks": [
    {
      "title": "Judul tugas ringkas dan jelas",
      "description": "Deskripsi tindakan spesifik yang harus dilakukan guru",
      "category": "Kategori tugas",
      "deadline": "Hari dan jam tenggat",
      "estimatedMinutes": 45,
      "priority": "tinggi"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  }

  /**
   * Scenario 2: Generator Modul Ajar Kurikulum Merdeka Lengkap
   */
  async generateLessonPlan(params: {
    jenjang: string;
    kelas: string;
    mapel: string;
    topik: string;
    durasi: string;
    tujuan: string;
    karakterKelas?: string;
    schoolName?: string;
  }) {
    const ai = getClient();
    if (!ai) {
      throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    }

    const prompt = `Anda adalah konsultan kurikulum senior di Indonesia yang menguasai Kurikulum Merdeka (Kepmendikbudristek & BSKAP).
Buatkan draf Modul Ajar yang komprehensif, terstruktur, aplikatif, dan siap uji untuk:

- Jenjang: ${params.jenjang}
- Kelas: ${params.kelas}
- Mata Pelajaran: ${params.mapel}
- Topik: ${params.topik}
- Alokasi Waktu: ${params.durasi}
- Tujuan Pembelajaran Inti: ${params.tujuan}
- Karakter Siswa: ${params.karakterKelas || 'Kemampuan siswa beragam, membutuhkan diferensiasi bertahap'}
- Satuan Pendidikan: ${params.schoolName || 'Sekolah Swasta di Jakarta'}

Format draf harus mencakup 10 komponen resmi:
1. tujuanPembelajaran (Poin-poin spesifik dengan kata kerja operasional terukur)
2. pemahamanBermakna (Hubungan konsep dengan kehidupan sehari-hari siswa di Indonesia)
3. pertanyaanPemantik (Pertanyaan kontekstual terbuka yang memancing rasa ingin tahu)
4. kegiatanPembuka (Apersepsi, motivasi, dan pengantar waktu spesifik)
5. kegiatanInti (Terbagi jelas dalam 3 fase bertahap dengan diferensiasi kelompok: eksplorasi, praktik terarah, dan kolaborasi)
6. kegiatanPenutup (Penyimpulan bersama, refleksi singkat, dan tiket keluar)
7. strategiDiferensiasi (Rincian Diferensiasi Konten, Diferensiasi Proses, dan Diferensiasi Produk)
8. asesmenFormatif (Instrumen observasi sikap, penilaian kinerja, dan tes formatif singkat)
9. bahanDibutuhkan (Alat peraga konkret, media, dan lembar kerja)
10. refleksiGuru (Pertanyaan evaluasi diri guru pasca mengajar)

Berikan respon HANYA dalam format JSON murni:
{
  "title": "Modul Ajar: [Topik] [Kelas]",
  "sections": {
    "tujuanPembelajaran": "...",
    "pemahamanBermakna": "...",
    "pertanyaanPemantik": "...",
    "kegiatanPembuka": "...",
    "kegiatanInti": "...",
    "kegiatanPenutup": "...",
    "strategiDiferensiasi": "...",
    "asesmenFormatif": "...",
    "bahanDibutuhkan": "...",
    "refleksiGuru": "..."
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  }

  /**
   * Scenario 3: Komunikasi Orang Tua WhatsApp dengan 3 Gaya Nada
   */
  async generateParentMessages(params: {
    studentName: string;
    parentName: string;
    context: string;
    purpose: string;
    schoolName?: string;
    teacherName?: string;
  }) {
    const ai = getClient();
    if (!ai) {
      throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    }

    const prompt = `Anda adalah asisten komunikasi wali kelas di Indonesia.
Tuliskan 3 versi draf pesan WhatsApp untuk orang tua siswa dengan pedoman:
- Siswa: ${params.studentName}
- Nama Orang Tua: ${params.parentName}
- Konteks Perkembangan: "${params.context}"
- Tujuan Komunikasi: ${params.purpose}
- Nama Guru Pengirim: ${params.teacherName || 'Ibu Maya Putri, S.Pd.'}
- Sekolah: ${params.schoolName || 'Sekolah Cakrawala Jakarta'}

Aturan Etika & Privasi:
- JANGAN membagikan rincian nilai numerik rahasia, data medis, atau catatan disiplin berat.
- Gunakan bahasa yang membangun, solutif, menghormati peran orang tua, dan memicu kerja sama positif di rumah.
- Hasilkan tepat 3 variasi gaya nada:
  1. "hangat": Ramah, bersahabat, apresiatif, cocok untuk hubungan mingguan yang erat.
  2. "singkat": Padat, langsung ke inti perkembangan dan ajakan latihan singkat.
  3. "formal": Bahasa resmi kedinasan sekolah yang sangat santun dan berstruktur rapi.

Berikan respon HANYA dalam format JSON:
{
  "hangat": "teks pesan hangat...",
  "singkat": "teks pesan singkat...",
  "formal": "teks pesan formal..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  }

  /**
   * Scenario 4: Generator Lembar Aktivitas Siswa Siap Cetak A4
   */
  async generateWorksheet(params: {
    grade: string;
    subject: string;
    topic: string;
    difficulty: string;
    schoolName?: string;
  }) {
    const ai = getClient();
    if (!ai) {
      throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    }

    const prompt = `Buatkan 10 butir soal lembar aktivitas siswa (worksheet) terstruktur untuk:
- Jenjang: ${params.grade}
- Mata Pelajaran: ${params.subject}
- Topik: ${params.topic}
- Tingkat Kesulitan: ${params.difficulty}
- Satuan Pendidikan: ${params.schoolName || 'Sekolah Cakrawala Jakarta'}

Komposisi Soal:
1. 5 Soal Pilihan Ganda (masing-masing 4 opsi A, B, C, D) dengan kunci jawaban dan pembahasan.
2. 3 Soal Isian Singkat yang menguji pemahaman konsep langsung.
3. 2 Soal Cerita Terapan Kontekstual Indonesia (kehidupan sehari-hari, kuliner nusantara, atau kegiatan sekolah) yang menguji penalaran kritis (HOTS).
4. Rubrik Penskoran resmi (total bobot 100 poin).

Berikan respon HANYA dalam format JSON:
{
  "title": "Lembar Aktivitas Siswa: [Topik]",
  "scoringRubric": "Pedoman penskoran detail...",
  "questions": [
    {
      "id": "q-1",
      "type": "pilihan_ganda",
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "correctAnswer": "A. ...",
      "explanation": "...",
      "difficulty": "sedang"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  }

  /**
   * Contextual Assistant Chat
   */
  async chatAssistant(userPrompt: string, history: Array<{ role: string; content: string }>, context: any) {
    const ai = getClient();
    if (!ai) {
      throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
    }

    const systemInstruction = `Anda adalah "Asisten GuruFlow", asisten eksekutif administratif cerdas khusus guru dan pimpinan sekolah di Indonesia.
Prinsip utama:
1. Anda membantu merapikan administrasi (Modul Ajar, asesmen, jadwal, komunikasi orang tua) agar guru kembali fokus mengajar.
2. Hasil AI selalu berstatus draf usulan; guru yang memegang keputusan akhir.
3. Berbahasa Indonesia santun, profesional, praktis, dan memahami terminologi Kurikulum Merdeka.
4. Konteks pengguna saat ini: Guru ${context?.teacherName || 'Ibu Maya Putri'}, Sekolah ${context?.schoolName || 'Sekolah Cakrawala Jakarta'}.`;

    const contents = [
      ...history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    return response.text || 'Tidak ada balasan dari sistem.';
  }
}

export const geminiService = new GeminiService();
