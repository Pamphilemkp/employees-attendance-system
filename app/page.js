'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('User is authenticated:', session.user);
    }
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center"
        >
          <svg
            className="w-16 h-16 text-blue-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100">
      <Toaster />
      <header className="w-full p-4 text-center text-white bg-blue-700">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <Image
            src="/logo.png"
            alt="Ataner Logo"
            className="w-24 h-auto mx-auto bg-white"
            width={1000}
            height={1000}
          />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-2 text-3xl font-bold"
        >
          Welcome to Ataner
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-1 text-lg"
        >
          Your one-stop solution for attendance management
        </motion.p>
      </header>

      <main className="flex flex-col items-center px-4 mt-10">
        {session ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="mb-4 text-xl font-semibold">Hello, {session.user.name}!</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="w-full max-w-xs p-3 mb-4 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600"
            >
              Sign Out
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="mb-4 text-xl font-semibold">Employee Portal</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signIn()}
              className="w-full max-w-xs p-3 mb-4 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
            >
              Sign In
            </motion.button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center w-full gap-4 px-4"
        >
          <Link href="/attendance">
            <p className="w-full max-w-xs p-3 text-center text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600">
              Mark Attendance
            </p>
          </Link>

          {/* New Button to Navigate to QR Scanner Page */}
          <Link href="/scan-qr">
            <p className="w-full max-w-xs p-3 text-center text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600">
              Scan QR Code
            </p>
          </Link>
        </motion.div>
      </main>

      <footer className="w-full p-4 text-center text-white bg-gray-800">
        <p>© 2024 Ataner. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
