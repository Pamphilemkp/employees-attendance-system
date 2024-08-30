'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function AttendancePage() {
  const [employeeId, setEmployeeId] = useState('');

  const handleCheckIn = async () => {
    try {
      const response = await fetch('/api/attendance/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId }),
      });

      const data = await response.json();
      toast.success(data.message, {
        position: "top-right",
      });
    } catch (error) {
      toast.error('Failed to check in. Please try again.', {
        position: "top-right",
      });
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await fetch('/api/attendance/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId }),
      });

      const data = await response.json();
      toast.success(data.message, {
        position: "top-right",
      });
    } catch (error) {
      toast.error('Failed to check out. Please try again.', {
        position: "top-right",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Attendance</h2>
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckIn}
          className="w-full p-3 mb-4 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
        >
          Check In
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckOut}
          className="w-full p-3 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700"
        >
          Check Out
        </motion.button>
      </motion.div>
    </div>
  );
}
