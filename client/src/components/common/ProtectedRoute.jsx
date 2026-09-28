import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner text="Verifying official department session..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated visitors to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
