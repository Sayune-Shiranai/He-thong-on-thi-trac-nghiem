import React from 'react';
import {Navigate,useLocation} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
export default function ProtectedRoute({children,adminOnly=false}){
  const {user,loading,canAccessAdmin}=useAuth();
  const location=useLocation();
  if(loading)return <div className="loading-screen" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if(!user)return <Navigate to="/login" state={{from:location}} replace/>;
  // adminOnly: Admin và Moderator đều được vào
  if(adminOnly&&!canAccessAdmin)return <Navigate to="/" replace/>;
  return children;
}
