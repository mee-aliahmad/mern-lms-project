import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * GuestRoute component
 * Only allows access to guests (unauthenticated users).
 * If a logged-in user visits a guest-only page (Home, About, Login, Register),
 * they are automatically redirected to their role-specific dashboard.
 */
const GuestRoute = ({ children }) => {
  const { user, loading, isAuthenticated, getDashboardPath } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Already logged in → redirect to their dashboard
  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default GuestRoute;
