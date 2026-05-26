import React, { useState, useEffect } from 'react';
import { examService, subjectService, gradeService, questionService, examQuestionService } from '../../services/examService';

const EMPTY_EXAM = { title: '', description: '', duration: 30 };

export default function AdminExamsPage() {
  const [exams, setExams]       = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState(EMPTY_EXAM);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subs, grs] = await Promise.all([
        subjectService.getAll({ limit: 100 }),
        gradeService.getAll({ limit: 100 }),
      ]);
      setSubjects(subs.data || []);
      setGrades(grs.data || []);
    } catch {
      setSubjects(MOCK_SUBJECTS);
      setGrades(MOCK_GRADES);
    } finally {
      setLoading(false);
    }
    // Exams chưa có GET all → dùng mock
    setExams(MOCK_EXAMS);
  };

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Tiêu đề đề thi không được để trống!'); return; }
    try {
      setSaving(true); setError('');
      // POST /dashboard/exam
      const res = await examService.create({
        title: form.title,
        description: form.description,
        duration: Number(form.duration),
      });
      const newExam = res.data || { ...form, id: Date.now() };
      setExams(e => [newExam, ...e]);
      setModal(false);
      flash('Tạo đề thi thành công!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title">Đề thi</h1>
          <p className="admin-page-sub">Quản lý đề thi trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_EXAM); setError(''); setModal(true); }}>
          + Tạo đề thi
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Tiêu đề</th><th>Thời gian</th><th>Mô tả</th></tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <tr key={exam.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{exam.id}</td>
                  <td style={{ fontWeight: 500 }}>{exam.title}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{exam.duration} phút</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                    {exam.description ? exam.description.slice(0, 60) + (exam.description.length > 60 ? '…' : '') : '—'}
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Chưa có đề thi nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tạo đề thi */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Tạo đề thi mới</h3>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Tiêu đề đề thi *</label>
              <input className="form-input" value={form.title} onChange={e => sf('title', e.target.value)} placeholder="vd: Kiểm tra Toán lớp 12 - Học kỳ 1" />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={e => sf('description', e.target.value)} placeholder="Mô tả ngắn về đề thi…" style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Thời gian (phút)</label>
                <input className="form-input" type="number" min={5} value={form.duration} onChange={e => sf('duration', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Môn học</label>
                <select className="form-select" value={form.subject_id || ''} onChange={e => sf('subject_id', e.target.value)}>
                  <option value="">— Chọn môn —</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Khối lớp</label>
              <select className="form-select" value={form.grade_id || ''} onChange={e => sf('grade_id', e.target.value)}>
                <option value="">— Chọn khối —</option>
                {grades.map(g => <option key={g.id} value={g.id}>{g.grade}</option>)}
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu…' : 'Tạo đề thi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_EXAMS = [
  { id: 1, title: 'Kiểm tra Toán lớp 12 HK1', description: 'Chương 1-3 Đại số', duration: 45 },
  { id: 2, title: 'Kiểm tra Tiếng Anh lớp 10', description: 'Unit 1-5', duration: 30 },
  { id: 3, title: 'Ôn thi Vật lý lớp 11', description: 'Điện học & Quang học', duration: 60 },
];
const MOCK_SUBJECTS = [{ id: 1, name: 'Toán' }, { id: 2, name: 'Văn' }, { id: 3, name: 'Anh' }, { id: 4, name: 'Vật lý' }];
const MOCK_GRADES   = [{ id: 1, grade: 'Lớp 10' }, { id: 2, grade: 'Lớp 11' }, { id: 3, grade: 'Lớp 12' }];
