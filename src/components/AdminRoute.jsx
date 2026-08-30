import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Blocks non-admins from create/edit form routes at the UI level
// (the API also enforces this server-side via the `authorize('admin')` middleware)
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/employees" replace />;
  return children;
};

export default AdminRoute;
