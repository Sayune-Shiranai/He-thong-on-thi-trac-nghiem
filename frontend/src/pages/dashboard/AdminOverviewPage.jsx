import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  userService, 
  subjectService, 
  gradeService, 
  questionService, 
  examService 
} from '../../services/examService';
import './AdminOverviewPage.css';

export default function AdminOverviewPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, subjects, grades, questions, exams] = await Promise.all([
          userService.getPagedUsers(),
          subjectService.GetPagedSubjects(),
          gradeService.GetPagedGrades(),
          questionService.GetPagedQuestions(),
          examService.GetPagedExams(),
        ]);
        console.log(users);
        console.log(subjects);
        console.log(grades);
        console.log(questions);
        console.log(exams);
        setStats({
          totalUsers:     users.totalRecords     || 0,
          totalSubjects:  subjects.totalRecords  || 0,
          totalGrades:    grades.totalRecords     || 0,
          totalExams:     exams.totalRecords     || 0,
          totalQuestions: questions.totalRecords || 0,
        });
      } catch (err) {
        console.error(err);
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
          { label: 'Người dùng',    value: stats.totalUsers,     color: 'blue',   icon: '👥', to: '/dashboard/user' },
          { label: 'Đề thi',        value: stats.totalExams,     color: 'green',  icon: '📋', to: '/dashboard/exam' },
          { label: 'Câu hỏi',       value: stats.totalQuestions, color: 'orange', icon: '❓', to: '/dashboard/question' },
          { label: 'Môn học',        value: stats.totalSubjects, color: 'red',    icon: '📚', to: '/dashboard/subject' },
          { label: 'Khối',       value: stats.totalGrades,       color: 'yellow', icon: '🏫', to: '/dashboard/grade' },
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
            { to: '/dashboard/exam/create',     icon: '+', label: 'Tạo đề thi mới' },
            { to: '/dashboard/question/create', icon: '+', label: 'Thêm câu hỏi' },
            { to: '/dashboard/grade',     icon: '→', label: 'Quản lý khối' },
            { to: '/dashboard/subject',  icon: '→', label: 'Quản lý môn học' },
            
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
