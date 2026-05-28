import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { attemptService } from '../../services/examService.js';
import { pct, grade, formatDate, formatDuration } from '../../utils/helpers.js';

export default function HistoryPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    attemptService.getMyHistory(user?.id)
      .then(setAttempts)
      .catch(() => setAttempts([]))
      .finally(() => setLoading(false));
  }, [user]);

  const avg = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + pct(a.score, a.totalPoints), 0) / attempts.length)
    : 0;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
        marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:400, marginBottom:4 }}>
            Lịch sử làm bài
          </h1>
          <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)' }}>
            Tất cả các bài thi của <strong>{user?.name}</strong>
          </p>
        </div>
        <Link to="/" className="btn btn-secondary btn-sm">← Trang chủ</Link>
      </div>

      {/* Thống kê tổng */}
      {attempts.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px,1fr))',
          gap:14, marginBottom:28 }}>
          {[
            { l:'Số bài đã thi',    v: attempts.length },
            { l:'Điểm trung bình', v: `${avg}%` },
            { l:'Số bài đạt',
              v: attempts.filter(a => pct(a.score, a.totalPoints) >= (a.passingScore ?? 50)).length },
            { l:'Xếp loại TB',     v: grade(avg) },
          ].map(s => (
            <div key={s.l} className="card" style={{ textAlign:'center', padding:'18px 16px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:'0.74rem', textTransform:'uppercase', letterSpacing:'0.06em',
                color:'var(--text-muted)', marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="loading-screen"><div className="spinner"/></div>
      ) : attempts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Chưa có bài thi nào</h3>
          <p>Hãy hoàn thành bài thi đầu tiên để xem kết quả tại đây.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop:16 }}>Vào thi ngay</Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Đề thi</th>
                <th>Ngày thi</th>
                <th>Điểm số</th>
                <th>Xếp loại</th>
                <th>Kết quả</th>
                <th>Thời gian</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {attempts.map(a => {
                const p      = pct(a.score, a.totalPoints);
                const passed = p >= (a.passingScore ?? 50);
                return (
                  <tr key={a.id}>
                    <td style={{ fontWeight:500 }}>{a.examTitle}</td>
                    <td style={{ fontFamily:'var(--font-mono)', fontSize:'0.82rem', color:'var(--text-muted)' }}>
                      {a.completedAt ? formatDate(a.completedAt) : '—'}
                    </td>
                    <td>
                      <span style={{
                        fontFamily:'var(--font-mono)', fontSize:'0.88rem', fontWeight:600,
                        color: p >= 80 ? 'var(--accent-success)' : p >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)',
                      }}>{p}%</span>
                    </td>
                    <td style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem' }}>{grade(p)}</td>
                    <td>
                      <span className={`badge ${passed ? 'badge-success' : 'badge-danger'}`}>
                        {passed ? 'Đạt' : 'Chưa đạt'}
                      </span>
                    </td>
                    <td style={{ fontFamily:'var(--font-mono)', fontSize:'0.82rem', color:'var(--text-muted)' }}>
                      {a.timeTaken ? formatDuration(Math.round(a.timeTaken / 60)) : '—'}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/result/${a.id}`)}>
                        Xem lại
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
