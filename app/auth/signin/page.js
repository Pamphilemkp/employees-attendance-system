/* eslint-disable */
'use client';

import { useState } from 'react';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when sign-in starts

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        setError('Invalid email or password');
        setLoading(false); // Stop loading on error
        return;
      }

      const currentSession = await getSession();

      if (currentSession?.user?.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/attendance');
      }
    } catch (error) {
      console.error('SignIn error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false); // Stop loading after sign-in attempt
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Sign In</h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="absolute inset-y-0 right-0 flex items-center pr-3">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="ml-2 text-sm text-gray-600">Show</span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner" />
              {' '}
              {/* Updated spinner */}
            </div>
          ) : (
            <button
              type="submit"
              className="w-full p-3 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </button>
          )}
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?
          {' '}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>

      {/* Styles for the spinner */}
      <style jsx>
        {`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}
      </style>
    </div>
  );
}
