import React from 'react';
import {Link} from 'react-router-dom';
export default function NotFoundPage(){
  return(
    <div style={{minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'40px 24px',gap:'20px'}}>
      <div style={{fontFamily:'var(--font-display)',fontSize:'8rem',lineHeight:1,color:'var(--border-medium)'}}>404</div>
      <h1 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:400,color:'var(--text-primary)'}}>Page not found</h1>
      <p style={{color:'var(--text-secondary)',maxWidth:360}}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary">← Back to Dashboard</Link>
    </div>
  );
}
