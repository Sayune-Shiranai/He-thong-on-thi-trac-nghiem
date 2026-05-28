import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import './AuthPage.css';

export default function AuthPage({ defaultTab = 'login' }) {
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [tab, setTab]         = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [regData, setRegData]     = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const handleLogin = async (e) => {
    e.preventDefault(); setError('');
    if (!loginData.username) { setError('Vui lòng nhập tên đăng nhập!'); return; }
    if (!loginData.password) { setError('Vui lòng nhập mật khẩu!'); return; }
    try {
      setLoading(true);
      await login(loginData.username, loginData.password);
      navigate(from, { replace: true });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!regData.username) { setError('Tên đăng nhập không được để trống!'); return; }
    if (!regData.email)    { setError('Email không được để trống!'); return; }
    if (!regData.password) { setError('Mật khẩu không được để trống!'); return; }
    if (regData.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự!'); return; }
    if (regData.password !== regData.confirmPassword) { setError('Mật khẩu xác nhận không khớp!'); return; }
    try {
      setLoading(true);
      await register({ ...regData, role: 'Student' });
      setSuccess('Tạo tài khoản thành công! Vui lòng đăng nhập.');
      setTab('login');
      setLoginData({ username: regData.username, password: '' });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setSuccess('');
    navigate(t === 'login' ? '/login' : '/register', { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-blob blob-1"/><div className="auth-bg-blob blob-2"/>
        <div className="auth-bg-grid"/>
      </div>

      <button className="auth-theme-btn" onClick={toggleTheme} aria-label="Chuyển giao diện">
        {theme === 'light'
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
        }
      </button>

      <Link to="/" className="btn btn-ghost btn-sm" style={{ position:'fixed', top:20, left:20, zIndex:50 }}>
        ← Trang chủ
      </Link>

      <div className="auth-card animate-fadeScale">
        <div className="auth-brand">
          <div className="auth-logo-mark">EF</div>
          <span className="auth-logo-text">ExamFlow</span>
        </div>

        {location.state?.from?.pathname?.startsWith('/exam/') && (
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            🔒 Bạn cần đăng nhập để làm bài thi này.
          </div>
        )}

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
            Đăng nhập
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
            Đăng ký
          </button>
          <div className="auth-tab-indicator" style={{ left: tab === 'login' ? '4px' : '50%' }}/>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {tab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form" noValidate>
            <p className="auth-subtitle">Chào mừng trở lại — đăng nhập để tiếp tục.</p>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập hoặc Email</label>
              <input type="text" className="form-input" placeholder="Nhập tên đăng nhập"
                value={loginData.username}
                onChange={e => setLoginData(d => ({ ...d, username: e.target.value }))}
                autoComplete="username" required/>
            </div>
            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input type="password" className="form-input" placeholder="••••••••"
                value={loginData.password}
                onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                autoComplete="current-password" required/>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={loading}>
              {loading ? <><span className="spinner spinner-sm"/>Đang đăng nhập…</> : 'Đăng nhập'}
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form" noValidate>
            <p className="auth-subtitle">Tạo tài khoản miễn phí chỉ trong vài giây.</p>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập *</label>
              <input type="text" className="form-input" placeholder="vd: nguyen_van_a"
                value={regData.username}
                onChange={e => setRegData(d => ({ ...d, username: e.target.value }))} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" placeholder="ban@example.com"
                value={regData.email}
                onChange={e => setRegData(d => ({ ...d, email: e.target.value }))} required/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mật khẩu *</label>
                <input type="password" className="form-input" placeholder="Tối thiểu 6 ký tự"
                  value={regData.password}
                  onChange={e => setRegData(d => ({ ...d, password: e.target.value }))} required/>
              </div>
              <div className="form-group">
                <label className="form-label">Xác nhận mật khẩu *</label>
                <input type="password" className="form-input" placeholder="Nhập lại"
                  value={regData.confirmPassword}
                  onChange={e => setRegData(d => ({ ...d, confirmPassword: e.target.value }))} required/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={loading}>
              {loading ? <><span className="spinner spinner-sm"/>Đang tạo tài khoản…</> : 'Tạo tài khoản'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
