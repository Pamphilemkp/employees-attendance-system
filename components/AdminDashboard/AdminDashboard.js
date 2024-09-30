/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import AttendanceManagement from './AttendanceManagement';
import UserManagement from './UserManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100"
    >
      <Toaster />
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 text-center text-white bg-blue-700"
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`p-2 ${activeTab === 'attendance' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} rounded`}
          >
            Manage Attendance
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`p-2 ${activeTab === 'users' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} rounded`}
          >
            Manage Users
          </button>
        </div>
      </motion.header>

      <motion.main
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        {activeTab === 'attendance' && <AttendanceManagement />}
        {activeTab === 'users' && <UserManagement />}
      </motion.main>
    </motion.div>
  );
}
