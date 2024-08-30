'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminDashboard from '../../components/AdminDashboard';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month

  useEffect(() => {
    console.log("Session data:", session); // Debugging: Log the session data
    if (status === 'loading') return; // Do nothing while loading

    if (!session) {
      console.log("No session found, redirecting to sign-in");
      router.push('/auth/signin'); // Redirect if no session
    } else if (session.user.role !== 'admin') {
      console.log("User is not an admin, redirecting to employee interface");
      router.push('/attendance'); // Redirect if not an admin
    }
  }, [session, status, router]);

  if (status === 'loading' || !session || session.user.role !== 'admin') {
    return <div>Loading...</div>; // Show a loading state or redirect
  }

  return (
    <AdminDashboard selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
  );
}
