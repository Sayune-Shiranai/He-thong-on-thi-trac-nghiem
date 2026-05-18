import React from 'react';
import './QuestionCard.css';
const LABELS=['A','B','C','D','E'];
export default function QuestionCard({question,selectedId,onSelect,questionNum,totalQuestions,reviewMode=false,correctId}){
  if(!question)return null;
  const getState=id=>{
    if(!reviewMode)return selectedId===id?'selected':'';
    if(id===correctId)return 'correct';
    if(id===selectedId&&id!==correctId)return 'incorrect';
    return '';
  };
  return(
    <div className="question-card animate-fadeIn">
      <div className="qcard-header">
        <span className="qcard-progress">Câu hỏi <strong>{questionNum}</strong> / {totalQuestions}</span>
        {question.points&&<span className="badge badge-neutral">{question.points} điểm</span>}
      </div>
      <div className="progress-bar" style={{marginBottom:28}}>
        <div className="progress-fill" style={{width:`${(questionNum/totalQuestions)*100}%`}}/>
      </div>
      <p className="qcard-text">{questionNum}. {question.text}</p>
      <div className="qcard-options">
        {question.options?.map((opt,idx)=>{
          const state=getState(opt.id);
          return(
            <button key={opt.id} className={`option-btn ${state}`}
              onClick={()=>!reviewMode&&onSelect(opt.id)} disabled={reviewMode} aria-pressed={selectedId===opt.id}>
              <span className="option-label">{LABELS[idx]}</span>
              <span className="option-text">{opt.text}</span>
              {reviewMode&&state==='correct'&&<span className="option-check">✓</span>}
              {reviewMode&&state==='incorrect'&&<span className="option-cross">✗</span>}
            </button>
          );
        })}
      </div>
      {reviewMode&&question.explanation&&(
        <div className="qcard-explanation">
          <span className="explanation-label">Giải thích</span>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
