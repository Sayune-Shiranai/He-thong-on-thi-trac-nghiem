import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../../../../media/logo/logo-dark.png";
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const { user } = useAuth();

  const role = user?.role_name;

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const hasRole = (roles = []) => {
    if (!role) return false;
    return roles.includes(role);
  };

  return (
    <aside className={`sidebar-wrapper ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-wrapper">
        <Link to="/dashboard">
          <img className="logo-dark" src={logo} alt="logo-dark" />
        </Link>
      </div>

      <div className="toggle-sidebar" onClick={() => setCollapsed(!collapsed)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-grid sidebar-toggle"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </div>

      <nav className="sidebar-main">
        <ul className="sidebar-links">

          {/* QUẢN LÝ HỆ THỐNG */}
          <li className="sidebar-main-title">
            <h6>Quản lý hệ thống</h6>
          </li>

          <li className="sidebar-list">
            <Link className="sidebar-link sidebar-title" to="/dashboard">
              <i className="fa fa-home"></i>
              <span className="ms-2">Dashboard</span>
            </Link>
          </li>

          {hasRole(["Admin"]) && (
            <>
              <li className={`sidebar-list ${openMenu === "users" ? "open" : ""}`}>
                <div
                  className="sidebar-link sidebar-title"
                  onClick={() => toggleMenu("users")}
                >
                  <i className="fa fa-user"></i>
                  <span className="ms-2">Người dùng</span>
                  <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
                </div>

                <ul className="sidebar-submenu">
                  <li><Link to="/dashboard/user">Danh sách người dùng</Link></li>
                  <li><Link to="/dashboard/user/create">Thêm người dùng</Link></li>
                </ul>
              </li>

              <li className={`sidebar-list ${openMenu === "role" ? "open" : ""}`}>
                <div
                  className="sidebar-link sidebar-title"
                  onClick={() => toggleMenu("role")}
                >
                  <i className="fa fa-user"></i>
                  <span className="ms-2">Vai trò</span>
                  <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
                </div>

                <ul className="sidebar-submenu">
                  <li><Link to="/dashboard/role">Danh sách vai trò</Link></li>
                  <li><Link to="/dashboard/role/create">Thêm vai trò</Link></li>
                </ul>
              </li>

              <li className={`sidebar-list ${openMenu === "teachers" ? "open" : ""}`}>
                <div
                  className="sidebar-link sidebar-title"
                  onClick={() => toggleMenu("teachers")}
                >
                  <i className="fa fa-user"></i>
                  <span className="ms-2">Giáo viên</span>
                  <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
                </div>

                <ul className="sidebar-submenu">
                  <li><Link to="/dashboard/teacher">Danh sách giáo viên</Link></li>
                  <li><Link to="/dashboard/teacher/create">Thêm phân công giáo viên</Link></li>
                </ul>
              </li>
            </>
          )}

          {/* QUẢN LÝ TRUYỆN */}
          <li className="sidebar-main-title">
            <h6>Quản lý truyện</h6>
          </li>

          <li className={`sidebar-list ${openMenu === "exam" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("exam")}
            >
              <i className="fa-solid fa-book"></i>
              <span className="ms-2">Quản lý đề thi</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/exam">Danh sách đề thi</Link></li>
              <li><Link to="/dashboard/exam/create">Thêm đề thi</Link></li>
            </ul>
          </li>

          <li className={`sidebar-list ${openMenu === "question" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("question")}
            >
              <i className="fa-solid fa-book"></i>
              <span className="ms-2">Quản lý câu hỏi</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/question">Danh sách câu hỏi</Link></li>
              <li><Link to="/dashboard/question/create">Thêm câu hỏi</Link></li>
            </ul>
          </li>

          <li className="sidebar-list">
            <div
              className="sidebar-link sidebar-title"
            >
              <i className="fa-solid fa-chart-simple"></i>
              <span className="ms-2"><Link to="/dashboard/questionfollowing">Thống kê</Link></span>
            </div>
          </li>

          <li className={`sidebar-list ${openMenu === "grade" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("grade")}
            >
              <i className="fa fa-list"></i>
              <span className="ms-2">Quản lý lớp</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/grade">Danh sách lớp</Link></li>
              <li><Link to="/dashboard/grade/create">Thêm lớp</Link></li>
            </ul>
          </li>

          <li className={`sidebar-list ${openMenu === "subject" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("subject")}
            >
              <i className="fa fa-book"></i>
              <span className="ms-2">Quản lý môn học</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/subject">Danh sách môn học</Link></li>
              <li><Link to="/dashboard/subject/create">Thêm môn học</Link></li>
            </ul>
          </li>

          <li className="sidebar-main-title">
            <h6>Cài đặt</h6>
          </li>

          {/* <li className="sidebar-list">
            <Link className="sidebar-link sidebar-title" to="/settings/system">
              <i className="fa fa-cog"></i>
              <span className="ms-2">Cấu hình hệ thống</span>
            </Link>
          </li> */}

          <li className="sidebar-list">
            <Link className="sidebar-link sidebar-title" to="/dashboard/profile">
              <i className="fa fa-id-card"></i>
              <span className="ms-2">Thông tin tài khoản</span>
            </Link>
          </li>

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;