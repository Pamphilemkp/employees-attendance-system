'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [editing, setEditing] = useState(null);
  const [editedCheckIn, setEditedCheckIn] = useState('');
  const [editedCheckOut, setEditedCheckOut] = useState('');

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await fetch('/api/attendance');
        if (!response.ok) {
          throw new Error('Failed to fetch attendance records.');
        }
        const data = await response.json();
        setAttendances(data);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching attendances:', error);
        toast.error('Failed to load attendance records.', {
          position: 'top-right',
        });
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchAttendances();
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  const handleEdit = (attendance) => {
    setEditing(attendance._id);
    setEditedCheckIn(new Date(attendance.checkIn).toISOString().slice(0, 16));
    setEditedCheckOut(
      attendance.checkOut ? new Date(attendance.checkOut).toISOString().slice(0, 16) : ''
    );
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch('/api/attendance/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          checkIn: new Date(editedCheckIn),
          checkOut: editedCheckOut ? new Date(editedCheckOut) : null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEditing(null);
        const updatedResponse = await fetch('/api/attendance');
        const updatedData = await updatedResponse.json();
        setAttendances(updatedData);
        toast.success('Attendance updated successfully!', {
          position: 'top-right',
        });
      } else {
        toast.error('Error updating attendance.', {
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance. Please try again.', {
        position: 'top-right',
      });
    }
  };

  if (loading) {
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
          <p className="mt-4 text-lg font-medium text-gray-700">Loading Admin Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <header className="p-4 text-center text-white bg-blue-700">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Admin Dashboard
        </motion.h1>
      </header>
      <main className="p-4">
        <div className="overflow-x-auto">
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm"
          >
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Check-In</th>
                <th className="px-4 py-3">Check-Out</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.length > 0 ? (
                attendances.map((attendance) => (
                  <tr key={attendance._id} className="border-t">
                    <td className="px-4 py-3 text-center">{attendance.employeeId}</td>
                    <td className="px-4 py-3 text-center">
                      {editing === attendance._id ? (
                        <input
                          type="datetime-local"
                          value={editedCheckIn}
                          onChange={(e) => setEditedCheckIn(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        formatDate(attendance.checkIn)
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editing === attendance._id ? (
                        <input
                          type="datetime-local"
                          value={editedCheckOut}
                          onChange={(e) => setEditedCheckOut(e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : attendance.checkOut ? (
                        formatDate(attendance.checkOut)
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {editing === attendance._id ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSave(attendance._id)}
                            className="p-2 mr-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditing(null)}
                            className="p-2 text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600"
                          >
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(attendance)}
                          className="p-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
                        >
                          Edit
                        </motion.button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </motion.table>
        </div>
      </main>
    </div>
  );
}
