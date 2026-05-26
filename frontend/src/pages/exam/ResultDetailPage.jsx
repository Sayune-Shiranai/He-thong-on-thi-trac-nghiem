import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { attemptService } from '../../services/examService.js';
import './ResultDetailPage.css';

export default function ResultDetailPage() {
  const { attemptId } = useParams();
  const location      = useLocation();
  const navigate      = useNavigate();

  const [result, setResult]   = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!result) {
      attemptService.getResult(attemptId)
        .then(setResult)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [attemptId]);

  if (loading) return <div className="loading-screen" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (error)   return (
    <div style={{padding:40, textAlign:'center'}}>
      <div className="alert alert-error">{error}</div>
      <Link to="/" className="btn btn-primary" style={{marginTop:16}}>Về trang chủ</Link>
    </div>
  );

  const exam      = result?.exam || {};
  const questions = result?.questions || [];
  const correct   = result?.correctCount   || 0;
  const incorrect = result?.incorrectCount || 0;
  const total     = result?.totalQuestions || 0;
  const score     = result?.score          || 0;
  const totalPts  = result?.totalPoints    || 10;
  const pct       = totalPts > 0 ? Math.round((score / totalPts) * 100) : 0;
  const passed    = score >= (totalPts / 2);

  const formatDateTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  return (
    <div className="result-detail-page">
      {/* Header */}
      <div className="result-detail-header">
        <h1 className="result-detail-title">{exam.title}</h1>
        {exam.uploader && <p className="result-detail-uploader">Đăng Tải Bởi: {exam.uploader}</p>}
      </div>

      <div className="result-detail-body">
        {/* Trái: PDF đề thi */}
        <div className="result-detail-left">
          {/* Thông tin kết quả */}
          <div className="result-info-banner">
            <p className="result-info-user">
              Kết quả làm bài thi của : <strong>{result?.userName || 'Bạn'}</strong>
            </p>
            {result?.userName && (
              <p className="result-info-link">
                Xem thêm các lần thi khác của {result.userName} :{' '}
                <Link to="/history" className="result-view-all">Xem tất cả</Link>
              </p>
            )}
            <p className="result-info-date">{formatDateTime(result?.completedAt)}</p>
          </div>

          {/* Bảng thống kê */}
          <div className="result-stats-card">
            <div className="result-stats-left-col">
              <div className="result-stat-row">
                <span className="stat-label">Tổng số câu:</span>
                <span className="stat-val blue">{total}</span>
              </div>
              <div className="result-stat-row">
                <span className="stat-label">Số câu đúng:</span>
                <span className="stat-val green">{correct}</span>
              </div>
              <div className="result-stat-row">
                <span className="stat-label">Số câu sai:</span>
                <span className="stat-val red">{incorrect}</span>
              </div>
              <div className="result-stat-row">
                <span className="stat-label">Số câu chưa làm:</span>
                <span className="stat-val">{result?.skippedCount || 0}</span>
              </div>
            </div>

            {/* Vòng tròn điểm */}
            <div className="result-score-circle-wrap">
              <div className={`result-score-circle ${passed ? 'passed' : 'failed'}`}>
                <span className="circle-pct">{pct} %</span>
              </div>
              <span className={`result-verdict ${passed ? 'passed' : 'failed'}`}>
                {passed ? 'Passed' : 'Failed'}
              </span>
            </div>

            <div className="result-stats-right-col">
              <div className="result-stat-row">
                <span className="stat-label">Tổng điểm:</span>
                <span className="stat-val red">{score}/{totalPts} điểm</span>
              </div>
              <div className="result-stat-row">
                <span className="stat-label">Thời gian ghi nhận:</span>
              </div>
              {result?.startedAt && (
                <div className="result-stat-row">
                  <span className="stat-label">Start</span>
                  <span className="stat-val green">{formatDateTime(result.startedAt)}</span>
                </div>
              )}
              {result?.completedAt && (
                <div className="result-stat-row">
                  <span className="stat-label">End</span>
                  <span className="stat-val red">{formatDateTime(result.completedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* PDF đề thi */}
          {exam?.file_url ? (
            <iframe
              src={`http://localhost:5000${exam.file_url}`}
              className="result-pdf-viewer"
              title="Đề thi"
            />
          ) : exam?.image_url ? (
            <img src={`http://localhost:5000${exam.image_url}`} alt="Đề thi" style={{width:'100%', borderRadius:'var(--radius-md)'}}/>
          ) : null}
        </div>

        {/* Phải: bảng đáp án đã chọn */}
        <div className="result-detail-right">
          <div className="result-answer-card">
            <div className="result-answer-header">
              <div className="result-answer-title">{exam.title}</div>
              <div className="result-answer-meta">
                <span>⏱ {exam.duration || 0} phút</span>
                <span>💬 {total} câu</span>
              </div>
              <div className="result-answer-divider"/>
              <div className="result-answer-label">Bắt đầu</div>
              {result?.startedAt && (
                <div className="result-answer-time">
                  {formatDateTime(result.startedAt)}
                </div>
              )}
            </div>

            {/* Grid đáp án */}
            <div className="result-answer-grid">
              {questions.map((q, i) => (
                <div key={q.id || i} className="result-answer-row">
                  <span className="result-answer-num">{i + 1}</span>
                  {['A','B','C','D'].map(opt => {
                    const isSelected = q.selectedOptionId === opt;
                    const isCorrect  = q.correctOptionId  === opt;
                    let cls = 'result-answer-opt';
                    if (isSelected && isCorrect)  cls += ' correct';
                    else if (isSelected)           cls += ' wrong';
                    else if (isCorrect)            cls += ' correct-hint';
                    return (
                      <span key={opt} className={cls}>{opt}</span>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Nút THI LẠI và QUAY LẠI */}
            <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:16}}>
              <button
                className="btn btn-danger btn-lg"
                style={{width:'100%', justifyContent:'center'}}
                onClick={() => navigate(`/detail/${exam.id}`)}
              >
                THI LẠI
              </button>
              <button
                className="btn btn-secondary btn-lg"
                style={{width:'100%', justifyContent:'center'}}
                onClick={() => navigate('/')}
              >
                QUAY LẠI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
