import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('accessToken');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;