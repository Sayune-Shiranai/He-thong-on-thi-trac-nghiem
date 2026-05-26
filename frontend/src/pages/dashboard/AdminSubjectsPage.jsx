import React, { useState, useEffect } from 'react';
import { subjectService, gradeService } from '../../services/examService';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' | 'grades'
  const [modal, setModal]       = useState(false);  // 'subject' | 'grade' | false
  const [editing, setEditing]   = useState(null);
  const [formVal, setFormVal]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchData(); }, [page, search, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'subjects') {
        const d = await subjectService.getAll({ page, limit: 10, keyword: search });
        setSubjects(d.data || []);
        setTotalPages(d.totalPages || 1);
      } else {
        const d = await gradeService.getAll({ page, limit: 10, keyword: search });
        setGrades(d.data || []);
        setTotalPages(d.totalPages || 1);
      }
    } catch {
      setSubjects(MOCK_SUBJECTS);
      setGrades(MOCK_GRADES);
    } finally { setLoading(false); }
  };

  const flash = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const openCreate = () => { setEditing(null); setFormVal(''); setError(''); setModal(activeTab === 'subjects' ? 'subject' : 'grade'); };
  const openEdit   = (item) => { setEditing(item); setFormVal(activeTab === 'subjects' ? item.name : item.grade); setError(''); setModal(activeTab === 'subjects' ? 'subject' : 'grade'); };

  const handleSave = async () => {
    if (!formVal.trim()) { setError('Vui lòng nhập tên!'); return; }
    try {
      setSaving(true); setError('');
      if (activeTab === 'subjects') {
        if (editing) { await subjectService.update(editing.id, { name: formVal }); }
        else         { await subjectService.create({ name: formVal }); }
      } else {
        if (editing) { await gradeService.update(editing.id, { grade: formVal }); }
        else         { await gradeService.create({ grade: formVal }); }
      }
      setModal(false);
      flash(editing ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xoá mục này?')) return;
    try {
      if (activeTab === 'subjects') await subjectService.delete(id);
      else                          await gradeService.delete(id);
      flash('Đã xoá!');
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const list = activeTab === 'subjects' ? subjects : grades;
  const label = activeTab === 'subjects' ? 'Môn học' : 'Khối lớp';
  const placeholder = activeTab === 'subjects' ? 'vd: Toán, Lý, Hóa…' : 'vd: Lớp 10, Lớp 11…';

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title">Môn học & Khối lớp</h1>
          <p className="admin-page-sub">Quản lý danh mục dùng cho câu hỏi và đề thi</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm {label}</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {/* Tab switch */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['subjects', '📚 Môn học'], ['grades', '🏫 Khối lớp']].map(([key, lbl]) => (
          <button key={key} className={`btn ${activeTab === key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setActiveTab(key); setPage(1); setSearch(''); }}>
            {lbl}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <input type="search" className="form-input" style={{ maxWidth: 300 }}
          placeholder={`Tìm ${label.toLowerCase()}…`} value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>ID</th><th>{label}</th><th>Thao tác</th></tr>
              </thead>
              <tbody>
                {list.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', width: 60 }}>#{item.id}</td>
                    <td style={{ fontWeight: 500 }}>{activeTab === 'subjects' ? item.name : item.grade}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Sửa</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent-danger)' }} onClick={() => handleDelete(item.id)}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Chưa có dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Trước</button>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trang {page} / {totalPages}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Tiếp →</button>
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{editing ? `Sửa ${label}` : `Thêm ${label}`}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">Tên {label} *</label>
              <input className="form-input" value={formVal} onChange={e => setFormVal(e.target.value)} placeholder={placeholder} autoFocus />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu…' : editing ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MOCK_SUBJECTS = [{ id: 1, name: 'Toán' }, { id: 2, name: 'Văn' }, { id: 3, name: 'Tiếng Anh' }, { id: 4, name: 'Vật lý' }];
const MOCK_GRADES   = [{ id: 1, grade: 'Lớp 10' }, { id: 2, grade: 'Lớp 11' }, { id: 3, grade: 'Lớp 12' }];
