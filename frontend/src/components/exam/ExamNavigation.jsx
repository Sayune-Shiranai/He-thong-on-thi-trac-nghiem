import React from 'react';
import './ExamNavigation.css';
export default function ExamNavigation({total,current,answers,questions,onNavigate,onSubmit,submitting}){
  const answered=Object.keys(answers).length;
  const unanswered=total-answered;
  return(
    <div className="exam-nav">
      <div className="exam-nav-header">
        <span className="exam-nav-title">Câu hỏi</span>
        <span className="exam-nav-count">{answered}/{total} đã trả lời</span>
      </div>
      <div className="exam-nav-grid">
        {questions.map((q,idx)=>(
          <button key={q.id}
            className={`nav-dot ${idx===current?'current':''} ${answers[q.id]?'answered':''}`}
            onClick={()=>onNavigate(idx)} title={`Câu ${idx+1}`}>
            {idx+1}
          </button>
        ))}
      </div>
      <div className="exam-nav-legend">
        <span className="legend-item"><span className="legend-dot current"/>Hiện tại</span>
        <span className="legend-item"><span className="legend-dot answered"/>Đã trả lời</span>
        <span className="legend-item"><span className="legend-dot"/>Chưa làm</span>
      </div>
      <div className="exam-nav-divider"/>
      {unanswered>0&&<p className="exam-nav-warning">⚠ Còn {unanswered} câu chưa trả lời</p>}
      <button className="btn btn-primary btn-lg exam-submit-btn" onClick={onSubmit} disabled={submitting}>
        {submitting?<><span className="spinner spinner-sm"/>Đang nộp bài…</>:'Nộp bài'}
      </button>
    </div>
  );
}
