import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import './GradeListPage.css';

const DIFF_LABEL = { easy:'Dễ', medium:'Trung bình', hard:'Khó' };
function diffBadge(d) { return { easy:'badge-success', medium:'badge-warning', hard:'badge-danger' }[d] || 'badge-neutral'; }

function ExamResultCard({ exam, onView }) {
  return (
    <div className="exam-card card animate-fadeIn">
      <div className="exam-card-header">
        <span className={`badge ${diffBadge(exam.difficulty)}`}>{DIFF_LABEL[exam.difficulty] || 'Tiêu chuẩn'}</span>
        {(exam.subject || exam.category) && <span className="badge badge-neutral">{exam.subject || exam.category}</span>}
      </div>
      <h3 className="exam-card-title">{exam.title}</h3>
      <p className="exam-card-desc">{exam.description || 'Chưa có mô tả.'}</p>
      <div className="exam-card-meta">
        <span className="meta-item">⏱ {exam.duration || 0} phút</span>
        <span className="meta-item">❓ {exam.questionCount || 0} câu hỏi</span>
        <span className="meta-item">♡ {exam.likes || 0}</span>
      </div>
      <div className="exam-card-footer">
        {exam.grade && <span className="badge badge-info">{exam.grade}</span>}
        <button className="main-btn main-btn-primary main-btn-sm" onClick={() => onView(exam.id)}>Xem đề →</button>
      </div>
    </div>
  );
}

const MOCK_BY_GRADE = {
  'Lớp 4': [
    { id:'3', title:'MINI-TEST TIẾNG ANH LỚP 4', duration:30, questionCount:20, subject:'Tiếng Anh', likes:2, difficulty:'easy' },
    { id:'4', title:'Đề thi thử Toeic 2020', duration:12, questionCount:1, subject:'Toán', likes:0, difficulty:'medium' },
  ],
};

export default function GradeDetailPage() {
  const { gradeKey } = useParams();
  const location      = useLocation();
  const navigate      = useNavigate();

  const passedLabel  = location.state?.gradeLabel;
  const passedFilter = location.state?.gradeFilter;

  const fallbackLabel = gradeKey?.startsWith('lop-')
    ? `Lớp ${gradeKey.replace('lop-', '')}`
    : gradeKey === 'thpt-qg' ? 'Thi THPT Quốc Gia' : gradeKey;

  const label  = passedLabel  || fallbackLabel;
  const filter = passedFilter || fallbackLabel;

  const [exams, setExams]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.getAll({ grade: filter, limit: 100 })
      .then(d => {
        const all = Array.isArray(d) ? d : d.exams || d.data || [];
        const filtered = all.filter(e => (e.grade || e.Grade?.grade) === filter);
        setExams(filtered.length ? filtered : (MOCK_BY_GRADE[filter] || all));
      })
      .catch(() => setExams(MOCK_BY_GRADE[filter] || []))
      .finally(() => setLoading(false));
  }, [filter]);

  const handleView = (id) => navigate(`/detail/${id}`);

  return (
    <div className="dashboard-page">
      <div className="grade-detail-back">
        <button className="btn-ghost main-btn main-btn-sm" onClick={() => navigate('/grade')}>← Tất cả lớp</button>
      </div>

      <div className="grade-detail-header">
        <h1 className="grade-detail-title">{label}</h1>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"/></div>
      ) : exams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Chưa có đề thi cho {label}</h3>
          <p>Hãy quay lại sau hoặc thử lớp khác.</p>
        </div>
      ) : (
        <div className="exam-grid stagger">
          {exams.map(e => <ExamResultCard key={e.id} exam={e} onView={handleView} />)}
        </div>
      )}
    </div>
  );
}
