'use client'; // Ensure this component is treated as a client component

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-between">
      <header className="w-full p-4 bg-blue-700 text-white text-center">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Ataner Logo"
            className="w-24 h-auto mx-auto bg-white"
            width={1000}
            height={1000}
          />
        </div>
        <h1 className="text-3xl font-bold mt-2">Welcome to Ataner</h1>
        <p className="text-lg mt-1">Your one-stop solution for attendance management</p>
      </header>

      <main className="flex flex-col items-center mt-10 px-4">
        {session ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Hello, {session.user.name}!</h2>
            <button
              onClick={() => signOut()}
              className="p-3 bg-red-500 text-white rounded-lg mb-4 w-full max-w-xs"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Employee Portal</h2>
            <button
              onClick={() => signIn()}
              className="p-3 bg-blue-500 text-white rounded-lg mb-4 w-full max-w-xs"
            >
              Sign In
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center w-full px-4">
          <Link href="/attendance">
            <p className="p-3 bg-green-500 text-white rounded-lg w-full max-w-xs text-center">
              Mark Attendance
            </p>
          </Link>
        </div>
      </main>

      <footer className="w-full p-4 bg-gray-800 text-white text-center">
        <p>© 2024 Ataner. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
