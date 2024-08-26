/* eslint-disable react-hooks/rules-of-hooks */
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/mongoose';
import Attendance from '@/models/Attendance';
import { useState } from 'react';

export default async function AdminPage() {
  const session = await getSession();

  if (!session || session.user.role !== 'admin') {
    return <p>Access Denied</p>;
  }

  await dbConnect();
  const attendances = await Attendance.find({});

  const [editing, setEditing] = useState(null);
  const [editedCheckIn, setEditedCheckIn] = useState('');
  const [editedCheckOut, setEditedCheckOut] = useState('');

  const handleEdit = (attendance) => {
    setEditing(attendance._id);
    setEditedCheckIn(new Date(attendance.checkIn).toISOString().slice(0, 16));
    setEditedCheckOut(attendance.checkOut ? new Date(attendance.checkOut).toISOString().slice(0, 16) : '');
  };

  const handleSave = async (id) => {
    const response = await fetch('/api/attendance/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, checkIn: new Date(editedCheckIn), checkOut: editedCheckOut ? new Date(editedCheckOut) : null }),
    });

    const data = await response.json();
    if (data.success) {
      setEditing(null);
      alert('Attendance updated successfully!');
      window.location.reload();
    } else {
      alert('Error updating attendance.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Employee ID</th>
            <th className="py-2">Check-In</th>
            <th className="py-2">Check-Out</th>
            <th className="py-2">Time Worked</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance) => (
            <tr key={attendance._id}>
              <td className="border px-4 py-2">{attendance.employeeId}</td>
              <td className="border px-4 py-2">
                {editing === attendance._id ? (
                  <input
                    type="datetime-local"
                    value={editedCheckIn}
                    onChange={(e) => setEditedCheckIn(e.target.value)}
                    className="p-2 border rounded"
                  />
                ) : (
                  new Date(attendance.checkIn).toLocaleString()
                )}
              </td>
              <td className="border px-4 py-2">
                {editing === attendance._id ? (
                  <input
                    type="datetime-local"
                    value={editedCheckOut}
                    onChange={(e) => setEditedCheckOut(e.target.value)}
                    className="p-2 border rounded"
                  />
                ) : attendance.checkOut ? (
                  new Date(attendance.checkOut).toLocaleString()
                ) : (
                  'N/A'
                )}
              </td>
              <td className="border px-4 py-2">
                {attendance.checkOut
                  ? new Date(attendance.checkOut - attendance.checkIn)
                      .toISOString()
                      .substr(11, 8)
                  : 'N/A'}
              </td>
              <td className="border px-4 py-2">
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
  );
}
