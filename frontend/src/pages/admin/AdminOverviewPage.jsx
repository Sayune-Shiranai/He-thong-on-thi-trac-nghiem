import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService, subjectService, gradeService } from '../../services/examService';
import './AdminOverviewPage.css';

export default function AdminOverviewPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, subjects, grades] = await Promise.all([
          userService.getAll({ limit: 1 }),
          subjectService.getAll({ limit: 1 }),
          gradeService.getAll({ limit: 1 }),
        ]);
        setStats({
          totalUsers:     users.totalRecords     || 0,
          totalSubjects:  subjects.totalRecords  || 0,
          totalGrades:    grades.totalRecords     || 0,
          totalExams:     3,   // chưa có GET all exams
          totalQuestions: 0,
        });
      } catch {
        setStats({ totalUsers: 0, totalSubjects: 4, totalGrades: 3, totalExams: 3, totalQuestions: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="admin-overview">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tổng quan</h1>
        <p className="admin-page-sub">Thống kê hệ thống ôn thi trắc nghiệm</p>
      </div>

      <div className="admin-stats-grid stagger">
        {[
          { label: 'Người dùng',    value: stats.totalUsers,     color: 'blue',   icon: '👥', to: '/admin/users' },
          { label: 'Đề thi',        value: stats.totalExams,     color: 'green',  icon: '📋', to: '/admin/exams' },
          { label: 'Câu hỏi',       value: stats.totalQuestions, color: 'orange', icon: '❓', to: '/admin/questions' },
          { label: 'Môn học',        value: stats.totalSubjects,  color: 'red',    icon: '📚', to: '/admin/subjects' },
        ].map(s => (
          <Link to={s.to} key={s.label} style={{ textDecoration: 'none' }}>
            <div className={`admin-stat-card animate-fadeIn ${s.color}`}>
              <div className="admin-stat-icon">{s.icon}</div>
              <div className="admin-stat-body">
                <span className="admin-stat-value">{s.value}</span>
                <span className="admin-stat-label">{s.label}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-quick-links">
        <h2 className="section-heading">Thao tác nhanh</h2>
        <div className="quick-grid">
          {[
            { to: '/admin/exams',     icon: '+', label: 'Tạo đề thi mới' },
            { to: '/admin/questions', icon: '+', label: 'Thêm câu hỏi' },
            { to: '/admin/subjects',  icon: '→', label: 'Quản lý môn học' },
            { to: '/admin/users',     icon: '→', label: 'Quản lý người dùng' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="quick-card">
              <span className="quick-icon">{a.icon}</span>
              <span className="quick-label">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: 8 }}>
        💡 Backend đang chạy tại <strong>http://localhost:3000</strong> — dùng SQL Server (MSSQL) qua Sequelize.
      </div>
    </div>
  );
}
