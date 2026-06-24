import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import './GradeListPage.css';

function ExamIcon() {
  return (
    <svg viewBox="0 0 60 60" width="44" height="44" style={{flexShrink:0, opacity:0.75}}>
      <circle cx="20" cy="38" r="14" fill="none" stroke="#e0e0e0" strokeWidth="1.5"/>
      <path d="M13 30 Q17 24 25 28" fill="none" stroke="#ccc" strokeWidth="1.5"/>
      <circle cx="30" cy="18" r="9" fill="none" stroke="#e0e0e0" strokeWidth="1.5"/>
      <text x="15" y="42" fontSize="11" fill="#e07070" fontWeight="bold">?</text>
      <text x="26" y="22" fontSize="9"  fill="#e07070">!</text>
    </svg>
  );
}

const DEFAULT_SUBJECTS = [
  'Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học',
  'Sinh học', 'Lịch sử', 'Địa lý', 'GDCD', 'Tin học',
];

export default function SubjectPage() {
  const navigate = useNavigate();
  const [counts, setCounts]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examService.GetAllExam()
      .then(d => {
        const exams = Array.isArray(d) ? d : d.exams || d.data || [];
        const c = {};
        exams.forEach(e => {
          const s = e.subject || e.Subject?.name || 'Khác';
          c[s] = (c[s] || 0) + 1;
        });
        setCounts(c);
      })
      .catch(() => setCounts({
        'Toán':9, 'Ngữ văn':6, 'Tiếng Anh':8, 'Vật lý':5, 'Hóa học':4,
        'Sinh học':3, 'Lịch sử':2, 'Địa lý':2, 'GDCD':1, 'Tin học':3,
      }))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (subject) => {
    navigate(`/subject/${encodeURIComponent(subject)}`, { state: { subjectLabel: subject } });
  };

  const allSubjects = [...new Set([...DEFAULT_SUBJECTS, ...Object.keys(counts)])];

  return (
    <div className="grade-list-page">
      <h1 className="grade-list-title">Tất cả môn học</h1>
      <p className="grade-list-sub">Chọn một môn học để xem các đề thi tương ứng</p>

      {loading ? (
        <div className="loading-screen"><div className="spinner"/></div>
      ) : (
        <div className="grade-list">
          {allSubjects.map(subject => {
            const count = counts[subject] || 0;
            return (
              <button
                key={subject}
                className={`grade-item ${count === 0 ? 'empty' : ''}`}
                onClick={() => handleClick(subject)}
              >
                <ExamIcon />
                <span className="grade-item-label">{subject}</span>
                <span className={`grade-item-badge ${count <= 3 ? 'badge-low' : ''}`}>
                  {count} Mã đề
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
