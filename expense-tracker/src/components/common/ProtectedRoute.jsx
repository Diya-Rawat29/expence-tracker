import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleRank = { admin: 3, manager: 2, employee: 1 };

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/" replace />;
  if (requiredRole && (roleRank[currentUser.role] || 0) < (roleRank[requiredRole] || 0)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
