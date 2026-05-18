import React from 'react';
import './Timer.css';
export default function Timer({formatted,percentage,isWarning,isDanger}){
  const cls=isDanger?'danger':isWarning?'warning':'';
  return(
    <div className={`timer ${cls}`}>
      <div className="timer-ring">
        <svg viewBox="0 0 48 48" className="timer-svg">
          <circle className="timer-track" cx="24" cy="24" r="20"/>
          <circle className="timer-fill" cx="24" cy="24" r="20"
            strokeDasharray="125.66"
            strokeDashoffset={125.66*(1-percentage/100)}/>
        </svg>
        <span className="timer-label">{formatted}</span>
      </div>
      {isDanger&&<span className="timer-hint blink">Sắp hết giờ!</span>}
      {isWarning&&!isDanger&&<span className="timer-hint">Sắp hết giờ</span>}
    </div>
  );
}
