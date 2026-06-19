import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar         from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import AuthPage           from './pages/auth/AuthPage';
import HomePage      from './pages/home/HomePage';
import GradePage          from './pages/home/GradePage';
import GradeDetailPage    from './pages/home/GradeDetailPage';
import SubjectPage        from './pages/home/SubjectPage';
import SubjectDetailPage  from './pages/home/SubjectDetailPage';
import ExamsPage          from './pages/home/ExamsPage';
import GuidePage          from './pages/home/GuidePage';
import ExamDetailPage     from './pages/exam/ExamDetailPage';
import ExamPage           from './pages/exam/ExamPage';
import ResultPage         from './pages/exam/ResultPage';
import ResultDetailPage   from './pages/exam/ResultDetailPage';
import HistoryPage        from './pages/exam/HistoryPage';
import AdminLayout        from './pages/dashboard/AdminLayout';
import AdminOverviewPage  from './pages/dashboard/AdminOverviewPage';
import AdminExamsPage     from './pages/dashboard/AdminExamsPage';
import AdminQuestionsPage from './pages/dashboard/AdminQuestionsPage';
import UsersPage     from './pages/dashboard/User/UserPage';
import UpdateUserPage from './pages/dashboard/User/UpdateUser/UpdateUserPage';
import RolePage      from './pages/dashboard/Role/RolePage';
import CreateRolePage from './pages/dashboard/Role/CreateRole/CreateRolePage';
import TeacherPage from './pages/dashboard/Teacher/TeacherPage';
import CreateTeacherPage from './pages/dashboard/Teacher/CreateTeacher/CreateTeacherPage';
import UpdateTeacherPage from './pages/dashboard/Teacher/UpdateTeacher/UpdateTeacherPage';
import AdminResultsPage   from './pages/dashboard/AdminResultsPage';
import AdminSubjectsPage  from './pages/dashboard/AdminSubjectsPage';
import NotFoundPage       from './pages/NotFoundPage';

import './styles/globals.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* ── Công khai (không cần đăng nhập) ── */}
            <Route path="/login"    element={<AuthPage key="login"    defaultTab="login" />} />
            <Route path="/register" element={<AuthPage key="register" defaultTab="register" />} />

            {/* Trang chủ = danh sách đề thi */}
            <Route path="/"          element={<HomePage />} />
            {/* <Route path="/dashboard" element={<DashboardPage />} /> */}

            {/* Xem chi tiết đề — công khai, chỉ bấm "Bắt đầu" mới cần đăng nhập */}
            <Route path="/detail/:examId" element={<ExamDetailPage />} />

            {/* ── LỚP / MÔN HỌC / TÌM KIẾM NÂNG CAO / HƯỚNG DẪN — công khai ── */}
            <Route path="/grade"                element={<GradePage />} />
            <Route path="/grade/:gradeKey"      element={<GradeDetailPage />} />
            <Route path="/subject"              element={<SubjectPage />} />
            <Route path="/subject/:subjectName" element={<SubjectDetailPage />} />
            <Route path="/exams"                element={<ExamsPage />} />
            <Route path="/guide"                element={<GuidePage />} />

            {/* ── Cần đăng nhập ── */}
            <Route path="/exam/:examId"      element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
            <Route path="/result/:attemptId" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
            <Route path="/history"           element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

            {/* ── Admin ── */}
            <Route path="/dashboard" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index            element={<AdminOverviewPage />} />
              <Route path="exams"     element={<AdminExamsPage />} />
              <Route path="questions" element={<AdminQuestionsPage />} />
              <Route path="subjects"  element={<AdminSubjectsPage />} />
              <Route path="user"     element={<UsersPage />} />
              <Route path="role"     element={<RolePage />} />
              <Route path="role/create" element={<CreateRolePage />} />
              <Route path="user/update/:id" element={<UpdateUserPage />} />
              <Route path="teacher"   element={<TeacherPage />} />
              <Route path="teacher/create"   element={<CreateTeacherPage />} />
              <Route path="teacher/update/:id"   element={<UpdateTeacherPage />} />
              <Route path="results"   element={<AdminResultsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
