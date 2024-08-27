'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [attendances, setAttendances] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editedCheckIn, setEditedCheckIn] = useState('');
  const [editedCheckOut, setEditedCheckOut] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading

    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    const fetchAttendances = async () => {
      try {
        const response = await fetch('/api/attendance');
        if (!response.ok) throw new Error('Failed to fetch attendances');
        const data = await response.json();
        setAttendances(data);
      } catch (error) {
        console.error('Error fetching attendances:', error);
      }
    };

    fetchAttendances();
  }, [session, status, router]);

  const handleEdit = (attendance) => {
    setEditing(attendance._id);
    setEditedCheckIn(new Date(attendance.checkIn).toISOString().slice(0, 16));
    setEditedCheckOut(attendance.checkOut ? new Date(attendance.checkOut).toISOString().slice(0, 16) : '');
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
        alert('Attendance updated successfully!');
        // Refresh data without reloading the page
        const updatedResponse = await fetch('/api/attendance');
        const updatedData = await updatedResponse.json();
        setAttendances(updatedData);
      } else {
        alert('Error updating attendance.');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error updating attendance.');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>; // Show a loading state while checking session
  }

  if (!session || session.user.role !== 'admin') {
    return null; // Alternatively, show a loading spinner or a different message if needed
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
        <h1 className="text-3xl font-bold mt-2">Admin Dashboard</h1>
      </header>

      <main className="w-full flex flex-col items-center justify-center p-4">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b">Employee ID</th>
                <th className="py-3 px-4 border-b">Check-In</th>
                <th className="py-3 px-4 border-b">Check-Out</th>
                <th className="py-3 px-4 border-b">Time Worked</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((attendance) => (
                <tr key={attendance._id} className="border-b">
                  <td className="py-3 px-4 text-center">{attendance.employeeId}</td>
                  <td className="py-3 px-4 text-center">
                    {editing === attendance._id ? (
                      <input
                        type="datetime-local"
                        value={editedCheckIn}
                        onChange={(e) => setEditedCheckIn(e.target.value)}
                        className="p-2 border rounded w-full"
                      />
                    ) : (
                      new Date(attendance.checkIn).toLocaleString()
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {editing === attendance._id ? (
                      <input
                        type="datetime-local"
                        value={editedCheckOut}
                        onChange={(e) => setEditedCheckOut(e.target.value)}
                        className="p-2 border rounded w-full"
                      />
                    ) : attendance.checkOut ? (
                      new Date(attendance.checkOut).toLocaleString()
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {attendance.checkOut
                      ? new Date(attendance.checkOut - attendance.checkIn)
                          .toISOString()
                          .substr(11, 8)
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {editing === attendance._id ? (
                      <>
                        <button
                          onClick={() => handleSave(attendance._id)}
                          className="p-2 bg-green-500 text-white rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="p-2 bg-gray-500 text-white rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(attendance)}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="w-full p-4 bg-gray-800 text-white text-center mt-auto">
        <p>© 2024 Ataner. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
