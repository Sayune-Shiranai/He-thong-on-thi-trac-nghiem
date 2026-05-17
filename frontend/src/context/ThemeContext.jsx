import React,{createContext,useContext,useState,useEffect} from 'react';
const ThemeContext=createContext(null);
export const ThemeProvider=({children})=>{
  const [theme,setTheme]=useState(()=>localStorage.getItem('examflow_theme')||'light');
  useEffect(()=>{document.documentElement.setAttribute('data-theme',theme);localStorage.setItem('examflow_theme',theme);},[theme]);
  const toggleTheme=()=>setTheme(t=>t==='light'?'dark':'light');
  return <ThemeContext.Provider value={{theme,toggleTheme}}>{children}</ThemeContext.Provider>;
};
export const useTheme=()=>{const c=useContext(ThemeContext);if(!c)throw new Error('useTheme outside ThemeProvider');return c;};
