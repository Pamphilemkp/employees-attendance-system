import React, { useState } from 'react';

export default function AttendanceForm({ attendance, onCancel, onSave }) {
  const [editedCheckIn, setEditedCheckIn] = useState(attendance.checkIn ? new Date(attendance.checkIn).toISOString().slice(0, 16) : '');
  const [editedCheckOut, setEditedCheckOut] = useState(attendance.checkOut ? new Date(attendance.checkOut).toISOString().slice(0, 16) : '');
  const [editedShortBreakIn, setEditedShortBreakIn] = useState(attendance.shortBreakIn ? new Date(attendance.shortBreakIn).toISOString().slice(0, 16) : '');
  const [editedShortBreakOut, setEditedShortBreakOut] = useState(attendance.shortBreakOut ? new Date(attendance.shortBreakOut).toISOString().slice(0, 16) : '');

  const handleSave = () => {
    // Construct the updated attendance object
    const updatedAttendance = {
      ...attendance,
      checkIn: new Date(editedCheckIn),
      checkOut: editedCheckOut ? new Date(editedCheckOut) : null,
      shortBreakIn: editedShortBreakIn ? new Date(editedShortBreakIn) : null,
      shortBreakOut: editedShortBreakOut ? new Date(editedShortBreakOut) : null,
    };

    // Call the onSave function passed from parent
    onSave(updatedAttendance);
  };

  return (
    <div className="p-4 space-y-4 rounded-md shadow-lg bg-gray-50">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-700">Check-In:</label>
        <input
          type="datetime-local"
          value={editedCheckIn}
          onChange={(e) => setEditedCheckIn(e.target.value)}
          className="p-2 border rounded-md"
        />

        <label className="text-gray-700">Check-Out:</label>
        <input
          type="datetime-local"
          value={editedCheckOut}
          onChange={(e) => setEditedCheckOut(e.target.value)}
          className="p-2 border rounded-md"
        />

        <label className="text-gray-700">Short Break In:</label>
        <input
          type="datetime-local"
          value={editedShortBreakIn}
          onChange={(e) => setEditedShortBreakIn(e.target.value)}
          className="p-2 border rounded-md"
        />

        <label className="text-gray-700">Short Break Out:</label>
        <input
          type="datetime-local"
          value={editedShortBreakOut}
          onChange={(e) => setEditedShortBreakOut(e.target.value)}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="flex justify-end mt-4 space-x-4">
        <button onClick={handleSave} className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600">
          Save
        </button>
        <button onClick={onCancel} className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
