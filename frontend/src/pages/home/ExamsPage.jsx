import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import './GradeListPage.css';

const DIFF_LABEL = { easy:'Dễ', medium:'Trung bình', hard:'Khó' };
function diffBadge(d) { return { easy:'badge-success', medium:'badge-warning', hard:'badge-danger' }[d] || 'badge-neutral'; }

function ExamResultCard({ exam, onView }) {
  return (
    <div className="exam-card card animate-fadeIn">
      <div className="exam-card-header">
        <span className={`badge ${diffBadge(exam.difficulty)}`}>{DIFF_LABEL[exam.difficulty] || 'Tiêu chuẩn'}</span>
        {exam.subject && <span className="badge badge-neutral">{exam.subject}</span>}
        {exam.grade   && <span className="badge badge-info">{exam.grade}</span>}
      </div>
      <h3 className="exam-card-title">{exam.title}</h3>
      <p className="exam-card-desc">{exam.description || 'Chưa có mô tả.'}</p>
      <div className="exam-card-meta">
        <span className="meta-item">⏱ {exam.duration || 0} phút</span>
        <span className="meta-item">❓ {exam.questionCount || 0} câu hỏi</span>
        <span className="meta-item">♡ {exam.likes || 0}</span>
      </div>
      <div className="exam-card-footer">
        <span></span>
        <button className="main-btn main-btn-primary main-btn-sm" onClick={() => onView(exam.id)}>Xem đề →</button>
      </div>
    </div>
  );
}

const GRADES   = ['Lớp 1','Lớp 2','Lớp 3','Lớp 4','Lớp 5','Lớp 6','Lớp 7','Lớp 8','Lớp 9','Lớp 10','Lớp 11','Lớp 12','THPT Quốc Gia'];
const SUBJECTS = ['Toán','Ngữ văn','Tiếng Anh','Vật lý','Hóa học','Sinh học','Lịch sử','Địa lý','GDCD','Tin học'];

const MOCK = [
  { id:'1', title:'ĐỀ THI SINH HỌC 12 CUỐI HK2', duration:0, questionCount:20, subject:'Sinh học', grade:'Lớp 12', likes:2, difficulty:'medium' },
  { id:'3', title:'MINI-TEST TIẾNG ANH LỚP 4',   duration:30, questionCount:20, subject:'Tiếng Anh', grade:'Lớp 4', likes:2, difficulty:'easy' },
];

export default function ExamsPage() {
  const location = useLocation();
  const navigate  = useNavigate();

  const params = new URLSearchParams(location.search);
  const initQ  = params.get('q') || '';

  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading]   = useState(true);

  const [keyword, setKeyword] = useState(initQ);
  const [grade, setGrade]     = useState('');
  const [subject, setSubject] = useState('');
  const [minQ, setMinQ]       = useState('');
  const [maxQ, setMaxQ]       = useState('');

  useEffect(() => {
    examService.GetAllExam()
      .then(d => setAllExams(Array.isArray(d) ? d : d.exams || d.data || []))
      .catch(() => setAllExams(MOCK))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setKeyword(initQ); }, [initQ]);

  const filtered = allExams.filter(e => {
    const mk = !keyword || e.title?.toLowerCase().includes(keyword.toLowerCase());
    const mg = !grade   || (e.grade   || e.Grade?.grade)   === grade;
    const ms = !subject || (e.subject || e.Subject?.name)  === subject;
    const q  = e.questionCount || 0;
    const mn = !minQ || q >= Number(minQ);
    const mx = !maxQ || q <= Number(maxQ);
    return mk && mg && ms && mn && mx;
  });

  const handleView = (id) => navigate(`/detail/${id}`);
  const resetFilters = () => { setKeyword(''); setGrade(''); setSubject(''); setMinQ(''); setMaxQ(''); };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tìm kiếm nâng cao</h1>
          <p className="dashboard-subtitle">Tìm đề thi theo tên, lớp, môn học và số câu hỏi</p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))',
        gap:12, marginBottom:28,
        background:'var(--bg-card)', border:'1px solid var(--border-light)',
        borderRadius:'var(--radius-lg)', padding:18,
      }}>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Từ khóa</label>
          <input className="form-input" placeholder="Tên đề thi…"
            value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Lớp</label>
          <select className="form-select" value={grade} onChange={e => setGrade(e.target.value)}>
            <option value="">Tất cả</option>
            {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Môn học</label>
          <select className="form-select" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">Tất cả</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Số câu (min)</label>
          <input className="form-input" type="number" min={0} value={minQ}
            onChange={e => setMinQ(e.target.value)} placeholder="0" />
        </div>
        <div className="form-group" style={{marginBottom:0}}>
          <label className="form-label">Số câu (max)</label>
          <input className="form-input" type="number" min={0} value={maxQ}
            onChange={e => setMaxQ(e.target.value)} placeholder="100" />
        </div>
        <div style={{ display:'flex', alignItems:'flex-end' }}>
          <button className="main-btn main-btn-secondary" style={{width:'100%', justifyContent:'center'}} onClick={resetFilters}>
            ✕ Xóa lọc
          </button>
        </div>
      </div>

      <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:14 }}>
        Tìm thấy <strong>{filtered.length}</strong> đề thi
      </p>

      {loading ? (
        <div className="loading-screen"><div className="spinner"/></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Không tìm thấy đề thi phù hợp</h3>
          <p>Thử thay đổi bộ lọc tìm kiếm.</p>
        </div>
      ) : (
        <div className="exam-grid stagger">
          {filtered.map(e => <ExamResultCard key={e.id} exam={e} onView={handleView} />)}
        </div>
      )}
    </div>
  );
}
