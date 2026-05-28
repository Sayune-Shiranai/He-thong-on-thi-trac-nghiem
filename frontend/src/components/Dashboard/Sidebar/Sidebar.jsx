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

      <div
        className="toggle-sidebar"
        onClick={() => setCollapsed(!collapsed)}
      >
        Toggle
      </div>

      <nav className="sidebar-main">
        <ul className="sidebar-links">

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
                </div>

                <ul className="sidebar-submenu">
                  <li>
                    <Link to="/dashboard/user">
                      Danh sách người dùng
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          )}

        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;