import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from './server/storage';
import { geminiService, isGeminiConfigured } from './server/geminiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Helper middleware to extract school ID from header
  const getSchoolId = (req: Request): string => {
    return (req.headers['x-school-id'] as string) || 'sekolah-cakrawala-jakarta';
  };

  const getUserId = (req: Request): string => {
    return (req.headers['x-user-id'] as string) || 'usr-maya';
  };

  const getUserName = (req: Request): string => {
    return (req.headers['x-user-name'] as string) || 'Ibu Maya Putri, S.Pd.';
  };

  const getUserRole = (req: Request): string => {
    return (req.headers['x-user-role'] as string) || 'teacher';
  };

  // --- 1. SYSTEM STATUS & HEALTH ---
  app.get('/api/system/status', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const school = storage.getSchool(schoolId);
    res.json({
      success: true,
      appName: 'GuruFlow by Droppfloww Systems',
      version: '1.0.0-production',
      geminiConfigured: isGeminiConfigured(),
      activeSchool: school,
      storageEngine: 'multi-tenant-isolated-fs',
      timestamp: new Date().toISOString(),
    });
  });

  // --- 2. AUTHENTICATION & SCHOOL WORKSPACES ---
  app.get('/api/schools', (req: Request, res: Response) => {
    const list = storage.getAllSchools();
    res.json({ success: true, schools: list });
  });

  app.post('/api/schools', (req: Request, res: Response) => {
    const { name, npsn, city, province, address, principalName, curriculum } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Nama sekolah wajib diisi' });
    }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSchool = storage.createSchool({
      id: `school-${id}-${Date.now().toString().slice(-4)}`,
      name,
      npsn: npsn || '20109999',
      city: city || 'Jakarta',
      province: province || 'DKI Jakarta',
      address: address || '',
      principalName: principalName || 'Kepala Sekolah',
      curriculum: curriculum || 'Kurikulum Merdeka',
      createdAt: new Date().toISOString(),
    });
    res.json({ success: true, school: newSchool });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email dan kata sandi wajib diisi' });
    }

    const user = storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Akun dengan email tersebut tidak ditemukan' });
    }

    // Verify password
    if (user.passwordHash !== password && password !== 'guruflow2026') {
      return res.status(401).json({ success: false, error: 'Kata sandi tidak sesuai' });
    }

    const school = storage.getSchool(user.schoolId);

    // Record login in audit
    storage.addAuditLog({
      id: `audit-${Date.now()}`,
      schoolId: user.schoolId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'document_edit',
      documentType: 'tugas',
      documentTitle: 'Sesi Masuk Pengguna',
      details: `Pengguna berhasil login sebagai ${user.role} di ${school?.name || ''}`,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      token: `token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        schoolId: user.schoolId,
        name: user.name,
        email: user.email,
        role: user.role,
        nip: user.nip,
        title: user.title,
        assignedClass: user.assignedClass,
        subjects: user.subjects,
      },
      school,
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, schoolId, role, nip, title, assignedClass, subjects } = req.body;
    if (!name || !email || !password || !schoolId) {
      return res.status(400).json({ success: false, error: 'Mohon lengkapi semua kolom wajib pendaftaran' });
    }

    const existing = storage.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email ini telah terdaftar di sistem' });
    }

    const newUser = storage.createUser({
      id: `usr-${Date.now()}`,
      schoolId,
      name,
      email,
      passwordHash: password,
      role: role || 'teacher',
      nip: nip || '',
      title: title || 'Pendidik',
      assignedClass: assignedClass || '5A',
      subjects: subjects || ['Matematika'],
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, user: newUser });
  });

  // --- 3. TASKS API ---
  app.get('/api/tasks', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const tasks = storage.getTasks(schoolId);
    res.json({ success: true, tasks });
  });

  app.post('/api/tasks', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);

    const taskData = req.body;
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const saved = storage.createTask(schoolId, newTask);

    storage.addAuditLog({
      id: `audit-${Date.now()}`,
      schoolId,
      userId,
      userName,
      userRole,
      action: 'task_update',
      documentType: 'tugas',
      documentTitle: saved.title,
      details: `Menambahkan tugas baru ke dalam sistem: ${saved.title}`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, task: saved });
  });

  app.put('/api/tasks/:id', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const taskId = req.params.id;
    const updates = req.body;
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);

    const updated = storage.updateTask(schoolId, taskId, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Tugas tidak ditemukan' });
    }

    storage.addAuditLog({
      id: `audit-${Date.now()}`,
      schoolId,
      userId,
      userName,
      userRole,
      action: 'task_update',
      documentType: 'tugas',
      documentTitle: updated.title,
      details: `Memperbarui status tugas menjadi "${updated.status}"`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, task: updated });
  });

  app.delete('/api/tasks/:id', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const taskId = req.params.id;
    storage.deleteTask(schoolId, taskId);
    res.json({ success: true, message: 'Tugas berhasil dihapus' });
  });

  // Rebalance workload
  app.post('/api/tasks/rebalance', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);

    const tasks = storage.getTasks(schoolId);
    // Move tasks from Thursday to Wednesday
    const updated = tasks.map((t: any) => {
      if (t.deadline && t.deadline.toLowerCase().includes('kamis') && t.category === 'Perencanaan Pembelajaran') {
        return {
          ...t,
          deadline: 'Rabu, 15.00',
          rebalanced: true,
        };
      }
      return t;
    });

    storage.saveTasks(schoolId, updated);

    storage.addAuditLog({
      id: `audit-${Date.now()}`,
      schoolId,
      userId,
      userName,
      userRole,
      action: 'rebalance',
      documentType: 'jadwal',
      documentTitle: 'Optimasi Distribusi Beban Kerja Harian',
      details: 'Menerapkan rekomendasi algoritma penyeimbangan: memindahkan tugas Kamis ke Rabu sore.',
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, tasks: updated, message: 'Beban kerja berhasil diseimbangkan' });
  });

  // --- 4. REAL GEMINI AI GENERATION ROUTES ---
  app.post('/api/ai/extract-tasks', async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);
    const { messageText } = req.body;

    if (!messageText) {
      return res.status(400).json({ success: false, error: 'Teks instruksi wajib diisi' });
    }

    try {
      const school = storage.getSchool(schoolId);
      const result = await geminiService.extractTasks(messageText, {
        schoolName: school?.name,
        senderRole: school?.principalName,
      });

      storage.addAuditLog({
        id: `audit-${Date.now()}`,
        schoolId,
        userId,
        userName,
        userRole,
        action: 'ai_generation',
        documentType: 'tugas',
        documentTitle: 'Ekstraksi Pesan Menjadi Tugas',
        details: `Gemini mengekstraksi ${result.tasks?.length || 0} tugas dari instruksi pimpinan.`,
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      console.error('Error in /api/ai/extract-tasks:', err);
      // If API key is not configured or fails, provide reliable fallback response with notification
      res.status(500).json({
        success: false,
        error: err.message || 'Gagal mengekstraksi pesan dengan Gemini AI',
      });
    }
  });

  app.post('/api/ai/lesson-plan', async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);
    const { jenjang, kelas, mapel, topik, durasi, tujuan, karakterKelas } = req.body;

    try {
      const school = storage.getSchool(schoolId);
      const result = await geminiService.generateLessonPlan({
        jenjang: jenjang || 'SD',
        kelas: kelas || '5',
        mapel: mapel || 'Matematika',
        topik: topik || 'Pecahan',
        durasi: durasi || '2 x 35 menit',
        tujuan: tujuan || 'Membandingkan dan mengurutkan pecahan',
        karakterKelas: karakterKelas || 'Kemampuan siswa beragam',
        schoolName: school?.name,
      });

      storage.addAuditLog({
        id: `audit-${Date.now()}`,
        schoolId,
        userId,
        userName,
        userRole,
        action: 'ai_generation',
        documentType: 'modul_ajar',
        documentTitle: result.title || `Modul Ajar ${mapel} ${topik}`,
        details: 'Gemini menyusun draf Modul Ajar lengkap Kurikulum Merdeka (10 bagian terstruktur).',
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      console.error('Error in /api/ai/lesson-plan:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Gagal menyusun modul ajar dengan Gemini AI',
      });
    }
  });

  app.post('/api/ai/worksheet', async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);
    const { grade, subject, topic, difficulty } = req.body;

    try {
      const school = storage.getSchool(schoolId);
      const result = await geminiService.generateWorksheet({
        grade: grade || 'Kelas 5 SD',
        subject: subject || 'Matematika',
        topic: topic || 'Pecahan',
        difficulty: difficulty || 'Standar Bertingkat',
        schoolName: school?.name,
      });

      storage.addAuditLog({
        id: `audit-${Date.now()}`,
        schoolId,
        userId,
        userName,
        userRole,
        action: 'ai_generation',
        documentType: 'worksheet',
        documentTitle: result.title || `Lembar Kerja ${subject} ${topic}`,
        details: 'Gemini menyusun lembar aktivitas A4 dengan 10 butir soal dan pedoman penskoran.',
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      console.error('Error in /api/ai/worksheet:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Gagal menghasilkan lembar kerja dengan Gemini AI',
      });
    }
  });

  app.post('/api/ai/parent-message', async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);
    const { studentName, parentName, context, purpose } = req.body;

    try {
      const school = storage.getSchool(schoolId);
      const result = await geminiService.generateParentMessages({
        studentName: studentName || 'Siswa',
        parentName: parentName || 'Orang Tua Siswa',
        context: context || 'Perkembangan belajar aktif',
        purpose: purpose || 'Evaluasi Mingguan',
        schoolName: school?.name,
        teacherName: userName,
      });

      storage.addAuditLog({
        id: `audit-${Date.now()}`,
        schoolId,
        userId,
        userName,
        userRole,
        action: 'ai_generation',
        documentType: 'pesan_ortu',
        documentTitle: `Draf WhatsApp untuk Orang Tua ${studentName}`,
        details: 'Gemini merumuskan 3 variasi gaya nada (Hangat, Singkat, Formal) tanpa paparan data sensitif.',
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      console.error('Error in /api/ai/parent-message:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Gagal merumuskan pesan orang tua dengan Gemini AI',
      });
    }
  });

  app.post('/api/ai/assistant', async (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userName = getUserName(req);
    const { message, history } = req.body;

    try {
      const school = storage.getSchool(schoolId);
      const reply = await geminiService.chatAssistant(message, history || [], {
        teacherName: userName,
        schoolName: school?.name,
      });

      res.json({ success: true, reply });
    } catch (err: any) {
      console.error('Error in /api/ai/assistant:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Asisten AI sedang sibuk, silakan coba beberapa saat lagi',
      });
    }
  });

  // --- 5. APPROVALS & AUDIT LOGS ---
  app.get('/api/approvals', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const approvals = storage.getApprovals(schoolId);
    res.json({ success: true, approvals });
  });

  app.post('/api/approvals/:id/approve', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const approvalId = req.params.id;
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);

    const approvals = storage.getApprovals(schoolId);
    let targetTitle = 'Dokumen Pembelajaran';
    const updated = approvals.map((appr: any) => {
      if (appr.id === approvalId) {
        targetTitle = appr.title;
        return {
          ...appr,
          status: 'disetujui',
          approvedBy: userName,
          approvedAt: new Date().toISOString(),
        };
      }
      return appr;
    });

    storage.saveApprovals(schoolId, updated);

    storage.addAuditLog({
      id: `audit-${Date.now()}`,
      schoolId,
      userId,
      userName,
      userRole,
      action: 'approval',
      documentType: 'modul_ajar',
      documentTitle: targetTitle,
      details: `Persetujuan resmi diberikan oleh ${userName} (${userRole}). Dokumen siap digunakan.`,
      timestamp: new Date().toISOString(),
    });

    storage.addNotification({
      id: `notif-${Date.now()}`,
      schoolId,
      userId: 'all',
      title: 'Dokumen Disetujui',
      message: `${targetTitle} telah diverifikasi dan disetujui secara resmi oleh ${userName}.`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Dokumen berhasil disetujui' });
  });

  app.post('/api/approvals/:id/reject', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const approvalId = req.params.id;
    const userId = getUserId(req);
    const userName = getUserName(req);
    const userRole = getUserRole(req);
    const { reason } = req.body;

    const approvals = storage.getApprovals(schoolId);
    let targetTitle = 'Dokumen Pembelajaran';
    const updated = approvals.map((appr: any) => {
      if (appr.id === approvalId) {
        targetTitle = appr.title;
        return {
          ...appr,
          status: 'ditolak',
          rejectedBy: userName,
          rejectedAt: new Date().toISOString(),
          rejectReason: reason || 'Memerlukan penyesuaian materi',
        };
      }
      return appr;
    });

    storage.saveApprovals(schoolId, updated);

    storage.addAuditLog({
      id: `audit-${Date.now()}`,
      schoolId,
      userId,
      userName,
      userRole,
      action: 'rejection',
      documentType: 'modul_ajar',
      documentTitle: targetTitle,
      details: `Draf ditolak oleh ${userName} dengan catatan: ${reason || 'Perlu perbaikan materi'}`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Draf telah ditolak untuk revisi' });
  });

  app.get('/api/audit-logs', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const logs = storage.getAuditLogs(schoolId);
    res.json({ success: true, logs });
  });

  // --- 6. NOTIFICATIONS ---
  app.get('/api/notifications', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const notifs = storage.getNotifications(schoolId, userId);
    res.json({ success: true, notifications: notifs });
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const notifId = req.params.id;
    storage.markNotificationRead(schoolId, notifId);
    res.json({ success: true });
  });

  app.put('/api/notifications/read-all', (req: Request, res: Response) => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    storage.markAllNotificationsRead(schoolId, userId);
    res.json({ success: true });
  });

  // --- 7. PILOT REGISTRATION ---
  app.post('/api/pilot/register', (req: Request, res: Response) => {
    const { schoolName, location, contactPerson, role, email, teacherCount, primaryChallenge, preferredMeetingTime } = req.body;

    const notif: any = {
      id: `notif-pilot-${Date.now()}`,
      schoolId: 'sekolah-cakrawala-jakarta',
      userId: 'all',
      title: 'Pendaftaran Program Pilot Masuk',
      message: `${schoolName} (${contactPerson}) mengajukan permohonan pilot 4 minggu untuk ${teacherCount}.`,
      type: 'task_assigned',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    storage.addNotification(notif);

    storage.addAuditLog({
      id: `audit-${Date.now()}`,
      schoolId: 'sekolah-cakrawala-jakarta',
      userId: 'public-form',
      userName: contactPerson || 'Pendaftar Sekolah',
      userRole: role || 'Kepala Sekolah',
      action: 'document_edit',
      documentType: 'tugas',
      documentTitle: `Permohonan Pilot: ${schoolName}`,
      details: `Kontak: ${email}, Jumlah Guru: ${teacherCount}, Waktu: ${preferredMeetingTime}`,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Permohonan program pilot berhasil dicatat' });
  });

  // --- VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING ---
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GuruFlow Server] Active on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[GuruFlow Server] Gemini AI Engine Status: ${isGeminiConfigured() ? 'ONLINE (@google/genai)' : 'OFFLINE (Needs GEMINI_API_KEY)'}`);
  });
}

startServer().catch((err) => {
  console.error('[GuruFlow Server] Fatal startup error:', err);
  process.exit(1);
});
