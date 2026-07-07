import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gradeService } from '../../services/examService';
import './GradeListPage.css';

// Icon đề thi dùng chung
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

// Danh sách mặc định (nếu API chưa trả về đủ dữ liệu)
const DEFAULT_ITEMS = [
  // { key: 'thpt-qg', label: 'Thi THPT Quốc Gia', grade: 'THPT Quốc Gia' },
  // { key: 'lop-12',  label: 'Lớp 12', grade: 'Lớp 12' },
  // { key: 'lop-11',  label: 'Lớp 11', grade: 'Lớp 11' },
  // { key: 'lop-10',  label: 'Lớp 10', grade: 'Lớp 10' },
  // { key: 'lop-9',   label: 'Lớp 9',  grade: 'Lớp 9' },
  // { key: 'lop-8',   label: 'Lớp 8',  grade: 'Lớp 8' },
  // { key: 'lop-7',   label: 'Lớp 7',  grade: 'Lớp 7' },
  // { key: 'lop-6',   label: 'Lớp 6',  grade: 'Lớp 6' },
  // { key: 'lop-5',   label: 'Lớp 5',  grade: 'Lớp 5' },
  // { key: 'lop-4',   label: 'Lớp 4',  grade: 'Lớp 4' },
  // { key: 'lop-3',   label: 'Lớp 3',  grade: 'Lớp 3' },
  // { key: 'lop-2',   label: 'Lớp 2',  grade: 'Lớp 2' },
  // { key: 'lop-1',   label: 'Lớp 1',  grade: 'Lớp 1' },
];

export default function GradePage() {
  const navigate = useNavigate();
  const [counts, setCounts]   = useState({});
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const res = await gradeService.GetAllGrade();

        console.log(res);

        setGrades(res.data?.data ?? res.data ?? []);
      } catch (err) {
        console.error(err);
        setGrades([]);
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, []);

  const handleClick = (item) => {
    navigate(`/grade/${item.key}`, { state: { gradeLabel: item.grade, gradeFilter: item.grade } });
  };

  return (
    <div className="grade-list-page">
      <h1 className="grade-list-title">Tất cả lớp / cấp học</h1>
      <p className="grade-list-sub">Chọn một lớp để xem các đề thi tương ứng</p>

      {loading ? (
        <div className="loading-screen"><div className="spinner"/></div>
      ) : (
        <div className="grade-list">
          {grades.map(item => {
            const count = counts[item.grade] || 0;
            return (
              <button
                key={item.key}
                className={`grade-item ${count === 0 ? 'empty' : ''}`}
                onClick={() => handleClick(item)}
              >
                <ExamIcon />
                <span className="grade-item-label">{item.grade}</span>
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
