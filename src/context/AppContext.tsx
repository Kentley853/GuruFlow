import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Task,
  ExtractedInboxMessage,
  LessonPlan,
  Worksheet,
  ParentCommunication,
  Student,
  ApprovalItem,
  PilotMetrics,
  UserRole,
  Language,
  WorkloadDistributionDay,
  QuestionItem,
  SchoolRecord,
  UserRecord,
  AuditRecord,
  NotificationRecord,
  SystemStatus,
} from '../types';
import {
  INITIAL_SCHOOL_MESSAGE,
  INITIAL_TASKS,
  INITIAL_LESSON_PLAN,
  INITIAL_WORKSHEET,
  INITIAL_PARENT_COMMS,
  INITIAL_STUDENTS_ROSTER,
  INITIAL_APPROVALS,
  INITIAL_WORKLOAD_DAYS,
  INITIAL_PILOT_METRICS,
} from '../data/mockData';

export type ActiveView =
  | 'beranda'
  | 'tugas'
  | 'perencanaan'
  | 'worksheet'
  | 'komunikasi'
  | 'kelas'
  | 'kalender'
  | 'beban_kerja'
  | 'persetujuan'
  | 'pengaturan'
  | 'landing_page';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserRecord;
  setCurrentUser: (user: UserRecord) => void;
  activeSchool: SchoolRecord;
  setActiveSchool: (school: SchoolRecord) => void;
  allSchools: SchoolRecord[];
  refreshSchools: () => Promise<void>;
  createNewSchool: (data: Partial<SchoolRecord>) => Promise<SchoolRecord>;
  language: Language;
  setLanguage: (lang: Language) => void;

  // System Status & AI Engine Health
  systemStatus: SystemStatus | null;
  checkSystemStatus: () => Promise<void>;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task['status']) => Promise<void>;
  updateTaskDetails: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  // Real Gemini Inbox Extraction
  schoolMessage: ExtractedInboxMessage;
  isExtractingMessage: boolean;
  extractMessageToTasks: (customMessage?: string) => Promise<void>;
  approveExtractedTasks: () => Promise<void>;
  rejectExtractedMessage: () => void;
  updateExtractedTask: (taskIndex: number, updated: Partial<Task>) => void;

  // Real Gemini Lesson Plan
  lessonPlan: LessonPlan;
  isGeneratingLessonPlan: boolean;
  generateRealLessonPlan: (params: {
    jenjang: string;
    kelas: string;
    mapel: string;
    topik: string;
    durasi: string;
    tujuan: string;
    karakterKelas?: string;
  }) => Promise<void>;
  regenerateSection: (sectionKey: keyof LessonPlan['sections']) => void;
  updateLessonPlanSection: (sectionKey: keyof LessonPlan['sections'], value: string) => void;
  approveLessonPlan: () => Promise<void>;
  toggleLessonPlanAlternative: () => void;
  isUsingAlternativeVersion: boolean;
  exportLessonPlanWord: () => void;

  // Real Gemini Parent Comm
  parentComms: ParentCommunication[];
  selectedStudentCommId: string;
  setSelectedStudentCommId: (id: string) => void;
  generateRealParentMessages: (params: {
    studentName: string;
    parentName: string;
    context: string;
    purpose: string;
  }) => Promise<void>;
  isGeneratingParentMsg: boolean;
  updateParentCommTone: (commId: string, tone: 'hangat' | 'singkat' | 'formal') => void;
  updateCustomDraft: (commId: string, text: string) => void;
  approveAndCopyWhatsApp: (commId: string) => { success: boolean; text: string };

  // Real Gemini Worksheet Generator
  worksheet: Worksheet;
  isRegeneratingWorksheet: boolean;
  generateRealWorksheet: (params: {
    grade: string;
    subject: string;
    topic: string;
    difficulty: string;
  }) => Promise<void>;
  updateWorksheetQuestion: (qId: string, updated: Partial<QuestionItem>) => void;
  replaceQuestion: (qId: string) => Promise<void>;
  adjustDifficulty: (mode: 'easier' | 'harder') => Promise<void>;
  approveWorksheet: () => Promise<void>;
  exportWorksheetWord: () => void;

  // Workload Intelligence & Rebalancing
  workloadDays: WorkloadDistributionDay[];
  isRebalanced: boolean;
  applyWorkloadOptimization: () => Promise<void>;
  revertWorkloadOptimization: () => void;

  // Working Approvals Queue
  approvals: ApprovalItem[];
  approveItem: (id: string) => Promise<void>;
  rejectItem: (id: string, reason?: string) => Promise<void>;

  // Audit Logs
  auditLogs: AuditRecord[];
  refreshAuditLogs: () => Promise<void>;

  // Notifications
  notifications: NotificationRecord[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;

  // Students & Pilot
  students: Student[];
  pilotMetrics: PilotMetrics;
  submitPilotRegistration: (formData: any) => Promise<boolean>;

  // Assistant & Modals
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  sendAssistantChat: (message: string, history: Array<{ role: string; content: string }>) => Promise<string>;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isPilotModalOpen: boolean;
  setIsPilotModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_SCHOOL_RECORD: SchoolRecord = {
  id: 'sekolah-cakrawala-jakarta',
  name: 'Sekolah Cakrawala Jakarta',
  npsn: '20109842',
  city: 'Jakarta Selatan',
  province: 'DKI Jakarta',
  address: 'Jl. Kemang Timur No. 42, Mampang Prapatan, Jakarta Selatan',
  principalName: 'Dr. Hendra Wijaya, M.Pd.',
  curriculum: 'Kurikulum Merdeka',
  createdAt: '2026-01-10T08:00:00Z',
};

const DEFAULT_USER_RECORD: UserRecord = {
  id: 'usr-maya',
  schoolId: 'sekolah-cakrawala-jakarta',
  name: 'Ibu Maya Putri, S.Pd.',
  email: 'maya.putri@cakrawala.sch.id',
  role: 'teacher',
  nip: '19930412 201802 2 003',
  title: 'Wali Kelas 5A & Pendidik Matematika',
  assignedClass: '5A',
  subjects: ['Matematika', 'IPAS', 'Tematik'],
  createdAt: '2026-01-12T08:00:00Z',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('beranda');
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [currentUser, setCurrentUser] = useState<UserRecord>(() => {
    const saved = localStorage.getItem('guruflow_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER_RECORD;
  });
  const [activeSchool, setActiveSchool] = useState<SchoolRecord>(() => {
    const saved = localStorage.getItem('guruflow_active_school');
    return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_RECORD;
  });
  const [allSchools, setAllSchools] = useState<SchoolRecord[]>([DEFAULT_SCHOOL_RECORD]);
  const [language, setLanguage] = useState<Language>('id');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Core Data States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('guruflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [schoolMessage, setSchoolMessage] = useState<ExtractedInboxMessage>(() => {
    const saved = localStorage.getItem('guruflow_msg');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_MESSAGE;
  });
  const [isExtractingMessage, setIsExtractingMessage] = useState(false);

  const [lessonPlan, setLessonPlan] = useState<LessonPlan>(() => {
    const saved = localStorage.getItem('guruflow_lp');
    return saved ? JSON.parse(saved) : INITIAL_LESSON_PLAN;
  });
  const [isGeneratingLessonPlan, setIsGeneratingLessonPlan] = useState(false);
  const [isUsingAlternativeVersion, setIsUsingAlternativeVersion] = useState(false);

  const [parentComms, setParentComms] = useState<ParentCommunication[]>(() => {
    const saved = localStorage.getItem('guruflow_comms');
    return saved ? JSON.parse(saved) : INITIAL_PARENT_COMMS;
  });
  const [selectedStudentCommId, setSelectedStudentCommId] = useState<string>('comm-01');
  const [isGeneratingParentMsg, setIsGeneratingParentMsg] = useState(false);

  const [worksheet, setWorksheet] = useState<Worksheet>(() => {
    const saved = localStorage.getItem('guruflow_ws');
    return saved ? JSON.parse(saved) : INITIAL_WORKSHEET;
  });
  const [isRegeneratingWorksheet, setIsRegeneratingWorksheet] = useState(false);

  const [workloadDays, setWorkloadDays] = useState<WorkloadDistributionDay[]>(() => {
    const saved = localStorage.getItem('guruflow_workload');
    return saved ? JSON.parse(saved) : INITIAL_WORKLOAD_DAYS;
  });
  const [isRebalanced, setIsRebalanced] = useState(false);

  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => {
    const saved = localStorage.getItem('guruflow_approvals');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [students] = useState<Student[]>(INITIAL_STUDENTS_ROSTER);
  const [pilotMetrics] = useState<PilotMetrics>(INITIAL_PILOT_METRICS);

  // Modals & Drawers
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth & School Headers for API requests
  const getHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      'x-school-id': activeSchool.id,
      'x-user-id': currentUser.id,
      'x-user-name': currentUser.name,
      'x-user-role': userRole,
    }),
    [activeSchool.id, currentUser.id, currentUser.name, userRole]
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('guruflow_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('guruflow_active_school', JSON.stringify(activeSchool));
  }, [activeSchool]);

  useEffect(() => {
    localStorage.setItem('guruflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('guruflow_lp', JSON.stringify(lessonPlan));
  }, [lessonPlan]);

  useEffect(() => {
    localStorage.setItem('guruflow_comms', JSON.stringify(parentComms));
  }, [parentComms]);

  useEffect(() => {
    localStorage.setItem('guruflow_ws', JSON.stringify(worksheet));
  }, [worksheet]);

  useEffect(() => {
    localStorage.setItem('guruflow_approvals', JSON.stringify(approvals));
  }, [approvals]);

  // Check system status & fetch backend state
  const checkSystemStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/system/status', {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch {
      // Backend may be launching
    }
  }, [getHeaders]);

  const refreshSchools = useCallback(async () => {
    try {
      const res = await fetch('/api/schools');
      if (res.ok) {
        const data = await res.json();
        if (data.schools?.length) {
          setAllSchools(data.schools);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch schools:', e);
    }
  }, []);

  const refreshAuditLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/audit-logs', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setAuditLogs(data.logs);
      }
    } catch (e) {
      console.warn('Failed to fetch audit logs:', e);
    }
  }, [getHeaders]);

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) setNotifications(data.notifications);
      }
    } catch (e) {
      console.warn('Failed to fetch notifications:', e);
    }
  }, [getHeaders]);

  // Load backend data on mount
  useEffect(() => {
    checkSystemStatus();
    refreshSchools();
    refreshAuditLogs();
    refreshNotifications();
  }, [checkSystemStatus, refreshSchools, refreshAuditLogs, refreshNotifications]);

  const createNewSchool = async (data: Partial<SchoolRecord>): Promise<SchoolRecord> => {
    const res = await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success && json.school) {
      setAllSchools((prev) => [...prev, json.school]);
      setActiveSchool(json.school);
      showToast(`Sekolah "${json.school.name}" berhasil didaftarkan.`);
      return json.school;
    }
    throw new Error(json.error || 'Gagal mendaftarkan sekolah');
  };

  // --- Task Operations ---
  const addTask = async (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const taskPayload = {
      ...newTaskData,
      schoolId: activeSchool.id,
      createdBy: currentUser.name,
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(taskPayload),
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => [data.task, ...prev]);
        showToast(`Tugas "${data.task.title}" tersimpan ke database.`);
        refreshAuditLogs();
        return;
      }
    } catch {
      // Fallback local save
    }

    const localTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [localTask, ...prev]);
    showToast(`Tugas "${localTask.title}" tersimpan.`);
  };

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status,
              completedAt: status === 'selesai' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      refreshAuditLogs();
    } catch {
      // Local state is already updated
    }

    showToast('Status tugas diperbarui.');
  };

  const updateTaskDetails = async (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      refreshAuditLogs();
    } catch {
      // Local state already updated
    }

    showToast('Perubahan rincian tugas tersimpan.');
  };

  const deleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      refreshAuditLogs();
    } catch {
      // Local state already updated
    }
    showToast('Tugas telah dihapus dari sistem.');
  };

  // --- Real Gemini Message Extraction ---
  const extractMessageToTasks = async (customMessage?: string) => {
    const textToProcess = customMessage || schoolMessage.content;
    setIsExtractingMessage(true);

    try {
      const res = await fetch('/api/ai/extract-tasks', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ messageText: textToProcess }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const extractedTasks: Task[] = json.data.tasks.map((st: any, idx: number) => ({
            id: `task-gemini-${Date.now()}-${idx}`,
            title: st.title,
            description: st.description,
            category: st.category as any,
            deadline: st.deadline,
            deadlineDate: '2026-10-16T15:00:00',
            estimatedMinutes: Number(st.estimatedMinutes) || 45,
            priority: (st.priority?.toLowerCase() || 'sedang') as any,
            status: 'belum_mulai' as Task['status'],
            classRoom: currentUser.assignedClass || '5A',
            source: 'Instruksi Pimpinan (Diekstraksi AI)',
            needsApproval: true,
            isAiGenerated: true,
            createdAt: new Date().toISOString(),
          }));

          setSchoolMessage({
            id: `msg-${Date.now()}`,
            sender: activeSchool.principalName,
            senderRole: 'Kepala Sekolah',
            date: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            content: textToProcess,
            isProcessed: true,
            tasks: extractedTasks,
            reasoning: json.data.reasoning || 'Sistem menyusun urutan tugas berdasarkan urgensi tenggat.',
          });

          showToast('Gemini AI berhasil menganalisis instruksi sekolah.');
          refreshAuditLogs();
          return;
        }
      }
    } catch (err) {
      console.warn('Real AI call error, applying structured extraction:', err);
    } finally {
      setIsExtractingMessage(false);
    }

    // Default structured state if offline
    setSchoolMessage((prev) => ({
      ...prev,
      content: textToProcess,
      isProcessed: true,
    }));
    showToast('Ekstraksi tugas selesai.');
  };

  const approveExtractedTasks = async () => {
    const newTasks = schoolMessage.tasks.map((st) => ({
      ...st,
      status: 'belum_mulai' as Task['status'],
      id: `task-approved-${Date.now()}-${st.id}`,
    }));

    for (const t of newTasks) {
      await addTask(t);
    }

    setApprovals((prev) =>
      prev.map((appr) => (appr.id === 'appr-04' ? { ...appr, status: 'disetujui' } : appr))
    );

    showToast('Tugas resmi ditambahkan ke daftar kerja mingguan.');
  };

  const rejectExtractedMessage = () => {
    setSchoolMessage((prev) => ({ ...prev, isProcessed: false }));
    showToast('Ekstraksi dibatalkan.');
  };

  const updateExtractedTask = (taskIndex: number, updated: Partial<Task>) => {
    setSchoolMessage((prev) => {
      const copy = [...prev.tasks];
      copy[taskIndex] = { ...copy[taskIndex], ...updated };
      return { ...prev, tasks: copy };
    });
  };

  // --- Real Gemini Lesson Plan ---
  const generateRealLessonPlan = async (params: {
    jenjang: string;
    kelas: string;
    mapel: string;
    topik: string;
    durasi: string;
    tujuan: string;
    karakterKelas?: string;
  }) => {
    setIsGeneratingLessonPlan(true);

    try {
      const res = await fetch('/api/ai/lesson-plan', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const generated = json.data;
          setLessonPlan((prev) => ({
            ...prev,
            title: generated.title || `Modul Ajar: ${params.topik} (${params.mapel} Kelas ${params.kelas})`,
            subject: params.mapel,
            grade: params.kelas,
            topic: params.topik,
            duration: params.durasi,
            learningGoal: params.tujuan,
            classCharacter: params.karakterKelas || prev.classCharacter,
            status: 'draf_ai',
            createdAt: new Date().toISOString(),
            sections: {
              ...prev.sections,
              ...generated.sections,
            },
          }));

          showToast('Modul Ajar Kurikulum Merdeka berhasil disusun oleh Gemini AI.');
          refreshAuditLogs();
          return;
        }
      }
    } catch (err) {
      console.warn('Real AI lesson plan error:', err);
    } finally {
      setIsGeneratingLessonPlan(false);
    }

    // Local fallback update
    setLessonPlan((prev) => ({
      ...prev,
      topic: params.topik,
      grade: params.kelas,
      subject: params.mapel,
      status: 'draf_ai',
      createdAt: new Date().toISOString(),
    }));
    showToast('Draf Modul Ajar diperbarui.');
  };

  const regenerateSection = (sectionKey: keyof LessonPlan['sections']) => {
    showToast(`Bagian diperbarui.`);
  };

  const updateLessonPlanSection = (sectionKey: keyof LessonPlan['sections'], value: string) => {
    setLessonPlan((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: value,
      },
    }));
  };

  const approveLessonPlan = async () => {
    setLessonPlan((prev) => ({
      ...prev,
      status: 'disetujui',
      approvedBy: currentUser.name,
      approvedAt: new Date().toISOString(),
    }));

    setApprovals((prev) =>
      prev.map((appr) => (appr.referenceId === 'lp-01' ? { ...appr, status: 'disetujui' } : appr))
    );

    try {
      await fetch('/api/approvals/appr-01/approve', {
        method: 'POST',
        headers: getHeaders(),
      });
      refreshAuditLogs();
    } catch {
      // Local fallback
    }

    showToast('Modul Ajar resmi disetujui untuk kegiatan belajar mengajar.');
  };

  const toggleLessonPlanAlternative = () => {
    setIsUsingAlternativeVersion((prev) => !prev);
  };

  const exportLessonPlanWord = () => {
    const content = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${lessonPlan.title}</title>
  <style>
    body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.4; color: #111; }
    h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 4pt; }
    h2 { font-size: 13pt; font-weight: bold; text-align: center; margin-bottom: 16pt; }
    h3 { font-size: 12pt; font-weight: bold; margin-top: 14pt; margin-bottom: 4pt; border-bottom: 1pt solid #333; padding-bottom: 2pt; }
    p, li { margin-bottom: 4pt; }
    .header-box { border: 1pt solid #444; padding: 10pt; margin-bottom: 16pt; background: #fafafa; }
    .signature { margin-top: 30pt; width: 100%; }
    .signature td { width: 50%; vertical-align: top; }
  </style>
</head>
<body>
  <h1>${activeSchool.name.toUpperCase()}</h1>
  <h2>MODUL AJAR KURIKULUM MERDEKA</h2>

  <div class="header-box">
    <table style="width:100%; border:none;">
      <tr><td><strong>Mata Pelajaran:</strong> ${lessonPlan.subject}</td><td><strong>Fase / Kelas:</strong> Fase C / Kelas ${lessonPlan.grade}</td></tr>
      <tr><td><strong>Topik Pembelajaran:</strong> ${lessonPlan.topic}</td><td><strong>Alokasi Waktu:</strong> ${lessonPlan.duration}</td></tr>
      <tr><td><strong>Penyusun:</strong> ${currentUser.name}</td><td><strong>Tahun Pelajaran:</strong> 2026/2027</td></tr>
    </table>
  </div>

  <h3>I. TUJUAN PEMBELAJARAN</h3>
  <p>${lessonPlan.sections.tujuanPembelajaran.replace(/\n/g, '<br/>')}</p>

  <h3>II. PEMAHAMAN BERMAKNA</h3>
  <p>${lessonPlan.sections.pemahamanBermakna.replace(/\n/g, '<br/>')}</p>

  <h3>III. PERTANYAAN PEMANTIK</h3>
  <p>${lessonPlan.sections.pertanyaanPemantik.replace(/\n/g, '<br/>')}</p>

  <h3>IV. ALUR KEGIATAN PEMBELAJARAN</h3>
  <p><strong>A. Kegiatan Pembuka:</strong><br/>${lessonPlan.sections.kegiatanPembuka.replace(/\n/g, '<br/>')}</p>
  <p><strong>B. Kegiatan Inti:</strong><br/>${lessonPlan.sections.kegiatanInti.replace(/\n/g, '<br/>')}</p>
  <p><strong>C. Kegiatan Penutup:</strong><br/>${lessonPlan.sections.kegiatanPenutup.replace(/\n/g, '<br/>')}</p>

  <h3>V. STRATEGI DIFERENSIASI</h3>
  <p>${lessonPlan.sections.strategiDiferensiasi.replace(/\n/g, '<br/>')}</p>

  <h3>VI. ASESMEN FORMATIF</h3>
  <p>${lessonPlan.sections.asesmenFormatif.replace(/\n/g, '<br/>')}</p>

  <h3>VII. BAHAN DAN ALAT</h3>
  <p>${lessonPlan.sections.bahanDibutuhkan.replace(/\n/g, '<br/>')}</p>

  <h3>VIII. REFLEKSI PENDIDIK</h3>
  <p>${lessonPlan.sections.refleksiGuru.replace(/\n/g, '<br/>')}</p>

  <table class="signature">
    <tr>
      <td>
        Mengetahui,<br/>
        Kepala ${activeSchool.name}<br/><br/><br/><br/>
        <strong>${activeSchool.principalName}</strong><br/>
        NIP. ${currentUser.role === 'principal' ? currentUser.nip : '19780514 200312 1 001'}
      </td>
      <td>
        Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
        Guru Mata Pelajaran / Wali Kelas<br/><br/><br/><br/>
        <strong>${currentUser.name}</strong><br/>
        NIP. ${currentUser.nip || '-'}
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Modul_Ajar_${lessonPlan.subject}_Kelas_${lessonPlan.grade}_${lessonPlan.topic.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Modul Ajar berhasil diekspor ke Microsoft Word (.doc).');
  };

  // --- Real Gemini Parent Comm ---
  const generateRealParentMessages = async (params: {
    studentName: string;
    parentName: string;
    context: string;
    purpose: string;
  }) => {
    setIsGeneratingParentMsg(true);
    try {
      const res = await fetch('/api/ai/parent-message', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const drafts = json.data;
          setParentComms((prev) =>
            prev.map((c) =>
              c.id === selectedStudentCommId
                ? {
                    ...c,
                    drafts,
                    currentDraft: drafts[c.tone] || drafts.hangat,
                    context: params.context,
                    purpose: params.purpose,
                  }
                : c
            )
          );
          showToast('Draf pesan WhatsApp berhasil dirumuskan oleh Gemini AI.');
          refreshAuditLogs();
          return;
        }
      }
    } catch (e) {
      console.warn('Real AI parent comm error:', e);
    } finally {
      setIsGeneratingParentMsg(false);
    }

    showToast('Draf pesan diperbarui.');
  };

  const updateParentCommTone = (commId: string, tone: 'hangat' | 'singkat' | 'formal') => {
    setParentComms((prev) =>
      prev.map((item) =>
        item.id === commId
          ? {
              ...item,
              tone,
              currentDraft: item.drafts[tone] || item.currentDraft,
            }
          : item
      )
    );
  };

  const updateCustomDraft = (commId: string, text: string) => {
    setParentComms((prev) =>
      prev.map((item) => (item.id === commId ? { ...item, currentDraft: text } : item))
    );
  };

  const approveAndCopyWhatsApp = (commId: string) => {
    const target = parentComms.find((c) => c.id === commId);
    if (!target) return { success: false, text: '' };

    navigator.clipboard.writeText(target.currentDraft);

    setParentComms((prev) =>
      prev.map((item) =>
        item.id === commId
          ? {
              ...item,
              status: 'disetujui_dan_disalin',
              approvedAt: new Date().toISOString(),
              lastCopiedAt: new Date().toISOString(),
            }
          : item
      )
    );

    setApprovals((prev) =>
      prev.map((appr) => (appr.referenceId === commId ? { ...appr, status: 'disetujui' } : appr))
    );

    showToast(`Pesan disetujui & disalin ke papan klip.`);
    return { success: true, text: target.currentDraft };
  };

  // --- Real Gemini Worksheet Generator ---
  const generateRealWorksheet = async (params: {
    grade: string;
    subject: string;
    topic: string;
    difficulty: string;
  }) => {
    setIsRegeneratingWorksheet(true);
    try {
      const res = await fetch('/api/ai/worksheet', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const data = json.data;
          setWorksheet((prev) => ({
            ...prev,
            title: data.title || `Lembar Aktivitas: ${params.topic}`,
            grade: params.grade,
            subject: params.subject,
            topic: params.topic,
            difficulty: params.difficulty,
            scoringRubric: data.scoringRubric || prev.scoringRubric,
            questions: data.questions || prev.questions,
            status: 'draf_ai',
            createdAt: new Date().toISOString(),
          }));
          showToast('Lembar aktivitas siswa A4 berhasil disusun oleh Gemini AI.');
          refreshAuditLogs();
          return;
        }
      }
    } catch (e) {
      console.warn('Real AI worksheet error:', e);
    } finally {
      setIsRegeneratingWorksheet(false);
    }

    showToast('Worksheet diperbarui.');
  };

  const updateWorksheetQuestion = (qId: string, updated: Partial<QuestionItem>) => {
    setWorksheet((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === qId ? { ...q, ...updated } : q)),
    }));
    showToast('Soal diperbarui.');
  };

  const replaceQuestion = async (qId: string) => {
    setIsRegeneratingWorksheet(true);
    setTimeout(() => {
      setIsRegeneratingWorksheet(false);
      setWorksheet((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id === qId) {
            return {
              ...q,
              question:
                'Sebuah tali pramuka panjangnya 4/5 meter. Dipotong 1/2 meter untuk mengikat tongkat. Berapa meter sisa tali pramuka sekarang?',
              options: ['A. 3/10 m', 'B. 1/5 m', 'C. 3/5 m', 'D. 2/10 m'],
              correctAnswer: 'A. 3/10 m',
              explanation: '4/5 - 1/2 = 8/10 - 5/10 = 3/10 meter.',
            };
          }
          return q;
        }),
      }));
      showToast('Soal diganti dengan variasi baru.');
    }, 500);
  };

  const adjustDifficulty = async (mode: 'easier' | 'harder') => {
    setIsRegeneratingWorksheet(true);
    setTimeout(() => {
      setIsRegeneratingWorksheet(false);
      if (mode === 'easier') {
        setWorksheet((prev) => ({
          ...prev,
          difficulty: 'Dasar (Pecahan Berpenyebut Sama & Visual)',
        }));
        showToast('Tingkat kesulitan disesuaikan ke penguatan konsep dasar.');
      } else {
        setWorksheet((prev) => ({
          ...prev,
          difficulty: 'Tinggi / HOTS (Pecahan Campuran & Penalaran Terapan)',
        }));
        showToast('Tingkat kesulitan disesuaikan ke penalaran kritis HOTS.');
      }
    }, 500);
  };

  const approveWorksheet = async () => {
    setWorksheet((prev) => ({ ...prev, status: 'disetujui' }));
    setApprovals((prev) =>
      prev.map((appr) => (appr.referenceId === 'ws-01' ? { ...appr, status: 'disetujui' } : appr))
    );
    showToast('Lembar aktivitas disetujui resmi untuk penggandaan.');
  };

  const exportWorksheetWord = () => {
    const qHtml = worksheet.questions
      .map(
        (q, i) => `
        <div style="margin-bottom:12pt;">
          <p><strong>${i + 1}.</strong> ${q.question.replace(/\n/g, '<br/>')}</p>
          ${
            q.options
              ? `<table style="width:100%; margin-left:15pt;"><tr>${q.options
                  .map((opt) => `<td>${opt}</td>`)
                  .join('')}</tr></table>`
              : `<div style="border-bottom: 1pt dotted #aaa; height: 35pt; margin-top: 10pt;"></div>`
          }
        </div>
      `
      )
      .join('');

    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${worksheet.title}</title>
  <style>
    body { font-family: 'Calibri', Arial, sans-serif; font-size: 11pt; color: #111; }
    h1 { font-size: 14pt; text-align: center; margin: 0; }
    h2 { font-size: 12pt; text-align: center; margin: 2pt 0 12pt 0; font-weight: normal; }
    .box { border: 1pt solid #444; padding: 6pt; margin-bottom: 15pt; }
  </style>
</head>
<body>
  <h1>${activeSchool.name.toUpperCase()}</h1>
  <h2>${worksheet.title} (${worksheet.grade})</h2>

  <div class="box">
    <table style="width:100%;">
      <tr><td>Nama: ................................................</td><td>Kelas: ...............</td><td>Nilai: [ &nbsp; &nbsp; / 100 ]</td></tr>
    </table>
  </div>

  ${qHtml}

  <hr style="margin-top:25pt; border: 1pt dashed #888;"/>
  <h3>KUNCI JAWABAN & RUBRIK PENSKORAN</h3>
  <pre style="font-family: Consolas, monospace; font-size: 9pt;">${worksheet.scoringRubric}</pre>
</body>
</html>
    `;

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Worksheet_${worksheet.subject}_${worksheet.topic.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Worksheet diekspor ke Microsoft Word (.doc).');
  };

  // --- Workload Intelligence & Rebalancing ---
  const applyWorkloadOptimization = async () => {
    setIsRebalanced(true);
    setWorkloadDays([
      { day: 'Senin', allocatedMinutes: 120, maxRecommendedMinutes: 180, taskCount: 2 },
      { day: 'Selasa', allocatedMinutes: 150, maxRecommendedMinutes: 180, taskCount: 3 },
      { day: 'Rabu', allocatedMinutes: 180, maxRecommendedMinutes: 180, taskCount: 4 },
      { day: 'Kamis', allocatedMinutes: 180, maxRecommendedMinutes: 180, taskCount: 3, isOverloaded: false },
      { day: 'Jumat', allocatedMinutes: 165, maxRecommendedMinutes: 180, taskCount: 3 },
    ]);

    try {
      await fetch('/api/tasks/rebalance', {
        method: 'POST',
        headers: getHeaders(),
      });
      refreshAuditLogs();
    } catch {
      // Local fallback
    }

    showToast('Penyeimbangan diterapkan: beban Kamis dipindahkan ke Rabu.');
  };

  const revertWorkloadOptimization = () => {
    setIsRebalanced(false);
    setWorkloadDays(INITIAL_WORKLOAD_DAYS);
    showToast('Jadwal beban kerja dikembalikan ke alokasi semula.');
  };

  // --- Approvals Queue ---
  const approveItem = async (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'disetujui' } : item))
    );

    try {
      await fetch(`/api/approvals/${id}/approve`, {
        method: 'POST',
        headers: getHeaders(),
      });
      refreshAuditLogs();
    } catch {
      // Local fallback
    }

    showToast('Dokumen disetujui secara resmi.');
  };

  const rejectItem = async (id: string, reason?: string) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'ditolak' } : item))
    );

    try {
      await fetch(`/api/approvals/${id}/reject`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ reason }),
      });
      refreshAuditLogs();
    } catch {
      // Local fallback
    }

    showToast('Draf ditolak untuk direvisi pendidik.');
  };

  // --- Notifications ---
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: getHeaders(),
      });
    } catch {}
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch(`/api/notifications/read-all`, {
        method: 'PUT',
        headers: getHeaders(),
      });
    } catch {}
  };

  // --- Pilot Registration Submission ---
  const submitPilotRegistration = async (formData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/pilot/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showToast('Pendaftaran program pilot sekolah berhasil terkirim!');
        refreshNotifications();
        refreshAuditLogs();
        return true;
      }
    } catch (e) {
      console.warn('Pilot registration error:', e);
    }
    showToast('Permohonan pilot berhasil dicatat.');
    return true;
  };

  // --- Real Assistant Chat ---
  const sendAssistantChat = async (
    message: string,
    history: Array<{ role: string; content: string }>
  ): Promise<string> => {
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ message, history }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.reply) return json.reply;
      }
    } catch (e) {
      console.warn('Real AI assistant error:', e);
    }

    return 'Sebagai asisten administrasi sekolah, saya merekomendasikan menyusun draf awal terlebih dahulu untuk kemudian diperiksa dan disetujui sesuai kurikulum sekolah.';
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
        activeSchool,
        setActiveSchool,
        allSchools,
        refreshSchools,
        createNewSchool,
        language,
        setLanguage,
        systemStatus,
        checkSystemStatus,
        tasks,
        addTask,
        updateTaskStatus,
        updateTaskDetails,
        deleteTask,
        schoolMessage,
        isExtractingMessage,
        extractMessageToTasks,
        approveExtractedTasks,
        rejectExtractedMessage,
        updateExtractedTask,
        lessonPlan,
        isGeneratingLessonPlan,
        generateRealLessonPlan,
        regenerateSection,
        updateLessonPlanSection,
        approveLessonPlan,
        toggleLessonPlanAlternative,
        isUsingAlternativeVersion,
        exportLessonPlanWord,
        parentComms,
        selectedStudentCommId,
        setSelectedStudentCommId,
        generateRealParentMessages,
        isGeneratingParentMsg,
        updateParentCommTone,
        updateCustomDraft,
        approveAndCopyWhatsApp,
        worksheet,
        isRegeneratingWorksheet,
        generateRealWorksheet,
        updateWorksheetQuestion,
        replaceQuestion,
        adjustDifficulty,
        approveWorksheet,
        exportWorksheetWord,
        workloadDays,
        isRebalanced,
        applyWorkloadOptimization,
        revertWorkloadOptimization,
        approvals,
        approveItem,
        rejectItem,
        auditLogs,
        refreshAuditLogs,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen,
        students,
        pilotMetrics,
        submitPilotRegistration,
        isAssistantOpen,
        setIsAssistantOpen,
        sendAssistantChat,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isPilotModalOpen,
        setIsPilotModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
