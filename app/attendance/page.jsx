'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react'; // Import session for authentication

export default function EmployeeDashboard() {
  const { data: session, status } = useSession(); // Manage session and login state
  const [attendances, setAttendances] = useState([]);
  const [month, setMonth] = useState(new Date());
  const [employeeIdInput, setEmployeeIdInput] = useState(''); // Input state for employee ID

  // Format the month as a string (e.g., "September 2024")
  const formattedMonth = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Fetch attendances based on the current session user's employeeId and month
  const fetchAttendances = async () => {
    const employeeId = session?.user?.employeeId; // Make sure you have employeeId in session
    if (!employeeId) return; // Ensure the user is logged in and employeeId exists

    try {
      const formattedMonth = month.toISOString().slice(0, 7); // YYYY-MM format for backend
      const res = await fetch(`/api/attendance?month=${formattedMonth}&employeeId=${employeeId}`);
      const data = await res.json();

      if (res.ok) {
        setAttendances(Array.isArray(data) ? data : []); // Ensure data is always an array
      } else {
        toast.error('Failed to load attendance records.');
      }
    } catch (error) {
      toast.error('Failed to load attendance records.');
    }
  };

  // Fetch attendances whenever the month or session changes
  useEffect(() => {
    if (session?.user?.employeeId) {
      fetchAttendances();
    }
  }, [month, session]);

  // Handle Check-In functionality
  const handleCheckIn = async () => {
    const employeeId = session?.user?.employeeId || employeeIdInput; // Use session employeeId or input field
    if (!employeeId) {
      toast.error('Employee ID is required.');
      return;
    }

    try {
      const response = await fetch('/api/attendance/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId }), // Send employeeId
      });
      const data = await response.json();
      toast.success(data.message);
      fetchAttendances(); // Refresh attendance records after check-in
    } catch (error) {
      toast.error('Failed to check in.');
    }
  };

  // Handle Check-Out functionality
  const handleCheckOut = async () => {
    const employeeId = session?.user?.employeeId || employeeIdInput; // Use session employeeId or input field
    if (!employeeId) {
      toast.error('Employee ID is required.');
      return;
    }

    try {
      const response = await fetch('/api/attendance/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId }), // Send employeeId
      });
      const data = await response.json();
      toast.success(data.message);
      fetchAttendances(); // Refresh attendance records after check-out
    } catch (error) {
      toast.error('Failed to check out.');
    }
  };

  // If the user is not logged in, show a message to log in
  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
        <Toaster />
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Please Log In</h2>
          <p className="text-center text-gray-600">You must be logged in to view your attendance records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Toaster />
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Employee Attendance</h2>

        {/* Display employee ID from session */}
        <div className="mb-4 text-center">
          <p className="text-gray-600">Logged in as Employee ID: {session.user.employeeId}</p>
        </div>

        {/* Input for manual Employee ID if not logged in */}
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeIdInput}
          onChange={(e) => setEmployeeIdInput(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />

        {/* Check-In and Check-Out Buttons */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckIn}
          className="w-full p-3 mb-4 text-white bg-blue-600 rounded-lg"
        >
          Check In
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCheckOut}
          className="w-full p-3 text-white bg-red-600 rounded-lg"
        >
          Check Out
        </motion.button>

        {/* Attendance Records Table */}
        {attendances.length > 0 ? (
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">Attendance Records for {formattedMonth}</h3>

            {/* Scrollable Table */}
            <div className="overflow-x-auto max-h-64">
              <table className="min-w-full text-left bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="p-3 text-sm font-medium text-gray-700">Check-In</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Check-Out</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Hours Worked</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((attendance) => (
                    <tr key={attendance._id} className="border-b border-gray-200">
                      <td className="p-3">{new Date(attendance.checkIn).toLocaleString()}</td>
                      <td className="p-3">{attendance.checkOut ? new Date(attendance.checkOut).toLocaleString() : 'N/A'}</td>
                      <td className="p-3">
                        {attendance.duration ? `${attendance.duration.toFixed(2)} hours` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center text-gray-500">
            No attendance records found for {formattedMonth}.
          </div>
        )}
      </div>
    </div>
  );
}
