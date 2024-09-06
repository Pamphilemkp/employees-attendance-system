import React, { useState, useEffect } from 'react';
import AttendanceForm from './AttendanceForm';
import { toast } from 'react-hot-toast';

export default function AttendanceTable({ attendances = [] }) {
  const [editingAttendanceId, setEditingAttendanceId] = useState(null); // Track the attendance being edited
  const [attendancesList, setAttendancesList] = useState([]); // Local state for attendance list

  useEffect(() => {
    // Log the initial attendance data for debugging
    console.log('Received attendances:', attendances);

    // Check if attendances is a valid array and update the state
    if (Array.isArray(attendances)) {
      setAttendancesList(attendances);
    } else {
      console.error('Invalid attendances data:', attendances);
    }
  }, [attendances]);

  // Handle the edit button click
  const handleEditClick = (attendanceId) => {
    setEditingAttendanceId(attendanceId);
  };

  // Handle save logic with toast notifications
  const handleSaveAttendance = async (updatedAttendance) => {
    try {
      const response = await fetch(`/api/admin/attendances/${updatedAttendance._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAttendance),
      });

      if (response.ok) {
        toast.success('Attendance updated successfully!');
        // Update the local list with the edited attendance
        setAttendancesList(
          attendancesList.map((item) => (item._id === updatedAttendance._id ? updatedAttendance : item))
        );
        setEditingAttendanceId(null); // Reset editing state
      } else {
        toast.error('Failed to update attendance');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Error updating attendance');
    }
  };

  // Handle cancel logic
  const handleCancelEdit = () => {
    setEditingAttendanceId(null); // Reset editing state
  };

  // Format date to "Month Day, Year" (e.g., "August 15, 2024")
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 mt-4 overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-200">
            <th className="px-4 py-3">Employee ID</th>
            <th className="px-4 py-3">Check-In</th>
            <th className="px-4 py-3">Check-Out</th>
            <th className="px-4 py-3">Short Break In</th>
            <th className="px-4 py-3">Short Break Out</th>
            <th className="px-4 py-3">Hours Worked</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(attendancesList) && attendancesList.length > 0 ? (
            attendancesList.map((attendance) => (
              <tr key={attendance._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="px-4 py-3">{attendance.employeeId || 'N/A'}</td>
                <td className="px-4 py-3">{formatDate(attendance.checkIn)}</td>
                <td className="px-4 py-3">{attendance.checkOut ? formatDate(attendance.checkOut) : 'N/A'}</td>
                <td className="px-4 py-3">{attendance.shortBreakIn ? formatDate(attendance.shortBreakIn) : 'N/A'}</td>
                <td className="px-4 py-3">{attendance.shortBreakOut ? formatDate(attendance.shortBreakOut) : 'N/A'}</td>
                <td className="px-4 py-3">{calculateHoursWorked(attendance)}</td>
                <td className="px-4 py-3 text-center">
                  {editingAttendanceId === attendance._id ? (
                    <>
                      <AttendanceForm
                        attendance={attendance}
                        onSave={handleSaveAttendance}
                        onCancel={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(attendance._id)}
                      className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
                No attendance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Calculate the total hours worked for each record
const calculateHoursWorked = (attendance) => {
  const totalWorkingTime = (new Date(attendance.checkOut) - new Date(attendance.checkIn)) / (1000 * 60 * 60);
  if (attendance.shortBreakIn && attendance.shortBreakOut) {
    const breakTime = (new Date(attendance.shortBreakOut) - new Date(attendance.shortBreakIn)) / (1000 * 60 * 60);
    return `${(totalWorkingTime - breakTime).toFixed(2)} hrs`;
  }
  return `${totalWorkingTime.toFixed(2)} hrs`;
};
