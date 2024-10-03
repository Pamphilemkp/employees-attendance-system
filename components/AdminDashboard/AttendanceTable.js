/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader'; // Import loader for smoother UX

export default function AttendanceTable({ attendances = [] }) {
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [attendancesList, setAttendancesList] = useState([]);
  const [loading, setLoading] = useState(false); // Global loader state for saving attendance
  const [deleteLoading, setDeleteLoading] = useState(false); // Loader for delete action
  const [deleteConfirm, setDeleteConfirm] = useState(null); // For delete confirmation

  useEffect(() => {
    if (Array.isArray(attendances)) {
      // Filter attendances to ensure only one record per employee per day
      const filteredAttendances = filterDailyAttendances(attendances);
      setAttendancesList(filteredAttendances);
    } else {
      console.error('Invalid attendances data:', attendances);
    }
  }, [attendances]);

  // Filter function to remove multiple records for the same employee on the same day
  const filterDailyAttendances = (attendanceData) => {
    const uniqueAttendances = {};
    return attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.checkIn).toLocaleDateString();
      const key = `${attendance.employeeId}-${attendanceDate}`;
      if (!uniqueAttendances[key]) {
        uniqueAttendances[key] = true;
        return true; // Include this record
      }
      return false; // Exclude duplicate record for the same day
    });
  };

  const handleEditClick = (attendanceId) => {
    setEditingAttendanceId(attendanceId);
  };

  const handleSaveAttendance = async (updatedAttendance) => {
    setLoading(true); // Show loader
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
        setAttendancesList(
          attendancesList.map((item) => (item._id === updatedAttendance._id ? updatedAttendance : item)),
        );
        setEditingAttendanceId(null);
      } else {
        toast.error('Failed to update attendance');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Error updating attendance');
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleDeleteClick = (attendanceId) => {
    setDeleteConfirm(attendanceId); // Show delete confirmation
  };

  const confirmDeleteAttendance = async (attendanceId) => {
    setDeleteLoading(true); // Show loader while deleting
    try {
      const response = await fetch(`/api/admin/attendances/${attendanceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Attendance deleted successfully!');
        setAttendancesList(attendancesList.filter((item) => item._id !== attendanceId)); // Remove deleted record
      } else {
        toast.error('Failed to delete attendance');
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast.error('Error deleting attendance');
    } finally {
      setDeleteConfirm(null); // Hide delete confirmation
      setDeleteLoading(false); // Hide loader after delete
    }
  };

  const handleCancelEdit = () => {
    setEditingAttendanceId(null);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 mt-4 overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-200">
            <th className="py-3 pl-4 text-left">Employee ID</th>
            <th className="py-3 pl-4 text-left">Check-In</th>
            <th className="py-3 pl-4 text-left">Check-Out</th>
            <th className="py-3 pl-4 text-left">Short Break In</th>
            <th className="py-3 pl-4 text-left">Short Break Out</th>
            <th className="py-3 pl-4 text-left">Hours Worked</th>
            <th className="py-3 pl-4 text-left">Actions</th>
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
                    <AttendanceForm
                      attendance={attendance}
                      onSave={handleSaveAttendance}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(attendance._id)}
                        className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(attendance._id)}
                        className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
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

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <p className="mb-4 text-lg">Are you sure you want to delete this record?</p>
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => confirmDeleteAttendance(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-600 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-white bg-gray-400 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && ( // Show global loader when saving attendance
        <div className="loader-backdrop">
          <div className="spinner" />
        </div>
      )}

      {deleteLoading && ( // Loader for delete process
        <div className="loader-backdrop">
          <div className="spinner" />
        </div>
      )}

      <style jsx>{`
        .spinner {
          width: 25px;
          height: 25px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loader-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
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
