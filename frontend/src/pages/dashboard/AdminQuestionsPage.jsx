import React, { useState, useEffect } from 'react';
import { questionService, subjectService, gradeService } from '../../services/examService';

const EMPTY = {
  content: '', option_a: '', option_b: '', option_c: '', option_d: '',
  correct_answer: 'A', subject_id: '', grade_id: '',
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [grades, setGrades]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false); // 'text' | 'image' | false
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  // Upload ảnh
  const [imgFile, setImgFile]     = useState(null);
  const [answerCount, setAnswerCount] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(['A']);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [subs, grs] = await Promise.all([
        subjectService.getAll({ limit: 100 }),
        gradeService.getAll({ limit: 100 }),
      ]);
      setSubjects(subs.data || []);
      setGrades(grs.data || []);
    } catch {
      setSubjects(MOCK_SUBJECTS);
      setGrades(MOCK_GRADES);
    }
    setQuestions(MOCK_QS);
    setLoading(false);
  };

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Tạo câu hỏi text thường — POST /dashboard/question
  const handleSaveText = async () => {
    if (!form.content.trim()) { setError('Nội dung câu hỏi không được để trống!'); return; }
    if (!form.option_a || !form.option_b) { setError('Phải có ít nhất đáp án A và B!'); return; }
    try {
      setSaving(true); setError('');
      const res = await questionService.create(form);
      const newQ = res.data || { ...form, id: Date.now() };
      setQuestions(q => [newQ, ...q]);
      setModal(false);
      flash('Tạo câu hỏi thành công!');
    } catch (err) {
      // Demo mode
      setQuestions(q => [{ ...form, id: Date.now() }, ...q]);
      setModal(false);
      flash('Tạo câu hỏi thành công (demo)!');
    } finally { setSaving(false); }
  };

  // Upload ảnh — POST /dashboard/question/upload
  const handleSaveImage = async () => {
    if (!imgFile) { setError('Vui lòng chọn ảnh!'); return; }
    if (answerCount < 1) { setError('Số câu hỏi phải >= 1!'); return; }
    try {
      setSaving(true); setError('');
      const fd = new FormData();
      fd.append('image', imgFile);
      fd.append('answer_count', answerCount);
      fd.append('correct_answers', JSON.stringify(correctAnswers));
      const res = await questionService.uploadImage(fd);
      const newQs = res.data || [];
      setQuestions(q => [...newQs, ...q]);
      setModal(false);
      flash(`Tải lên thành công: ${newQs.length} câu hỏi!`);
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const OPTIONS = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title">Câu hỏi</h1>
          <p className="admin-page-sub">{questions.length} câu hỏi trong ngân hàng</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={() => { setForm(EMPTY); setError(''); setModal('image'); }}>
            📷 Upload ảnh
          </button>
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setError(''); setModal('text'); }}>
            + Tạo câu hỏi
          </button>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {questions.length === 0 && (
            <div className="empty-state"><div className="empty-icon">❓</div><h3>Chưa có câu hỏi nào</h3></div>
          )}
          {questions.map((q, idx) => (
            <div key={q.id || idx} className="card animate-fadeIn" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                  #{idx + 1}
                </span>
                {q.Subject && <span className="badge badge-info">{q.Subject.name}</span>}
                {q.Grade   && <span className="badge badge-neutral">{q.Grade.grade}</span>}
                {q.correct_answer && <span className="badge badge-success">Đáp án: {q.correct_answer}</span>}
              </div>

              {q.image && (
                <img src={`http://localhost:3000${q.image}`} alt="câu hỏi" style={{ maxWidth: 300, borderRadius: 8, marginBottom: 10 }} />
              )}
              {q.content && <p style={{ fontSize: '0.98rem', lineHeight: 1.6, marginBottom: 12 }}>{q.content}</p>}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['A', 'B', 'C', 'D'].map(opt => {
                  const text = q[`option_${opt.toLowerCase()}`];
                  if (!text) return null;
                  const isCorrect = q.correct_answer === opt;
                  return (
                    <span key={opt} style={{
                      padding: '4px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
                      border: `1px solid ${isCorrect ? 'var(--accent-success)' : 'var(--border-light)'}`,
                      background: isCorrect ? 'rgba(46,125,82,0.10)' : 'var(--bg-secondary)',
                      color: isCorrect ? 'var(--accent-success)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {opt}. {text}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal tạo câu hỏi text */}
      {modal === 'text' && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" style={{ maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Tạo câu hỏi mới</h3>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Nội dung câu hỏi *</label>
              <textarea className="form-input" rows={3} value={form.content} onChange={e => sf('content', e.target.value)} placeholder="Nhập nội dung câu hỏi…" style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {['A', 'B', 'C', 'D'].map(opt => (
                <div className="form-group" key={opt}>
                  <label className="form-label">Đáp án {opt} {opt === 'A' || opt === 'B' ? '*' : ''}</label>
                  <input className="form-input" value={form[`option_${opt.toLowerCase()}`]}
                    onChange={e => sf(`option_${opt.toLowerCase()}`, e.target.value)}
                    placeholder={`Nhập đáp án ${opt}`} />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Đáp án đúng *</label>
                <select className="form-select" value={form.correct_answer} onChange={e => sf('correct_answer', e.target.value)}>
                  {OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Môn học</label>
                <select className="form-select" value={form.subject_id} onChange={e => sf('subject_id', e.target.value)}>
                  <option value="">— Chọn môn —</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Khối lớp</label>
                <select className="form-select" value={form.grade_id} onChange={e => sf('grade_id', e.target.value)}>
                  <option value="">— Chọn khối —</option>
                  {grades.map(g => <option key={g.id} value={g.id}>{g.grade}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleSaveText} disabled={saving}>
                {saving ? 'Đang lưu…' : 'Tạo câu hỏi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal upload ảnh */}
      {modal === 'image' && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Upload câu hỏi từ ảnh</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Upload 1 ảnh chứa nhiều câu hỏi trắc nghiệm, điền số lượng và đáp án đúng.
            </p>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Chọn ảnh *</label>
              <input type="file" accept="image/*" className="form-input" style={{ padding: '8px' }}
                onChange={e => setImgFile(e.target.files[0])} />
            </div>

            <div className="form-group">
              <label className="form-label">Số câu hỏi trong ảnh *</label>
              <input type="number" className="form-input" min={1} max={50} value={answerCount}
                onChange={e => {
                  const n = Number(e.target.value);
                  setAnswerCount(n);
                  setCorrectAnswers(Array(n).fill('A'));
                }} />
            </div>

            {answerCount > 0 && (
              <div className="form-group">
                <label className="form-label">Đáp án đúng cho từng câu</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {Array.from({ length: answerCount }, (_, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Câu {i + 1}</div>
                      <select className="form-select" style={{ padding: '6px', fontSize: '0.85rem' }}
                        value={correctAnswers[i] || 'A'}
                        onChange={e => {
                          const arr = [...correctAnswers];
                          arr[i] = e.target.value;
                          setCorrectAnswers(arr);
                        }}>
                        {OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleSaveImage} disabled={saving}>
                {saving ? 'Đang tải lên…' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_QS = [
  { id: 1, content: 'Đạo hàm của sin(x) là?', option_a: 'cos(x)', option_b: '-cos(x)', option_c: 'tan(x)', option_d: '-sin(x)', correct_answer: 'A' },
  { id: 2, content: 'Giá trị của π ≈ ?', option_a: '3.14', option_b: '2.71', option_c: '1.41', option_d: '1.73', correct_answer: 'A' },
];
const MOCK_SUBJECTS = [{ id: 1, name: 'Toán' }, { id: 2, name: 'Văn' }, { id: 3, name: 'Anh' }];
const MOCK_GRADES   = [{ id: 1, grade: 'Lớp 10' }, { id: 2, grade: 'Lớp 11' }, { id: 3, grade: 'Lớp 12' }];
