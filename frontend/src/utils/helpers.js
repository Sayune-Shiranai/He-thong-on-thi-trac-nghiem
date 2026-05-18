export const formatTime=s=>[String(Math.floor(s/60)).padStart(2,'0'),String(s%60).padStart(2,'0')].join(':');
export const pct=(v,t)=>t===0?0:Math.round((v/t)*100);
export const capitalize=s=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();
export const formatDate=iso=>new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'numeric'}).format(new Date(iso));
export const formatDuration=m=>m<60?`${m}m`:m%60>0?`${Math.floor(m/60)}h ${m%60}m`:`${Math.floor(m/60)}h`;
export const scoreColor=p=>p>=80?'success':p>=50?'warning':'danger';
export const grade=p=>p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F';
