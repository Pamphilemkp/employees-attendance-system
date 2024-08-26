// app/attendance/page.js
'use client';

import { useState } from 'react';

export default function AttendancePage() {
  const [employeeId, setEmployeeId] = useState('');

  const handleCheckIn = async () => {
    const response = await fetch('/api/attendance/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeId }),
    });

    const data = await response.json();
    alert(data.message);
  };

  const handleCheckOut = async () => {
    const response = await fetch('/api/attendance/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employeeId }),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <input
        type="text"
        placeholder="Enter Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        className="p-2 border rounded mb-4"
      />
      <button onClick={handleCheckIn} className="p-2 bg-blue-500 text-white rounded mb-2">
        Check In
      </button>
      <button onClick={handleCheckOut} className="p-2 bg-red-500 text-white rounded">
        Check Out
      </button>
    </div>
  );
}
