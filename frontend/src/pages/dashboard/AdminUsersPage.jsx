import React, { useState, useEffect } from 'react';
import { userService } from '../../services/examService';

export default function AdminUsersPage() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [success, setSuccess]   = useState('');
  const LIMIT = 10;

  useEffect(() => { fetchUsers(); }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // GET /dashboard/user?page=1&limit=10&keyword=
      const data = await userService.getAll({ page, limit: LIMIT, keyword: search });
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.totalRecords || 0);
    } catch (err) {
      console.error(err);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá người dùng này? Không thể hoàn tác!')) return;
    try {
      await userService.delete(id);
      flash('Đã xoá người dùng.');
      fetchUsers();
    } catch (err) { alert(err.message); }
  };

  const handleApprove = async (id) => {
    try {
      await userService.approve(id);
      flash('Đã duyệt tài khoản.');
      fetchUsers();
    } catch (err) { alert(err.message); }
  };

  const handleReject = async (id) => {
    try {
      await userService.reject(id);
      flash('Đã khoá tài khoản.');
      fetchUsers();
    } catch (err) { alert(err.message); }
  };

  // Khi search thay đổi → về trang 1
  const handleSearch = (val) => { setSearch(val); setPage(1); };

  const getRoleBadge = (user) => {
    const name = user?.Role?.name || user?.role_name || '';
    if (name === 'Admin') return <span className="badge badge-danger">Admin</span>;
    if (name === 'Teacher') return <span className="badge badge-info">Giáo viên</span>;
    return <span className="badge badge-neutral">Học sinh</span>;
  };

  const getStatusBadge = (user) => {
    const name = user?.Status?.name || user?.status_name || 'Approved';
    if (name === 'Approved') return <span className="badge badge-success">Hoạt động</span>;
    if (name === 'Rejected') return <span className="badge badge-danger">Bị khoá</span>;
    return <span className="badge badge-warning">Chờ duyệt</span>;
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title">Người dùng</h1>
          <p className="admin-page-sub">{totalRecords} người dùng trong hệ thống</p>
        </div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Tìm kiếm */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="search"
          className="form-input"
          style={{ maxWidth: 320 }}
          placeholder="Tìm theo tên đăng nhập hoặc email…"
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      #{user.id}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--accent-primary)', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
                        }}>
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.username}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {user.email}
                    </td>
                    <td>{getRoleBadge(user)}</td>
                    <td>{getStatusBadge(user)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-success)' }}
                          onClick={() => handleApprove(user.id)}>
                          ✓ Duyệt
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-warning)' }}
                          onClick={() => handleReject(user.id)}>
                          ✕ Khoá
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-danger)' }}
                          onClick={() => handleDelete(user.id)}>
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                Không tìm thấy người dùng.
              </div>
            )}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                ← Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Tiếp →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const MOCK_USERS = [
  { id: 1, username: 'admin',   email: 'admin@example.com',   Role: { name: 'Admin' },   Status: { name: 'Approved' } },
  { id: 2, username: 'giaovien1', email: 'teacher@example.com', Role: { name: 'Teacher' }, Status: { name: 'Approved' } },
  { id: 3, username: 'hocsinh1',  email: 'student@example.com', Role: { name: 'Student' }, Status: { name: 'Approved' } },
];
