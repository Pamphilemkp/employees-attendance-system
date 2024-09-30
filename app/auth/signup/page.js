/* eslint-disable */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name, email, password, employeeId,
    } = form;

    if (!name || !email || !password || !employeeId) {
      setError('All fields are necessary.');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          employeeId,
        }),
      });

      if (res.ok) {
        setForm({
          name: '',
          email: '',
          password: '',
          employeeId: '',
        });
        router.push('/auth/signin?success=Account has been created');
      } else {
        const data = await res.json();
        setError(data.message || 'User registration failed.');
      }
    } catch (error) {
      console.log('Error during registration: ', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Toaster />
      <motion.div
        className="flex items-center justify-center min-h-screen p-6 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">Sign Up</h2>
          {error && (
            <div className="px-3 py-1 mb-4 text-sm text-white bg-red-500 rounded-md w-fit">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID</label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                placeholder="Employee ID"
                value={form.employeeId}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full p-3 text-white transition duration-300 bg-blue-600 rounded-md shadow-md hover:bg-blue-700"
            >
              Sign Up
            </motion.button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?
            {' '}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </>
  );
}
