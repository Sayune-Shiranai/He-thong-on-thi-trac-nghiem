import React from 'react';
import {pct,grade,scoreColor,formatDuration} from '../../utils/helpers';
import './ResultSummary.css';
export default function ResultSummary({result}){
  if(!result)return null;
  const{score,totalPoints,correctCount,incorrectCount,skippedCount,totalQuestions,timeTaken,exam}=result;
  const p=pct(score,totalPoints);
  const passed=p>=(exam?.passingScore??60);
  const g=grade(p);const c=scoreColor(p);
  return(
    <div className="result-summary animate-fadeScale">
      <div className="result-hero">
        <div className={`score-ring ${c}`}>
          <svg viewBox="0 0 120 120" className="score-svg">
            <circle className="score-track" cx="60" cy="60" r="52"/>
            <circle className="score-fill" cx="60" cy="60" r="52" strokeDasharray="326.73" strokeDashoffset={326.73*(1-p/100)}/>
          </svg>
          <div className="score-inner">
            <span className="score-pct">{p}%</span>
            <span className="score-grade">{g}</span>
          </div>
        </div>
        <div className="result-verdict">
          <span className={`verdict-badge ${passed?'passed':'failed'}`}>{passed?'✓ ĐẠT':'✗ CHƯA ĐẠT'}</span>
          <h2 className="verdict-title">{passed?'Xuất sắc!':'Cố gắng hơn lần sau nhé!'}</h2>
          <p className="verdict-sub">Bạn đạt <strong>{score}/{totalPoints}</strong> điểm{exam?.passingScore&&<> — Điểm đạt: {exam.passingScore}%</>}</p>
        </div>
      </div>
      <div className="result-stats">
        <div className="stat-card correct"><span className="stat-value">{correctCount}</span><span className="stat-label">Đúng</span></div>
        <div className="stat-card incorrect"><span className="stat-value">{incorrectCount}</span><span className="stat-label">Sai</span></div>
        <div className="stat-card skipped"><span className="stat-value">{skippedCount}</span><span className="stat-label">Bỏ qua</span></div>
        {timeTaken!=null&&<div className="stat-card time"><span className="stat-value">{formatDuration(Math.round(timeTaken/60))}</span><span className="stat-label">Thời gian</span></div>}
      </div>
      <div className="result-accuracy">
        <div className="accuracy-header">
          <span className="accuracy-label">Độ chính xác</span>
          <span className="accuracy-pct">{pct(correctCount,totalQuestions)}%</span>
        </div>
        <div className="accuracy-bar">
          <div className="accuracy-fill correct-fill" style={{width:`${pct(correctCount,totalQuestions)}%`}}/>
          <div className="accuracy-fill incorrect-fill" style={{width:`${pct(incorrectCount,totalQuestions)}%`}}/>
        </div>
        <div className="accuracy-legend">
          <span><span className="dot correct-dot"/>Đúng ({correctCount})</span>
          <span><span className="dot incorrect-dot"/>Sai ({incorrectCount})</span>
          <span><span className="dot skipped-dot"/>Bỏ qua ({skippedCount})</span>
        </div>
      </div>
    </div>
  );
}
