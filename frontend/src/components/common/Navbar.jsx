import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, canAccessAdmin, isTeacher } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const [search,   setSearch]     = useState('');

  if (location.pathname.startsWith('/dashboard')) return null;
  if (location.pathname.startsWith('/exam/')) return null;
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  const handleLogout  = () => { logout(); navigate('/'); };
  const handleSearch  = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/exams?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="main-navbar">
      <div className="main-navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">EF</span>
        </Link>

        {/* Menu chính */}
        <div className="main-navbar-links">
          <Link to="/"      className={`main-nav-link ${location.pathname === '/' ? 'active' : ''}`}>TRANG CHỦ</Link>
          <Link to="/grade" className={`main-nav-link ${location.pathname === '/grade' ? 'active' : ''}`}>LỚP</Link>
          <Link to="/subject" className={`main-nav-link ${location.pathname === '/subject' ? 'active' : ''}`}>MÔN HỌC</Link>
          <Link to="/exams"   className={`main-nav-link ${location.pathname === '/exams' ? 'active' : ''}`}>TÌM KIẾM NÂNG CAO</Link>
          {/* Chỉ hiện TẠO ĐỀ nếu là Teacher, Admin, Moderator */}
          {user && (isTeacher || canAccessAdmin) && (
            <Link to="/create-exam" className={`main-nav-link ${location.pathname === '/create-exam' ? 'active' : ''}`}>TẠO ĐỀ</Link>
          )}
          <Link to="/guide" className={`main-nav-link ${location.pathname === '/guide' ? 'active' : ''}`}>HƯỚNG DẪN</Link>
        </div>

        {/* Phải: search + auth */}
        <div className="main-navbar-actions">
          {/* Search */}
          <form onSubmit={handleSearch} className="main-navbar-search">
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="main-navbar-search-input"
            />
          </form>

          {/* Dark mode */}
          <button className="icon-btn" onClick={toggleTheme} aria-label="Chuyển giao diện">
            {theme === 'light'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
            }
          </button>

          {user ? (
            /* Đã đăng nhập → dropdown (ảnh 5) */
            <div className="user-menu">
              <button className="user-avatar-btn" onClick={() => setDropOpen(o => !o)}>
                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
              </button>
              {dropOpen && (
                <div className="main-dropdown-menu" onMouseLeave={() => setDropOpen(false)}>
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-role">
                      {user.role_name === 'Admin' ? 'Admin'
                        : user.role_name === 'Teacher' ? 'Giáo viên'
                        : user.role_name === 'Moderator' ? 'Moderator'
                        : 'Học sinh'}
                    </p>
                  </div>
                  <div className="dropdown-divider"/>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropOpen(false)}>Profile</Link>
                  {/* Bỏ My Exam nếu là Student */}
                  {(isTeacher || canAccessAdmin) && (
                    <Link to="/my-exams" className="dropdown-item" onClick={() => setDropOpen(false)}>My Exam</Link>
                  )}
                  <Link to="/history" className="dropdown-item" onClick={() => setDropOpen(false)}>History</Link>
                  <button className="dropdown-item danger" onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            /* Chưa đăng nhập → Đăng nhập + Đăng ký */
            <div className="auth-btns">
              <Link to="/register" className="btn btn-secondary btn-sm">Đăng ký</Link>
              <Link to="/login"    className="btn btn-primary btn-sm">Đăng nhập</Link>
            </div>
          )}

          {/* Hamburger mobile */}
          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-nav">
          <Link to="/"       className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
          <Link to="/grade"  className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Lớp</Link>
          <Link to="/subject" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Môn học</Link>
          <Link to="/exams"  className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Tìm kiếm</Link>
          {user && (isTeacher || canAccessAdmin) && (
            <Link to="/create-exam" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Tạo đề</Link>
          )}
          {user
            ? <button className="mobile-nav-link danger" onClick={handleLogout}>Đăng xuất</button>
            : <>
                <Link to="/login"    className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
                <Link to="/register" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
              </>
          }
        </div>
      )}
    </nav>
  );
}
