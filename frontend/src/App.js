import React from 'react';
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';

import {AuthProvider}  from './context/AuthContext';
import {ThemeProvider} from './context/ThemeContext';

import Navbar         from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import AuthPage           from './pages/auth/AuthPage';
import DashboardPage      from './pages/dashboard/DashboardPage';
import ExamPage           from './pages/exam/ExamPage';
import ResultPage         from './pages/exam/ResultPage';
import HistoryPage        from './pages/exam/HistoryPage';
import AdminLayout        from './pages/admin/AdminLayout';
import AdminOverviewPage  from './pages/admin/AdminOverviewPage';
import AdminExamsPage     from './pages/admin/AdminExamsPage';
import AdminQuestionsPage from './pages/admin/AdminQuestionsPage';
import AdminUsersPage     from './pages/admin/AdminUsersPage';
import AdminResultsPage   from './pages/admin/AdminResultsPage';
import AdminSubjectsPage  from './pages/admin/AdminSubjectsPage';
import NotFoundPage       from './pages/NotFoundPage';

import './styles/globals.css';

export default function App(){
  return(
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            {/* Công khai */}
            <Route path="/login"    element={<AuthPage defaultTab="login"/>}/>
            <Route path="/register" element={<AuthPage defaultTab="register"/>}/>
            <Route path="/"         element={<Navigate to="/dashboard" replace/>}/>

            {/* Học viên (đã đăng nhập) */}
            <Route path="/dashboard"         element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
            <Route path="/exam/:examId"      element={<ProtectedRoute><ExamPage/></ProtectedRoute>}/>
            <Route path="/result/:attemptId" element={<ProtectedRoute><ResultPage/></ProtectedRoute>}/>
            <Route path="/history"           element={<ProtectedRoute><HistoryPage/></ProtectedRoute>}/>

            {/* Quản trị (adminOnly) */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout/></ProtectedRoute>}>
              <Route index              element={<AdminOverviewPage/>}/>
              <Route path="exams"       element={<AdminExamsPage/>}/>
              <Route path="questions"   element={<AdminQuestionsPage/>}/>
              <Route path="subjects"    element={<AdminSubjectsPage/>}/>
              <Route path="users"       element={<AdminUsersPage/>}/>
              <Route path="results"     element={<AdminResultsPage/>}/>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
