import React,{useState,useEffect} from 'react';
import {useParams,useLocation,Link} from 'react-router-dom';
import {attemptService} from '../../services/examService';
import ResultSummary from '../../components/exam/ResultSummary';
import QuestionCard from '../../components/exam/QuestionCard';
import './ResultPage.css';

export default function ResultPage(){
  const {attemptId}=useParams();const location=useLocation();
  const [result,setResult]=useState(location.state?.result||null);
  const [loading,setLoading]=useState(!result);
  const [error,setError]=useState('');
  const [showReview,setShowReview]=useState(false);
  const [reviewIdx,setReviewIdx]=useState(0);

  useEffect(()=>{
    if(!result){
      attemptService.getResult(attemptId)
        .then(setResult).catch(e=>setError(e.message)).finally(()=>setLoading(false));
    }
  },[attemptId]);

  if(loading)return<div className="loading-screen" style={{minHeight:'100vh'}}><div className="spinner"/><span>Loading results…</span></div>;
  if(error)return<div style={{padding:40,textAlign:'center'}}><div className="alert alert-error">{error}</div><Link to="/dashboard" className="btn btn-primary" style={{marginTop:16}}>Back to Dashboard</Link></div>;

  const rqs=result?.questions||[];

  return(
    <div className="result-page">
      <div className="result-page-inner">
        {location.state?.autoSubmitted&&<div className="alert alert-info" style={{marginBottom:24}}>⏱ Time expired — your exam was submitted automatically.</div>}
        {result&&<ResultSummary result={result}/>}
        <div className="result-actions">
          <Link to="/dashboard" className="btn btn-secondary">← Back to Dashboard</Link>
          <Link to="/history"   className="btn btn-secondary">All my results</Link>
          {rqs.length>0&&<button className="btn btn-primary" onClick={()=>{setShowReview(r=>!r);setReviewIdx(0);}}>{showReview?'Hide review':'Review answers'}</button>}
        </div>
        {showReview&&rqs.length>0&&(
          <div className="review-section animate-fadeIn">
            <div className="review-header">
              <h2 className="review-title">Answer Review</h2>
              <span className="review-subtitle">{rqs.length} questions</span>
            </div>
            <div className="review-nav">
              <button className="btn btn-ghost btn-sm" onClick={()=>setReviewIdx(i=>Math.max(0,i-1))} disabled={reviewIdx===0}>← Prev</button>
              <div className="review-dots">
                {rqs.map((q,i)=>(
                  <button key={q.id} className={`review-dot ${i===reviewIdx?'current':''} ${q.isCorrect?'correct':'incorrect'}`} onClick={()=>setReviewIdx(i)} title={`Q${i+1}`}/>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setReviewIdx(i=>Math.min(rqs.length-1,i+1))} disabled={reviewIdx===rqs.length-1}>Next →</button>
            </div>
            <QuestionCard key={rqs[reviewIdx]?.id} question={rqs[reviewIdx]} selectedId={rqs[reviewIdx]?.selectedOptionId} correctId={rqs[reviewIdx]?.correctOptionId} onSelect={()=>{}} questionNum={reviewIdx+1} totalQuestions={rqs.length} reviewMode/>
            <div className="review-outcome">
              {rqs[reviewIdx]?.isCorrect?<span className="badge badge-success">✓ Correct</span>
               :rqs[reviewIdx]?.selectedOptionId?<span className="badge badge-danger">✗ Incorrect</span>
               :<span className="badge badge-warning">— Skipped</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
