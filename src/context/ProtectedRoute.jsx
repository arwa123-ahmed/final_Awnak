import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './userContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // يمكن وضع Spinner هنا
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}