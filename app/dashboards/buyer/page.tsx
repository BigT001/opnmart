'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Fallback/redirect page for /dashboards/buyer
 * This page redirects to home since the actual dashboard is at /dashboards/buyer/[buyerId]
 * Users should never access this route directly - they're redirected here if they try
 */
export default function BuyerDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // This page should not be accessed directly
    // Redirect to home if someone tries to access /dashboards/buyer without an ID
    router.push('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
