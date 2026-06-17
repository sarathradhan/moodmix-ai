/**
 * Auth guard for routes that require a logged-in user.
 * While authLoading: shows spinner. If no user: redirect to /login (saves intended path).
 * Otherwise renders children (the protected page).
 */
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { ROUTES } from '../../utils/constants.js';

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAppContext();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
