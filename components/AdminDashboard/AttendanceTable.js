import React, { useState, useEffect } from 'react';
import AttendanceForm from './AttendanceForm';
import { toast } from 'react-hot-toast';

export default function AttendanceTable({ attendances = [] }) {
  const [editingAttendanceId, setEditingAttendanceId] = useState(null);
  const [attendancesList, setAttendancesList] = useState([]);
  const [loading, setLoading] = useState(false); // Global loader state
  const [loadingQR, setLoadingQR] = useState(false); // Loader state for QR generation

  useEffect(() => {
    console.log('Received attendances:', attendances);

    if (Array.isArray(attendances)) {
      setAttendancesList(attendances);
    } else {
      console.error('Invalid attendances data:', attendances);
    }
  }, [attendances]);

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
          attendancesList.map((item) => (item._id === updatedAttendance._id ? updatedAttendance : item))
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

  const handleCancelEdit = () => {
    setEditingAttendanceId(null);
  };

  const handleGenerateQRCode = async (employeeId) => {
    setLoadingQR(true); // Show QR loader
    try {
      const res = await fetch(`/api/admin/generate-qr?employeeId=${employeeId}`);
      const data = await res.json();

      if (data.success) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code for Employee ${employeeId}</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h2 { margin-bottom: 20px; }
              </style>
            </head>
            <body>
              <h2>QR Code for Employee ID: ${employeeId}</h2>
              <img src="${data.qrCode}" alt="QR Code" />
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        toast.error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoadingQR(false); // Hide QR loader
    }
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
                    <>
                      <AttendanceForm
                        attendance={attendance}
                        onSave={handleSaveAttendance}
                        onCancel={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(attendance._id)}
                        className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleGenerateQRCode(attendance.employeeId)}
                        className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600"
                      >
                        {loadingQR ? <div className="spinner"></div> : 'Generate QR'}
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

      {loading && ( // Show global loader when saving attendance
        <div className="loader-backdrop">
          <div className="spinner"></div>
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
