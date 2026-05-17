import React,{useState,useEffect,useCallback,useRef} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {questionService,attemptService,examService} from '../../services/examService';
import {useCountdown} from '../../hooks/useCountdown';
import QuestionCard from '../../components/exam/QuestionCard';
import ExamNavigation from '../../components/exam/ExamNavigation';
import Timer from '../../components/exam/Timer';
import './ExamPage.css';

const MOCK_EXAM={id:'1',title:'JavaScript Fundamentals',duration:30,questionCount:5,passingScore:70};
const MOCK_QS=[
  {id:'q1',text:'Which keyword declares a block-scoped variable in JavaScript?',points:2,correctOptionId:'q1b',explanation:'`let` is block-scoped; `var` is function-scoped.',options:[{id:'q1a',text:'var'},{id:'q1b',text:'let'},{id:'q1c',text:'const'},{id:'q1d',text:'function'}]},
  {id:'q2',text:'What does === check in JavaScript?',points:2,correctOptionId:'q2c',explanation:'Strict equality checks both value and type.',options:[{id:'q2a',text:'Value only'},{id:'q2b',text:'Type only'},{id:'q2c',text:'Value and type'},{id:'q2d',text:'Reference'}]},
  {id:'q3',text:'Which method converts a JS object to JSON string?',points:2,correctOptionId:'q3b',explanation:'JSON.stringify() serialises; JSON.parse() does the reverse.',options:[{id:'q3a',text:'JSON.parse()'},{id:'q3b',text:'JSON.stringify()'},{id:'q3c',text:'Object.toString()'},{id:'q3d',text:'JSON.encode()'}]},
  {id:'q4',text:'What does typeof null return?',points:3,correctOptionId:'q4c',explanation:'A known JS quirk — typeof null returns "object".',options:[{id:'q4a',text:'"null"'},{id:'q4b',text:'"undefined"'},{id:'q4c',text:'"object"'},{id:'q4d',text:'"boolean"'}]},
  {id:'q5',text:'Which array method returns a NEW array of filtered elements?',points:2,correctOptionId:'q5c',explanation:'Array.filter() creates a new array from elements passing the test.',options:[{id:'q5a',text:'map()'},{id:'q5b',text:'find()'},{id:'q5c',text:'filter()'},{id:'q5d',text:'reduce()'}]},
];

function genMockResult(questions,answers){
  let correct=0,incorrect=0,skipped=0,score=0,total=0;
  questions.forEach(q=>{
    total+=q.points||1;
    if(!answers[q.id]){skipped++;return;}
    if(answers[q.id]===q.correctOptionId){correct++;score+=q.points||1;}else incorrect++;
  });
  return{score,totalPoints:total,correctCount:correct,incorrectCount:incorrect,skippedCount:skipped,totalQuestions:questions.length,timeTaken:720,exam:MOCK_EXAM,
    questions:questions.map(q=>({...q,selectedOptionId:answers[q.id]||null,isCorrect:answers[q.id]===q.correctOptionId}))};
}

export default function ExamPage(){
  const {examId}=useParams();const navigate=useNavigate();
  const [exam,setExam]=useState(null);const [questions,setQuestions]=useState([]);
  const [answers,setAnswers]=useState({});const [currentIdx,setCurrentIdx]=useState(0);
  const [attemptId,setAttemptId]=useState(null);
  const [loading,setLoading]=useState(true);const [submitting,setSubmitting]=useState(false);
  const [confirmModal,setConfirmModal]=useState(false);
  const hasSubmitted=useRef(false);
  const totalSeconds=(exam?.duration??30)*60;
  const countdown=useCountdown(totalSeconds,()=>submitExam(true));

  useEffect(()=>{loadExam();},[examId]);
  useEffect(()=>{if(exam&&!loading)countdown.start();},[exam,loading]);

  async function loadExam(){
    try{
      setLoading(true);
      const [ed,attempt]=await Promise.all([examService.getById(examId),attemptService.start(examId)]);
      const qs=await questionService.getByExam(examId);
      setExam(ed);setQuestions(Array.isArray(qs)?qs:qs.questions||[]);setAttemptId(attempt.attemptId||attempt.id);
    }catch{setExam(MOCK_EXAM);setQuestions(MOCK_QS);setAttemptId('mock-attempt-1');}
    finally{setLoading(false);}
  }

  const handleSelect=useCallback(optId=>{const qId=questions[currentIdx]?.id;if(qId)setAnswers(p=>({...p,[qId]:optId}));},[currentIdx,questions]);

  const submitExam=async(auto=false)=>{
    if(hasSubmitted.current)return;hasSubmitted.current=true;setSubmitting(true);countdown.pause();
    try{
      const result=await attemptService.submit(attemptId,answers);
      navigate(`/result/${result.attemptId||attemptId}`,{state:{result,autoSubmitted:auto},replace:true});
    }catch{
      navigate(`/result/${attemptId}`,{state:{result:genMockResult(questions,answers),autoSubmitted:auto},replace:true});
    }finally{setSubmitting(false);}
  };

  if(loading)return<div className="loading-screen" style={{minHeight:'100vh'}}><div className="spinner"/><span>Loading exam…</span></div>;

  const q=questions[currentIdx];

  return(
    <div className="exam-page">
      <header className="exam-topbar">
        <div className="exam-topbar-inner">
          <div className="exam-topbar-left">
            <div className="exam-logo-mark">EF</div>
            <div><p className="exam-name">{exam?.title}</p><p className="exam-meta">{questions.length} questions · {exam?.duration}min</p></div>
          </div>
          <Timer formatted={countdown.formatted} percentage={countdown.percentage} isWarning={countdown.isWarning} isDanger={countdown.isDanger}/>
          <button className="btn btn-secondary btn-sm" onClick={()=>setConfirmModal(true)}>Submit exam</button>
        </div>
      </header>

      <div className="exam-body">
        <main className="exam-main">
          <div className="exam-question-nav">
            <button className="btn btn-ghost btn-sm" onClick={()=>setCurrentIdx(i=>Math.max(0,i-1))} disabled={currentIdx===0}>← Previous</button>
            <span className="exam-progress-label">{currentIdx+1} / {questions.length}</span>
            <button className="btn btn-ghost btn-sm" onClick={()=>setCurrentIdx(i=>Math.min(questions.length-1,i+1))} disabled={currentIdx===questions.length-1}>Next →</button>
          </div>
          {q&&<QuestionCard key={q.id} question={q} selectedId={answers[q.id]||null} onSelect={handleSelect} questionNum={currentIdx+1} totalQuestions={questions.length}/>}
        </main>
        <aside className="exam-sidebar">
          <ExamNavigation total={questions.length} current={currentIdx} answers={answers} questions={questions} onNavigate={setCurrentIdx} onSubmit={()=>setConfirmModal(true)} submitting={submitting}/>
        </aside>
      </div>

      {confirmModal&&(
        <div className="modal-overlay" onClick={()=>setConfirmModal(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <h3 className="modal-title">Submit exam?</h3>
            <p className="modal-body">
              You answered <strong>{Object.keys(answers).length}</strong> of <strong>{questions.length}</strong> questions.{' '}
              {questions.length-Object.keys(answers).length>0&&<span className="modal-warn">{questions.length-Object.keys(answers).length} unanswered questions will be marked incorrect.</span>}
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={()=>setConfirmModal(false)}>Continue reviewing</button>
              <button className="btn btn-primary" onClick={()=>{setConfirmModal(false);submitExam();}} disabled={submitting}>{submitting?'Submitting…':'Yes, submit'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
