import React from 'react';
import {NavLink} from 'react-router-dom';
import './Sidebar.css';

const items=[
  {label:'Tổng quan',         path:'/admin',           end:true,  icon:'⊞'},
  {label:'Đề thi',            path:'/admin/exams',     end:false, icon:'📋'},
  {label:'Câu hỏi',           path:'/admin/questions', end:false, icon:'❓'},
  {label:'Môn học & Khối',    path:'/admin/subjects',  end:false, icon:'📚'},
  {label:'Người dùng',        path:'/admin/users',     end:false, icon:'👥'},
  {label:'Kết quả',           path:'/admin/results',   end:false, icon:'📊'},
];

export default function Sidebar(){
  return(
    <aside className="sidebar">
      <div className="sidebar-header"><span className="sidebar-title">Bảng quản trị</span></div>
      <nav className="sidebar-nav">
        {items.map(i=>(
          <NavLink key={i.path} to={i.path} end={i.end}
            className={({isActive})=>`sidebar-link ${isActive?'active':''}`}>
            <span className="sidebar-icon">{i.icon}</span>
            <span className="sidebar-label">{i.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <NavLink to="/dashboard" className="sidebar-link back-link">
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-label">Giao diện học viên</span>
        </NavLink>
      </div>
    </aside>
  );
}
