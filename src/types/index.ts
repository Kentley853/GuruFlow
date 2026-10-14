export type UserRole = 'teacher' | 'principal';
export type Language = 'id' | 'en';

export type TaskPriority = 'tinggi' | 'sedang' | 'rendah';
export type TaskStatus = 'belum_mulai' | 'sedang_dikerjakan' | 'menunggu_persetujuan' | 'selesai';
export type TaskCategory = 
  | 'Perencanaan Pembelajaran' 
  | 'Komunikasi Orang Tua' 
  | 'Asesmen & Penilaian' 
  | 'Administrasi Wali Kelas' 
  | 'Kegiatan Sekolah';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  deadline: string; // e.g. "Kamis, 16.00"
  deadlineDate: string; // ISO date string or formatted
  estimatedMinutes: number;
  priority: TaskPriority;
  status: TaskStatus;
  classRoom: string;
  subject?: string;
  source: string; // e.g. "Pesan Kepala Sekolah", "Rutin Wali Kelas", "Kurikulum"
  needsApproval: boolean;
  isAiGenerated: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ExtractedInboxMessage {
  id: string;
  sender: string;
  senderRole: string;
  date: string;
  content: string;
  isProcessed: boolean;
  tasks: Task[];
  reasoning: string;
}

export interface LessonPlanSection {
  title: string;
  content: string;
  isRegenerating?: boolean;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  learningGoal: string;
  classCharacter: string;
  formatOutput: string;
  createdAt: string;
  status: 'draf_ai' | 'disetujui' | 'revisi';
  approvedBy?: string;
  approvedAt?: string;
  sections: {
    tujuanPembelajaran: string;
    pemahamanBermakna: string;
    pertanyaanPemantik: string;
    kegiatanPembuka: string;
    kegiatanInti: string;
    kegiatanPenutup: string;
    strategiDiferensiasi: string;
    asesmenFormatif: string;
    bahanDibutuhkan: string;
    refleksiGuru: string;
  };
  alternativeVersion?: {
    strategiDiferensiasi: string;
    pertanyaanPemantik: string;
    kegiatanInti: string;
  };
}

export interface QuestionItem {
  id: string;
  type: 'pilihan_ganda' | 'isian_singkat' | 'soal_cerita';
  question: string;
  options?: string[];
  correctAnswer: string;
  difficulty: 'mudah' | 'sedang' | 'menantang';
  explanation?: string;
}

export interface Worksheet {
  id: string;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  difficulty: string;
  schoolName: string;
  createdAt: string;
  status: 'draf_ai' | 'disetujui';
  questions: QuestionItem[];
  scoringRubric: string;
}

export type ParentMessageTone = 'hangat' | 'singkat' | 'formal';

export interface ParentCommunication {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  context: string;
  purpose: string;
  tone: ParentMessageTone;
  drafts: {
    hangat: string;
    singkat: string;
    formal: string;
  };
  currentDraft: string;
  status: 'draf_menunggu' | 'disetujui_dan_disalin';
  approvedAt?: string;
  lastCopiedAt?: string;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  parentName: string;
  parentPhone: string;
  mathProgress: 'Perlu Pendampingan' | 'Sesuai Harapan' | 'Sangat Baik';
  literacyProgress: 'Perlu Pendampingan' | 'Sesuai Harapan' | 'Sangat Baik';
  attendanceRate: number; // percentage
  teacherNotes: string;
}

export interface ApprovalItem {
  id: string;
  type: 'modul_ajar' | 'pesan_ortu' | 'worksheet' | 'tugas_inbox';
  title: string;
  category: string;
  createdBy: string;
  createdAt: string;
  aiGenerated: boolean;
  riskNotice: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  referenceId: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectReason?: string;
}

export interface WorkloadDistributionDay {
  day: string;
  allocatedMinutes: number;
  maxRecommendedMinutes: number;
  taskCount: number;
  isOverloaded?: boolean;
}

export interface PilotMetrics {
  durationWeeks: number;
  currentWeek: number;
  teachersInvited: number;
  teachersActive: number;
  feedbackSubmitted: number;
  tasksCompleted: number;
  documentsAwaitingApproval: number;
  avgHoursSavedPerWeek: number;
  bottlenecks: {
    category: string;
    percentage: number;
    hoursPerWeek: number;
  }[];
  quotes: {
    author: string;
    role: string;
    text: string;
  }[];
}

export interface SchoolRecord {
  id: string;
  name: string;
  npsn: string;
  city: string;
  province: string;
  address: string;
  principalName: string;
  curriculum: string;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: UserRole;
  nip?: string;
  title: string;
  assignedClass?: string;
  subjects: string[];
  createdAt: string;
}

export interface AuditRecord {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: 'ai_generation' | 'document_edit' | 'approval' | 'rejection' | 'export_word' | 'export_pdf' | 'task_update' | 'rebalance';
  documentType: 'modul_ajar' | 'worksheet' | 'pesan_ortu' | 'tugas' | 'jadwal';
  documentTitle: string;
  details: string;
  timestamp: string;
}

export interface NotificationRecord {
  id: string;
  schoolId: string;
  userId: string;
  title: string;
  message: string;
  type: 'approval_needed' | 'deadline_warning' | 'task_assigned' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface SystemStatus {
  appName: string;
  version: string;
  geminiConfigured: boolean;
  activeSchool: SchoolRecord | null;
  storageEngine: string;
  timestamp: string;
}
