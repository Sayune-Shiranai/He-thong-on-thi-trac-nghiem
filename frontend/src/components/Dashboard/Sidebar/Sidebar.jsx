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
            </>
          )}

          {/* QUẢN LÝ TRUYỆN */}
          <li className="sidebar-main-title">
            <h6>Quản lý truyện</h6>
          </li>

          <li className={`sidebar-list ${openMenu === "book" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("book")}
            >
              <i className="fa-solid fa-book"></i>
              <span className="ms-2">Quản lý truyện</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/book">Danh sách truyện</Link></li>
              <li><Link to="/dashboard/book/create">Thêm truyện</Link></li>
            </ul>
          </li>

          <li className="sidebar-list">
            <div
              className="sidebar-link sidebar-title"
            >
              <i className="fa-solid fa-chart-simple"></i>
              <span className="ms-2"><Link to="/dashboard/bookfollowing">Thống kê</Link></span>
            </div>
          </li>

          <li className={`sidebar-list ${openMenu === "category" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("category")}
            >
              <i className="fa fa-list"></i>
              <span className="ms-2">Quản lý thể loại</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/category">Danh sách thể loại</Link></li>
              <li><Link to="/dashboard/category/create">Thêm thể loại</Link></li>
            </ul>
          </li>

          <li className={`sidebar-list ${openMenu === "author" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("author")}
            >
              <i className="fa fa-user"></i>
              <span className="ms-2">Quản lý tác giả</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/author">Danh sách tác giả</Link></li>
              <li><Link to="/dashboard/author/create">Thêm tác giả</Link></li>
            </ul>
          </li>

          <li className={`sidebar-list ${openMenu === "artist" ? "open" : ""}`}>
            <div
              className="sidebar-link sidebar-title"
              onClick={() => toggleMenu("artist")}
            >
              <i className="fa-solid fa-palette"></i>
              <span className="ms-2">Quản lý họa sĩ</span>
              <i className="fa fa-angle-down ms-auto sidebar-icon"></i>
            </div>

            <ul className="sidebar-submenu">
              <li><Link to="/dashboard/artist">Danh sách họa sĩ</Link></li>
              <li><Link to="/dashboard/artist/create">Thêm họa sĩ</Link></li>
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