import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * ProtectedRoute component
 * - Redirects to /login if user is not authenticated.
 * - Redirects to the user's correct dashboard if they don't have the required role.
 *
 * @param {ReactNode} children - Child components to render
 * @param {string[]} roles - Optional array of allowed roles
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, isAuthenticated, getDashboardPath } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to the user's own dashboard (not home page)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
