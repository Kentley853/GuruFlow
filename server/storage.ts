import fs from 'fs';
import path from 'path';

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
  passwordHash: string; // Stored securely
  role: 'teacher' | 'principal' | 'curriculum_admin';
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

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SCHOOLS_DIR = path.resolve(DATA_DIR, 'schools');

// Helper to ensure directories exist
function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper to read JSON file safely
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filePath, fallback);
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

// Helper to write JSON file safely
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    ensureDir(path.dirname(filePath));
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initial default seed data for Sekolah Cakrawala Jakarta
const DEFAULT_SCHOOL: SchoolRecord = {
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

const DEFAULT_USERS: UserRecord[] = [
  {
    id: 'usr-maya',
    schoolId: 'sekolah-cakrawala-jakarta',
    name: 'Ibu Maya Putri, S.Pd.',
    email: 'maya.putri@cakrawala.sch.id',
    passwordHash: 'guru2026', // Verified in login
    role: 'teacher',
    nip: '19930412 201802 2 003',
    title: 'Wali Kelas 5A & Pendidik Matematika',
    assignedClass: '5A',
    subjects: ['Matematika', 'IPAS', 'Tematik'],
    createdAt: '2026-01-12T08:00:00Z',
  },
  {
    id: 'usr-hendra',
    schoolId: 'sekolah-cakrawala-jakarta',
    name: 'Dr. Hendra Wijaya, M.Pd.',
    email: 'hendra.wijaya@cakrawala.sch.id',
    passwordHash: 'kepsek2026',
    role: 'principal',
    nip: '19780514 200312 1 001',
    title: 'Kepala Sekolah Cakrawala Jakarta',
    subjects: ['Manajemen Sekolah'],
    createdAt: '2026-01-10T08:00:00Z',
  },
];

export class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    ensureDir(DATA_DIR);
    ensureDir(SCHOOLS_DIR);

    // Initialize Default School if not present
    const schoolDir = path.join(SCHOOLS_DIR, DEFAULT_SCHOOL.id);
    ensureDir(schoolDir);

    const schoolInfoPath = path.join(schoolDir, 'school.json');
    if (!fs.existsSync(schoolInfoPath)) {
      writeJsonFile(schoolInfoPath, DEFAULT_SCHOOL);
    }

    const usersPath = path.join(schoolDir, 'users.json');
    if (!fs.existsSync(usersPath)) {
      writeJsonFile(usersPath, DEFAULT_USERS);
    }
  }

  // --- Schools ---
  getAllSchools(): SchoolRecord[] {
    const list: SchoolRecord[] = [];
    if (!fs.existsSync(SCHOOLS_DIR)) return list;
    const entries = fs.readdirSync(SCHOOLS_DIR, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.isDirectory()) {
        const infoPath = path.join(SCHOOLS_DIR, ent.name, 'school.json');
        const sc = readJsonFile<SchoolRecord | null>(infoPath, null);
        if (sc) list.push(sc);
      }
    }
    return list;
  }

  getSchool(schoolId: string): SchoolRecord | null {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'school.json');
    return readJsonFile<SchoolRecord | null>(filePath, null);
  }

  createSchool(school: SchoolRecord): SchoolRecord {
    const schoolDir = path.join(SCHOOLS_DIR, school.id);
    ensureDir(schoolDir);
    writeJsonFile(path.join(schoolDir, 'school.json'), school);
    return school;
  }

  // --- Users & Auth ---
  getUsers(schoolId: string): UserRecord[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'users.json');
    return readJsonFile<UserRecord[]>(filePath, []);
  }

  getUserByEmail(email: string): UserRecord | null {
    const schools = this.getAllSchools();
    for (const sc of schools) {
      const users = this.getUsers(sc.id);
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) return found;
    }
    return null;
  }

  createUser(user: UserRecord): UserRecord {
    const filePath = path.join(SCHOOLS_DIR, user.schoolId, 'users.json');
    const users = readJsonFile<UserRecord[]>(filePath, []);
    users.push(user);
    writeJsonFile(filePath, users);
    return user;
  }

  // --- Tasks (Per School) ---
  getTasks(schoolId: string): any[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'tasks.json');
    return readJsonFile<any[]>(filePath, []);
  }

  saveTasks(schoolId: string, tasks: any[]): void {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'tasks.json');
    writeJsonFile(filePath, tasks);
  }

  createTask(schoolId: string, task: any): any {
    const tasks = this.getTasks(schoolId);
    tasks.unshift(task);
    this.saveTasks(schoolId, tasks);
    return task;
  }

  updateTask(schoolId: string, taskId: string, updates: any): any {
    const tasks = this.getTasks(schoolId);
    let updated: any = null;
    const nextTasks = tasks.map((t) => {
      if (t.id === taskId) {
        updated = { ...t, ...updates };
        return updated;
      }
      return t;
    });
    this.saveTasks(schoolId, nextTasks);
    return updated;
  }

  deleteTask(schoolId: string, taskId: string): boolean {
    const tasks = this.getTasks(schoolId);
    const filtered = tasks.filter((t) => t.id !== taskId);
    this.saveTasks(schoolId, filtered);
    return true;
  }

  // --- Lesson Plans ---
  getLessonPlans(schoolId: string): any[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'lesson_plans.json');
    return readJsonFile<any[]>(filePath, []);
  }

  saveLessonPlan(schoolId: string, plan: any): any {
    const plans = this.getLessonPlans(schoolId);
    const index = plans.findIndex((p) => p.id === plan.id);
    if (index >= 0) {
      plans[index] = plan;
    } else {
      plans.unshift(plan);
    }
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'lesson_plans.json');
    writeJsonFile(filePath, plans);
    return plan;
  }

  // --- Worksheets ---
  getWorksheets(schoolId: string): any[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'worksheets.json');
    return readJsonFile<any[]>(filePath, []);
  }

  saveWorksheet(schoolId: string, sheet: any): any {
    const sheets = this.getWorksheets(schoolId);
    const index = sheets.findIndex((s) => s.id === sheet.id);
    if (index >= 0) {
      sheets[index] = sheet;
    } else {
      sheets.unshift(sheet);
    }
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'worksheets.json');
    writeJsonFile(filePath, sheets);
    return sheet;
  }

  // --- Parent Communications ---
  getParentComms(schoolId: string): any[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'parent_comms.json');
    return readJsonFile<any[]>(filePath, []);
  }

  saveParentComm(schoolId: string, comm: any): any {
    const comms = this.getParentComms(schoolId);
    const index = comms.findIndex((c) => c.id === comm.id);
    if (index >= 0) {
      comms[index] = comm;
    } else {
      comms.unshift(comm);
    }
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'parent_comms.json');
    writeJsonFile(filePath, comms);
    return comm;
  }

  // --- Students Roster ---
  getStudents(schoolId: string): any[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'students.json');
    return readJsonFile<any[]>(filePath, []);
  }

  saveStudents(schoolId: string, students: any[]): void {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'students.json');
    writeJsonFile(filePath, students);
  }

  // --- Approvals Queue ---
  getApprovals(schoolId: string): any[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'approvals.json');
    return readJsonFile<any[]>(filePath, []);
  }

  saveApprovals(schoolId: string, approvals: any[]): void {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'approvals.json');
    writeJsonFile(filePath, approvals);
  }

  // --- Audit Logs ---
  getAuditLogs(schoolId: string): AuditRecord[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'audit_logs.json');
    return readJsonFile<AuditRecord[]>(filePath, []);
  }

  addAuditLog(log: AuditRecord): void {
    const filePath = path.join(SCHOOLS_DIR, log.schoolId, 'audit_logs.json');
    const logs = readJsonFile<AuditRecord[]>(filePath, []);
    logs.unshift(log);
    // Keep last 500 audit items
    if (logs.length > 500) logs.length = 500;
    writeJsonFile(filePath, logs);
  }

  // --- Notifications ---
  getNotifications(schoolId: string, userId: string): NotificationRecord[] {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'notifications.json');
    const all = readJsonFile<NotificationRecord[]>(filePath, []);
    return all.filter((n) => n.userId === userId || n.userId === 'all');
  }

  addNotification(notif: NotificationRecord): void {
    const filePath = path.join(SCHOOLS_DIR, notif.schoolId, 'notifications.json');
    const all = readJsonFile<NotificationRecord[]>(filePath, []);
    all.unshift(notif);
    writeJsonFile(filePath, all);
  }

  markNotificationRead(schoolId: string, notificationId: string): void {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'notifications.json');
    const all = readJsonFile<NotificationRecord[]>(filePath, []);
    const updated = all.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n));
    writeJsonFile(filePath, updated);
  }

  markAllNotificationsRead(schoolId: string, userId: string): void {
    const filePath = path.join(SCHOOLS_DIR, schoolId, 'notifications.json');
    const all = readJsonFile<NotificationRecord[]>(filePath, []);
    const updated = all.map((n) =>
      n.userId === userId || n.userId === 'all' ? { ...n, isRead: true } : n
    );
    writeJsonFile(filePath, updated);
  }
}

export const storage = new StorageService();
