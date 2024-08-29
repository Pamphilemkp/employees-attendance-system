"use client"
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('User is authenticated:', session.user);
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100">
      <header className="w-full p-4 text-center text-white bg-blue-700">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Ataner Logo"
            className="w-24 h-auto mx-auto bg-white"
            width={1000}
            height={1000}
          />
        </div>
        <h1 className="mt-2 text-3xl font-bold">Welcome to Ataner</h1>
        <p className="mt-1 text-lg">Your one-stop solution for attendance management</p>
      </header>

      <main className="flex flex-col items-center px-4 mt-10">
        {session ? (
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold">Hello, {session.user.name}!</h2>
            <button
              onClick={() => signOut()}
              className="w-full max-w-xs p-3 mb-4 text-white bg-red-500 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold">Employee Portal</h2>
            <button
              onClick={() => signIn()}
              className="w-full max-w-xs p-3 mb-4 text-white bg-blue-500 rounded-lg"
            >
              Sign In
            </button>
          </div>
        )}

        <div className="flex flex-wrap justify-center w-full gap-4 px-4">
          <Link href="/attendance">
            <p className="w-full max-w-xs p-3 text-center text-white bg-green-500 rounded-lg">
              Mark Attendance
            </p>
          </Link>
        </div>
      </main>

      <footer className="w-full p-4 text-center text-white bg-gray-800">
        <p>© 2024 Ataner. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
