import React, { useState } from 'react'
import { Outlet } from "react-router-dom";
import Header from '../../components/Dashboard/Header/Header';
import Sidebar from '../../components/Dashboard/Sidebar/Sidebar'
import Footer from '../../components/Dashboard/Footer/Footer';
import './AdminLayout.css'
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-wrapper">
      <div className={`page-wrapper compact-wrapper ${collapsed ? "collapsed" : ""}`} id="pageWrapper">
        
        {/* Header */}
        <Header collapsed={collapsed} />

        {/* Body */}
        <div className="page-body-wrapper">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <div className="page-body">
            <Outlet />
          </div>

          <Footer />
        </div>
      </div>
    </div>  
  );
}

export default DashboardLayout
