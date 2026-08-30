import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../components/AppShell';
import "@/styles/globals.css";

const publicRoutes = ['/', '/login', '/register'];
const adminRoutes = ['/admin', '/admin/documents'];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const { loadUser, token } = useAuthStore();

  useEffect(() => {
    // Sync active session on initial page mount
    if (token) {
      loadUser();
    }
  }, [token, loadUser]);

  const isPublicRoute = publicRoutes.includes(router.pathname);
  const isAdminRoute = adminRoutes.some((route) => router.pathname.startsWith(route));

  // Determine wrapping component
  const content = <Component {...pageProps} />;

  if (isPublicRoute) {
    return content;
  }

  // Wrap protected pages inside ProtectedRoute and AppShell
  return (
    <ProtectedRoute allowedRoles={isAdminRoute ? ['admin'] : ['student', 'admin']}>
      <AppShell>{content}</AppShell>
    </ProtectedRoute>
  );
}
