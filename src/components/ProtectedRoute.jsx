import { useAuth } from '@/lib/AuthContext';
import { Navigate } from 'react-router-dom';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

export default function ProtectedRoute({ children, fallback = <DefaultFallback />, requireCompany = false }) {
  const { user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return fallback;
  }

  if (!isAuthenticated) {
    navigateToLogin();
    return null;
  }

  if (requireCompany && user?.role !== 'admin' && !user?.company) return <Navigate to="/" replace />;
  return children;
}