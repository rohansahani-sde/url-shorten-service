import React from 'react'
import { isAuthenticated } from "../../utils/auth";
import { Navigate } from 'react-router-dom';

const Protectedroute = ({children}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />; 
  }
  return <>{children}</>;
}

export default Protectedroute