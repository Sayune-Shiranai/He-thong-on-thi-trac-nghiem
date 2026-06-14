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
        {exam.grade && <span className="badge badge-neutral">{exam.grade}</span>}
      </div>
      <h3 className="exam-card-title">{exam.title}</h3>
      <p className="exam-card-desc">{exam.description || 'Chưa có mô tả.'}</p>
      <div className="exam-card-meta">
        <span className="meta-item">⏱ {exam.duration || 0} phút</span>
        <span className="meta-item">❓ {exam.questionCount || 0} câu hỏi</span>
        <span className="meta-item">♡ {exam.likes || 0}</span>
      </div>
      <div className="exam-card-footer">
        {exam.subject && <span className="badge badge-info">{exam.subject}</span>}
        <button className="main-btn main-btn-primary main-btn-sm" onClick={() => onView(exam.id)}>Xem đề →</button>
      </div>
    </div>
  );
}

export default function SubjectDetailPage() {
  const { subjectName } = useParams();
  const location = useLocation();
  const navigate  = useNavigate();

  const label = location.state?.subjectLabel || decodeURIComponent(subjectName || '');

  const [exams, setExams]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.getAll({ subject: label, limit: 100 })
      .then(d => {
        const all = Array.isArray(d) ? d : d.exams || d.data || [];
        const filtered = all.filter(e => (e.subject || e.Subject?.name) === label);
        setExams(filtered.length ? filtered : all);
      })
      .catch(() => setExams([]))
      .finally(() => setLoading(false));
  }, [label]);

  const handleView = (id) => navigate(`/detail/${id}`);

  return (
    <div className="dashboard-page">
      <div className="grade-detail-back">
        <button className="btn-ghost main-btn main-btn-sm" onClick={() => navigate('/subject')}>← Tất cả môn học</button>
      </div>

      <div className="grade-detail-header">
        <h1 className="grade-detail-title">MÔN {label.toUpperCase()}</h1>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"/></div>
      ) : exams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Chưa có đề thi môn {label}</h3>
          <p>Hãy quay lại sau hoặc thử môn khác.</p>
        </div>
      ) : (
        <div className="exam-grid stagger">
          {exams.map(e => <ExamResultCard key={e.id} exam={e} onView={handleView} />)}
        </div>
      )}
    </div>
  );
}
