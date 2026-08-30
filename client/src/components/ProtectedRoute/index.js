import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { isAuthenticated, user, loading, loadUser, token } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // If we have a token but no user object, fetch user profile
      if (token && !user) {
        await loadUser();
      }
      setChecking(false);
    };

    verifyAuth();
  }, [token, user, loadUser]);

  useEffect(() => {
    // Once checking is done, enforce routing policies
    if (!checking) {
      if (!token) {
        router.replace('/login');
      } else if (user) {
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          // User is authenticated but doesn't have the required role
          if (user.role === 'admin') {
            router.replace('/admin');
          } else {
            router.replace('/dashboard');
          }
        }
      }
    }
  }, [checking, token, user, allowedRoles, router]);

  // Show a premium glassmorphic loading screen while checking authentication status
  if (checking || loading || (!user && token)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="relative flex items-center justify-center">
          {/* Animated gradient ring */}
          <div className="absolute w-20 h-20 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin"></div>
          {/* Static core */}
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
            <span className="text-indigo-400 font-bold text-sm">CR</span>
          </div>
        </div>
        <p className="mt-6 text-slate-400 text-sm tracking-wider uppercase animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  // If authenticated and has the correct role, render child components
  if (token && user && (allowedRoles.length === 0 || allowedRoles.includes(user.role))) {
    return <>{children}</>;
  }

  // Fallback blank screen during transitions/redirects
  return <div className="min-h-screen bg-slate-950"></div>;
}
