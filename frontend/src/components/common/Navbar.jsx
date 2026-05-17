import React,{useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import './Navbar.css';

export default function Navbar(){
  const {user,logout,isAdmin}=useAuth();
  const {theme,toggleTheme}=useTheme();
  const navigate=useNavigate();
  const location=useLocation();
  const [menuOpen,setMenuOpen]=useState(false);
  const [dropOpen,setDropOpen]=useState(false);

  if(location.pathname.startsWith('/exam/'))return null;

  const handleLogout=()=>{logout();navigate('/login');};

  return(
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">EF</span>
          <span className="logo-text">ExamFlow</span>
        </Link>

        {user&&(
          <div className="navbar-links">
            <Link to="/dashboard" className={`nav-link ${location.pathname==='/dashboard'?'active':''}`}>Trang chủ</Link>
            <Link to="/history"   className={`nav-link ${location.pathname==='/history'?'active':''}`}>Kết quả của tôi</Link>
            {isAdmin&&<Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin')?'active':''}`}>Quản trị</Link>}
          </div>
        )}

        <div className="navbar-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Chuyển giao diện">
            {theme==='light'
              ?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              :<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
            }
          </button>

          {user?(
            <div className="user-menu">
              <button className="user-avatar-btn" onClick={()=>setDropOpen(o=>!o)}>
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name?.split(' ').pop()}</span>
              </button>
              {dropOpen&&(
                <div className="dropdown-menu" onMouseLeave={()=>setDropOpen(false)}>
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider"/>
                  <Link to="/profile" className="dropdown-item" onClick={()=>setDropOpen(false)}>Hồ sơ cá nhân</Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          ):(
            <div className="auth-btns">
              <Link to="/login"    className="btn btn-ghost btn-sm">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </div>
          )}

          <button className="icon-btn mobile-menu-btn" onClick={()=>setMenuOpen(o=>!o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen?<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>:<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen&&user&&(
        <div className="mobile-nav">
          <Link to="/dashboard" className="mobile-nav-link" onClick={()=>setMenuOpen(false)}>Trang chủ</Link>
          <Link to="/history"   className="mobile-nav-link" onClick={()=>setMenuOpen(false)}>Kết quả của tôi</Link>
          {isAdmin&&<Link to="/admin" className="mobile-nav-link" onClick={()=>setMenuOpen(false)}>Quản trị</Link>}
          <button className="mobile-nav-link danger" onClick={handleLogout}>Đăng xuất</button>
        </div>
      )}
    </nav>
  );
}
