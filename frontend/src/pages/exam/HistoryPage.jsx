import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {attemptService} from '../../services/examService';
import {pct,grade,formatDate,formatDuration,scoreColor} from '../../utils/helpers';

const MOCK=[
  {id:'r1',examTitle:'JavaScript Fundamentals',score:16,totalPoints:22,passingScore:70,timeTaken:980,completedAt:new Date(Date.now()-86400000).toISOString()},
  {id:'r2',examTitle:'React & Modern Frontend', score:28,totalPoints:40,passingScore:65,timeTaken:2200,completedAt:new Date(Date.now()-3*86400000).toISOString()},
  {id:'r3',examTitle:'HTML & CSS Essentials',  score:14,totalPoints:15,passingScore:75,timeTaken:760, completedAt:new Date(Date.now()-7*86400000).toISOString()},
];

export default function HistoryPage(){
  const [attempts,setAttempts]=useState([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{attemptService.getMyHistory().then(d=>setAttempts(Array.isArray(d)?d:d.attempts||[])).catch(()=>setAttempts(MOCK)).finally(()=>setLoading(false));},[]);
  const avg=attempts.length?Math.round(attempts.reduce((s,a)=>s+pct(a.score,a.totalPoints),0)/attempts.length):0;
  return(
    <div style={{minHeight:'100vh',padding:'40px 24px 80px'}}>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:32,flexWrap:'wrap',gap:16}}>
          <div><h1 style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:400,marginBottom:4}}>My Results</h1><p style={{fontSize:'0.9rem',color:'var(--text-secondary)'}}>Your complete exam history</p></div>
          <Link to="/dashboard" className="btn btn-secondary btn-sm">← Browse exams</Link>
        </div>
        {attempts.length>0&&(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:14,marginBottom:28}}>
            {[{l:'Exams taken',v:attempts.length},{l:'Average score',v:`${avg}%`},{l:'Passed',v:attempts.filter(a=>pct(a.score,a.totalPoints)>=(a.passingScore??60)).length},{l:'Grade',v:grade(avg)}].map(s=>(
              <div key={s.l} className="card" style={{textAlign:'center',padding:'18px 16px'}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:'0.74rem',textTransform:'uppercase',letterSpacing:'0.06em',color:'var(--text-muted)',marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
        {loading?<div className="loading-screen"><div className="spinner"/></div>:attempts.length===0?(
          <div className="empty-state"><div className="empty-icon">📊</div><h3>No exams taken yet</h3><p>Complete your first exam to see results here.</p><Link to="/dashboard" className="btn btn-primary" style={{marginTop:16}}>Browse exams</Link></div>
        ):(
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Exam</th><th>Date</th><th>Score</th><th>Grade</th><th>Status</th><th>Time</th><th></th></tr></thead>
              <tbody>
                {attempts.map(a=>{const p=pct(a.score,a.totalPoints);const passed=p>=(a.passingScore??60);return(
                  <tr key={a.id}>
                    <td style={{fontWeight:500}}>{a.examTitle}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'0.82rem',color:'var(--text-muted)'}}>{a.completedAt?formatDate(a.completedAt):'—'}</td>
                    <td><span style={{fontFamily:'var(--font-mono)',fontSize:'0.88rem',fontWeight:600,color:p>=80?'var(--accent-success)':p>=50?'var(--accent-warning)':'var(--accent-danger)'}}>{p}%</span></td>
                    <td style={{fontFamily:'var(--font-display)',fontSize:'1.1rem'}}>{grade(p)}</td>
                    <td><span className={`badge ${passed?'badge-success':'badge-danger'}`}>{passed?'Passed':'Failed'}</span></td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'0.82rem',color:'var(--text-muted)'}}>{a.timeTaken?formatDuration(Math.round(a.timeTaken/60)):'—'}</td>
                    <td><Link to={`/result/${a.id}`} className="btn btn-ghost btn-sm">Review</Link></td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
