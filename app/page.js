'use client'; // Ensure this component is treated as a client component

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="w-full p-4 bg-blue-700 text-white text-center">
        <h1 className="text-4xl font-bold">Welcome to Ataner</h1>
        <p className="text-lg mt-2">Your one-stop solution for attendance management</p>
      </header>

      <main className="flex flex-col items-center mt-10">
        {session ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Hello, {session.user.name}!</h2>
            <button
              onClick={() => signOut()}
              className="p-3 bg-red-500 text-white rounded-lg mb-4"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Employee Portal</h2>
            <button
              onClick={() => signIn()}
              className="p-3 bg-blue-500 text-white rounded-lg mb-4"
            >
              Sign In
            </button>
          </div>
        )}

        <div className="flex space-x-4">
          <Link href="/attendance">
            <a className="p-3 bg-green-500 text-white rounded-lg">
              Mark Attendance
            </a>
          </Link>
          <Link href="/attendance/checkin">
            <a className="p-3 bg-blue-500 text-white rounded-lg">
              Check In
            </a>
          </Link>
          <Link href="/attendance/checkout">
            <a className="p-3 bg-orange-500 text-white rounded-lg">
              Check Out
            </a>
          </Link>
        </div>
      </main>

      <footer className="w-full p-4 bg-gray-800 text-white text-center mt-auto">
        <p>© 2024 Ataner. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
