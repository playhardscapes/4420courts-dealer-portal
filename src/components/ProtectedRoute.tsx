'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { SidebarNavigation } from './layout/SidebarNavigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to login page without authentication
    if (pathname === '/login') {
      return;
    }

    // Redirect to login if not authenticated and not loading
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access to login page without sidebar
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Require authentication for all other pages
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Render authenticated pages with sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarNavigation />
      <main className="lg:pl-72">
        {children}
      </main>
    </div>
  );
}