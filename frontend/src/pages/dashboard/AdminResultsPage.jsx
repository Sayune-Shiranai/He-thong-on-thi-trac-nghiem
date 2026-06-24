import React,{useState,useEffect} from 'react';
import {examService} from '../../services/examService';
import api from '../../services/api';
import {pct,grade,formatDate} from '../../utils/helpers';

const MOCK_A=[
  {id:'a1',userName:'Alice Chen',  examTitle:'JavaScript Fundamentals',examId:'1',score:18,totalPoints:22,correctCount:15,totalQuestions:20,passingScore:70,completedAt:'2026-05-10T14:32:00Z'},
  {id:'a2',userName:'Bob Martin',  examTitle:'React & Modern Frontend', examId:'2',score:22,totalPoints:40,correctCount:14,totalQuestions:30,passingScore:65,completedAt:'2026-05-10T13:11:00Z'},
  {id:'a3',userName:'Cara Singh',  examTitle:'JavaScript Fundamentals',examId:'1',score:20,totalPoints:22,correctCount:18,totalQuestions:20,passingScore:70,completedAt:'2026-05-09T11:05:00Z'},
  {id:'a4',userName:'David Park',  examTitle:'SQL Basics',             examId:'3',score:15,totalPoints:25,correctCount:10,totalQuestions:18,passingScore:70,completedAt:'2026-05-08T09:00:00Z'},
  {id:'a5',userName:'Emma Johnson',examTitle:'HTML & CSS Essentials',  examId:'4',score:13,totalPoints:15,correctCount:12,totalQuestions:15,passingScore:75,completedAt:'2026-05-07T16:00:00Z'},
];
const MOCK_E=[{id:'1',title:'JavaScript Fundamentals'},{id:'2',title:'React & Modern Frontend'},{id:'3',title:'SQL Basics'},{id:'4',title:'HTML & CSS Essentials'}];

export default function AdminResultsPage(){
  const [attempts,setAttempts]=useState([]);const [exams,setExams]=useState([]);
  const [loading,setLoading]=useState(true);const [examFilter,setExamFilter]=useState('');

  useEffect(()=>{
    Promise.all([api.get('/admin/attempts'),examService.GetAllExam()])
      .then(([a,e])=>{setAttempts(Array.isArray(a)?a:a.attempts||[]);setExams(Array.isArray(e)?e:e.exams||[]);})
      .catch(()=>{setAttempts(MOCK_A);setExams(MOCK_E);})
      .finally(()=>setLoading(false));
  },[]);

  const filtered=examFilter?attempts.filter(a=>a.examId===examFilter):attempts;
  const avg=filtered.length?Math.round(filtered.reduce((s,a)=>s+pct(a.score,a.totalPoints),0)/filtered.length):0;
  const passRate=filtered.length?Math.round(filtered.filter(a=>pct(a.score,a.totalPoints)>=(a.passingScore??60)).length/filtered.length*100):0;

  return(
    <div style={{maxWidth:1000}}>
      <div style={{marginBottom:24}}>
        <h1 className="admin-page-title">Results</h1>
        <p className="admin-page-sub">All student attempt records</p>
      </div>
      {filtered.length>0&&(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:14,marginBottom:24}}>
          {[{l:'Total attempts',v:filtered.length},{l:'Average score',v:`${avg}%`},{l:'Pass rate',v:`${passRate}%`},{l:'Grade average',v:grade(avg)}].map(s=>(
            <div key={s.l} className="card" style={{padding:'18px 20px'}}>
              <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',lineHeight:1,marginBottom:4}}>{s.v}</div>
              <div style={{fontSize:'0.74rem',textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--text-muted)'}}>{s.l}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{marginBottom:18}}>
        <select className="form-select" style={{maxWidth:280}} value={examFilter} onChange={e=>setExamFilter(e.target.value)}>
          <option value="">All exams</option>
          {exams.map(e=><option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </div>
      {loading?<div className="loading-screen"><div className="spinner"/></div>:(
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Student</th><th>Exam</th><th>Score</th><th>Grade</th><th>Correct</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {filtered.map(a=>{
                const p=pct(a.score,a.totalPoints);const passed=p>=(a.passingScore??60);
                return(
                  <tr key={a.id}>
                    <td style={{fontWeight:500}}>{a.userName}</td>
                    <td style={{color:'var(--text-secondary)',fontSize:'0.88rem'}}>{a.examTitle}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'0.88rem',fontWeight:600,color:p>=80?'var(--accent-success)':p>=50?'var(--accent-warning)':'var(--accent-danger)'}}>{p}%</td>
                    <td style={{fontFamily:'var(--font-display)',fontSize:'1.1rem'}}>{grade(p)}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'0.82rem',color:'var(--text-secondary)'}}>{a.correctCount}/{a.totalQuestions}</td>
                    <td><span className={`badge ${passed?'badge-success':'badge-danger'}`}>{passed?'Passed':'Failed'}</span></td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'0.8rem',color:'var(--text-muted)'}}>{a.completedAt?formatDate(a.completedAt):'—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{padding:40,textAlign:'center',color:'var(--text-muted)',fontSize:'0.9rem'}}>No results found.</div>}
        </div>
      )}
    </div>
  );
}
