import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { examService } from '../../services/examService.js';
import './ExamDetailPage.css';

export default function ExamDetailPage() {
  const { examId }  = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();

  const [exam, setExam]           = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { loadExam(); }, [examId]);

  const loadExam = async () => {
    try {
      setLoading(true);
      const res = await examService.getById(examId);
      const data = res.data || res;
      setExam(data);
      const qs = (data.Questions || []).map((q, i) => ({
        id: q.id, index: i + 1,
        image: q.content_img || null,
        content: q.content || null,
      }));
      setQuestions(qs);
    } catch {
      setExam(MOCK_EXAM);
      setQuestions(MOCK_QS);
    } finally { setLoading(false); }
  };

  /**
   * Bấm "Bắt đầu":
   * - Chưa đăng nhập → /login (lưu lại trang này để sau login quay về)
   * - Đã đăng nhập   → /exam/:examId (trang làm bài)
   */
  const handleStart = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/detail/${examId}` } } });
      return;
    }
    navigate(`/exam/${examId}`);
  };

  if (loading) return (
    <div className="loading-screen" style={{minHeight:'100vh'}}>
      <div className="spinner"/>
    </div>
  );

  return (
    <div className="exam-detail-page">
      <div className="exam-detail-header">
        <h1 className="exam-detail-title">{exam?.title}</h1>
        {exam?.uploader && <p className="exam-detail-uploader">Người đăng tải: {exam.uploader}</p>}
      </div>

      <div className="exam-detail-body">
        {/* Trái: PDF/ảnh đề thi */}
        <div className="exam-detail-left">
          {exam?.file_url ? (
            <iframe
              src={`http://localhost:5000${exam.file_url}`}
              className="exam-pdf-viewer"
              title="Đề thi"
            />
          ) : exam?.image_url ? (
            <img src={`http://localhost:5000${exam.image_url}`} alt="Đề thi" className="exam-img-viewer"/>
          ) : (
            <div className="exam-no-file">
              <p>📄 Đề thi chưa có file đính kèm.</p>
            </div>
          )}
        </div>

        {/* Phải: bảng điều khiển */}
        <div className="exam-detail-right">
          <div className="exam-control-card">
            <div className="exam-control-title">{exam?.title}</div>
            <div className="exam-control-meta">
              <span>⏱ {exam?.duration || 0} phút</span>
              <span>💬 {questions.length} câu</span>
              <span>♡ {exam?.likes || 0}</span>
            </div>

            {/* Thông báo khi chưa đăng nhập */}
            {!user && (
              <div style={{
                background:'#fff8e1', border:'1px solid #f9a825',
                borderRadius:8, padding:'10px 14px', marginBottom:12,
                fontSize:14, color:'#7a5c00',
              }}>
                📝 Bạn cần <strong>đăng nhập</strong> để bắt đầu làm bài.
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              style={{width:'100%'}}
              onClick={handleStart}
            >
              {user ? 'Bắt đầu làm bài →' : 'Đăng nhập để làm bài →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const MOCK_EXAM = { id:'1', title:'ĐỀ THI SINH HỌC 12 CUỐI HK2', duration:0, likes:2, uploader:'NGUYỄN HOÀNG ANH' };
const MOCK_QS   = Array.from({length:20}, (_,i) => ({ id:`q${i+1}`, index:i+1, image:null }));
