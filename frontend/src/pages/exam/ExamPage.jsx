import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService, attemptService } from '../../services/examService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import QuestionCard from '../../components/exam/QuestionCard.jsx';
import ExamNavigation from '../../components/exam/ExamNavigation.jsx';
import Timer from '../../components/exam/Timer.jsx';
import './ExamPage.css';

export default function ExamPage() {
  const { examId }  = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();

  const [exam, setExam]               = useState(null);
  const [questions, setQuestions]     = useState([]);
  const [answers, setAnswers]         = useState({});
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [attemptId, setAttemptId]     = useState(null);
  const [startedAt, setStartedAt]     = useState(null);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const hasSubmitted = useRef(false);

  const totalSeconds = (exam?.duration ?? 45) * 60;
  const countdown = useCountdown(totalSeconds, () => submitExam(true));

  useEffect(() => { loadExam(); }, [examId]);
  useEffect(() => { if (exam && !loading) countdown.start(); }, [exam, loading]);

  async function loadExam() {
    try {
      setLoading(true);
      const res = await examService.getById(examId);
      const examData = res.data || res;

      // Câu hỏi nằm trong examData.Questions (Sequelize include)
      const qs = (examData.Questions || []).map(q => ({
        id:            q.id,
        text:          q.content,
        image:         q.content_img || null,
        points:        1,
        correctOptionId: q.correct_answer,
        options: ['A','B','C','D'].map(opt => ({
          id:   opt,
          text: q[`option_${opt.toLowerCase()}`],
        })).filter(o => o.text),
      }));

      setExam(examData);
      setQuestions(qs);

      const attempt = await attemptService.start(examId);
      setAttemptId(attempt.attemptId);
      setStartedAt(attempt.startedAt);
    } catch (err) {
      setError(err.message);
      // Mock data nếu API lỗi
      setExam(MOCK_EXAM);
      setQuestions(MOCK_QS);
      setAttemptId(`mock_${examId}_${Date.now()}`);
      setStartedAt(new Date().toISOString());
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = useCallback((optId) => {
    const qId = questions[currentIdx]?.id;
    if (qId) setAnswers(p => ({ ...p, [qId]: optId }));
  }, [currentIdx, questions]);

  const submitExam = async (auto = false) => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    setSubmitting(true);
    countdown.pause();

    try {
      let resultData;

      // Thử gọi API backend thật
      try {
        const res = await attemptService.submit(
          attemptId,
          answers,
          user?.id,
          examId,
          startedAt,
        );
        const resultId = res.data?.result_id || res.result_id;

        // Lấy kết quả chi tiết từ server
        resultData = await attemptService.getResult(attemptId);
      } catch {
        // Fallback: tính điểm ở frontend nếu API lỗi
        resultData = tinhDiem(questions, answers, exam);
        resultData.timeTaken = totalSeconds - countdown.seconds;
        sessionStorage.setItem(`result_${attemptId}`, JSON.stringify(resultData));
      }

      // Lưu vào lịch sử sessionStorage
      luuLichSu(resultData, exam);

      navigate(`/result/${attemptId}`, {
        state: { result: resultData, autoSubmitted: auto },
        replace: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-screen" style={{ minHeight: '100vh' }}>
      <div className="spinner" /><span>Đang tải đề thi…</span>
    </div>
  );

  if (error && questions.length === 0) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div className="alert alert-error">{error}</div>
    </div>
  );

  const q = questions[currentIdx];

  return (
    <div className="exam-page">
      <header className="exam-topbar">
        <div className="exam-topbar-inner">
          <div className="exam-topbar-left">
            <div className="exam-logo-mark">EF</div>
            <div>
              <p className="exam-name">{exam?.title}</p>
              <p className="exam-meta">{questions.length} câu · {exam?.duration || 45} phút</p>
            </div>
          </div>
          <Timer
            formatted={countdown.formatted}
            percentage={countdown.percentage}
            isWarning={countdown.isWarning}
            isDanger={countdown.isDanger}
          />
          <button className="btn btn-secondary btn-sm" onClick={() => setConfirmModal(true)}>
            Nộp bài
          </button>
        </div>
      </header>

      <div className="exam-body">
        <main className="exam-main">
          <div className="exam-question-nav">
            <button className="btn btn-ghost btn-sm"
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}>
              ← Câu trước
            </button>
            <span className="exam-progress-label">{currentIdx + 1} / {questions.length}</span>
            <button className="btn btn-ghost btn-sm"
              onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))}
              disabled={currentIdx === questions.length - 1}>
              Câu tiếp →
            </button>
          </div>

          {q && (
            <QuestionCard
              key={q.id}
              question={q}
              selectedId={answers[q.id] || null}
              onSelect={handleSelect}
              questionNum={currentIdx + 1}
              totalQuestions={questions.length}
            />
          )}
        </main>

        <aside className="exam-sidebar">
          <ExamNavigation
            total={questions.length}
            current={currentIdx}
            answers={answers}
            questions={questions}
            onNavigate={setCurrentIdx}
            onSubmit={() => setConfirmModal(true)}
            submitting={submitting}
          />
        </aside>
      </div>

      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Nộp bài thi?</h3>
            <p className="modal-body">
              Bạn đã trả lời <strong>{Object.keys(answers).length}</strong> / <strong>{questions.length}</strong> câu.{' '}
              {questions.length - Object.keys(answers).length > 0 && (
                <span className="modal-warn">
                  {questions.length - Object.keys(answers).length} câu chưa trả lời sẽ bị tính sai.
                </span>
              )}
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmModal(false)}>Xem lại</button>
              <button className="btn btn-primary"
                onClick={() => { setConfirmModal(false); submitExam(); }}
                disabled={submitting}>
                {submitting ? 'Đang nộp…' : 'Xác nhận nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ──
function tinhDiem(questions, answers, exam) {
  let correct = 0, incorrect = 0, skipped = 0, score = 0;
  const chiTiet = questions.map(q => {
    const selected = answers[q.id] || null;
    const isCorrect = selected === q.correctOptionId;
    if (!selected) skipped++;
    else if (isCorrect) { correct++; score++; }
    else incorrect++;
    return { ...q, selectedOptionId: selected, isCorrect };
  });
  const total = questions.length;
  return {
    score: Number(((score / total) * 10).toFixed(2)),
    totalPoints: 10,
    correctCount: correct,
    incorrectCount: incorrect,
    skippedCount: skipped,
    totalQuestions: total,
    exam: { title: exam?.title, passingScore: 5 },
    questions: chiTiet,
  };
}

function luuLichSu(result, exam) {
  try {
    const history = JSON.parse(sessionStorage.getItem('exam_history') || '[]');
    history.unshift({
      id: `h_${Date.now()}`,
      examTitle: exam?.title || 'Đề thi',
      score: result.score,
      totalPoints: result.totalPoints || 10,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      passingScore: 5,
      timeTaken: result.timeTaken,
      completedAt: new Date().toISOString(),
    });
    sessionStorage.setItem('exam_history', JSON.stringify(history.slice(0, 20)));
  } catch {}
}

// ── Mock data khi không có API ──
const MOCK_EXAM = { id: '1', title: 'Đề thi mẫu', duration: 45, passingScore: 5 };
const MOCK_QS = [
  { id: 'q1', text: 'Đạo hàm của sin(x) là gì?', points: 1, correctOptionId: 'A',
    options: [{ id:'A', text:'cos(x)' },{ id:'B', text:'-cos(x)' },{ id:'C', text:'tan(x)' },{ id:'D', text:'-sin(x)' }] },
  { id: 'q2', text: 'Nguyên hàm của 2x là gì?', points: 1, correctOptionId: 'B',
    options: [{ id:'A', text:'x' },{ id:'B', text:'x² + C' },{ id:'C', text:'2x² + C' },{ id:'D', text:'x² ' }] },
];
