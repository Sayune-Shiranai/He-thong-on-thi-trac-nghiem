import {useState,useEffect,useRef,useCallback} from 'react';
export const useCountdown=(initialSeconds,onExpire)=>{
  const [seconds,setSeconds]=useState(initialSeconds);
  const [running,setRunning]=useState(false);
  const iv=useRef(null);const cbRef=useRef(onExpire);cbRef.current=onExpire;
  const start=useCallback(()=>setRunning(true),[]);
  const pause=useCallback(()=>setRunning(false),[]);
  const reset=useCallback(()=>{setRunning(false);setSeconds(initialSeconds);},[initialSeconds]);
  useEffect(()=>{
    if(!running){clearInterval(iv.current);return;}
    iv.current=setInterval(()=>{
      setSeconds(s=>{if(s<=1){clearInterval(iv.current);setRunning(false);cbRef.current?.();return 0;}return s-1;});
    },1000);
    return()=>clearInterval(iv.current);
  },[running]);
  const formatted=[String(Math.floor(seconds/60)).padStart(2,'0'),String(seconds%60).padStart(2,'0')].join(':');
  return{seconds,formatted,percentage:initialSeconds>0?(seconds/initialSeconds)*100:0,isWarning:seconds<=60,isDanger:seconds<=30,start,pause,reset};
};
