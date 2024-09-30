/* eslint-disable */
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-hot-toast';
import AttendanceTable from './AttendanceTable';

export default function AttendanceManagement() {
  const [attendances, setAttendances] = useState([]); // Ensure initialized as an array
  const [users, setUsers] = useState([]);
  const [month, setMonth] = useState(new Date()); // Current date as default
  const [selectedUser, setSelectedUser] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch users and filtered attendance on component mount
  useEffect(() => {
    fetchUsers();
    fetchFilteredAttendances();
  }, []);

  // Fetch attendances when any filter changes
  useEffect(() => {
    fetchFilteredAttendances();
  }, [month, selectedUser, sortOrder]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users.'); // Minimal toast
      console.error('Error fetching users:', error);
    }
  };

  // Fetch filtered attendances
  const fetchFilteredAttendances = async () => {
    try {
      const queryParams = new URLSearchParams();
      const formattedMonth = month.toISOString().slice(0, 7); // YYYY-MM for query
      queryParams.append('month', formattedMonth);
      if (selectedUser) {
        queryParams.append('employeeId', selectedUser);
      }

      const res = await fetch(`/api/admin/attendances?${queryParams}`);
      const data = await res.json();

      if (res.ok) {
        setAttendances(data || []); // Ensure array
      } else {
        setAttendances([]); // Empty array on error
        toast.error('Failed to fetch attendance records.'); // Minimal toast
      }
    } catch (error) {
      setAttendances([]); // Set to empty array on error
      toast.error('Failed to load attendance records.'); // Minimal toast
      console.error('Error fetching attendance records:', error);
    }
  };

  // Format the month to a string like "September 2024"
  const formattedMonth = month.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Print functionality for the attendance table
  const handlePrint = () => {
    const printContent = `
      <h2>Attendance for ${formattedMonth}</h2>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Short Break In</th>
            <th>Short Break Out</th>
            <th>Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          ${attendances.map((att) => `
            <tr>
              <td>${att.employeeId || 'N/A'}</td>
              <td>${new Date(att.checkIn).toLocaleString()}</td>
              <td>${att.checkOut ? new Date(att.checkOut).toLocaleString() : 'N/A'}</td>
              <td>${att.shortBreakIn ? new Date(att.shortBreakIn).toLocaleString() : 'N/A'}</td>
              <td>${att.shortBreakOut ? new Date(att.shortBreakOut).toLocaleString() : 'N/A'}</td>
              <td>${calculateHoursWorked(att)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  const calculateHoursWorked = (attendance) => {
    const totalWorkingTime = (new Date(attendance.checkOut) - new Date(attendance.checkIn)) / (1000 * 60 * 60);
    if (attendance.shortBreakIn && attendance.shortBreakOut) {
      const breakTime = (new Date(attendance.shortBreakOut) - new Date(attendance.shortBreakIn)) / (1000 * 60 * 60);
      return `${(totalWorkingTime - breakTime).toFixed(2)} hrs`;
    }
    return `${totalWorkingTime.toFixed(2)} hrs`;
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold">Manage Attendance</h2>

      <div className="flex items-center mt-4 space-x-4">
        {/* Month Picker */}
        <DatePicker
          selected={month}
          onChange={setMonth}
          dateFormat="MMMM yyyy" // Show full month name and year
          showMonthYearPicker
          className="p-2 border rounded"
        />

        {/* User selection with both employee ID and name */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user.employeeId}>
              {`${user.employeeId} (${user.name})`}
            </option>
          ))}
        </select>

        {/* Sort by name */}
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 text-white bg-blue-500 rounded"
        >
          Sort by Name (
          {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
          )
        </button>

        {/* Print attendance */}
        <button
          onClick={handlePrint}
          className="p-2 text-white bg-green-500 rounded"
        >
          Print Attendance
        </button>
      </div>

      {/* Display current month in the UI */}
      <p className="mt-2">
        Showing attendance records for:
        {formattedMonth}
      </p>

      <AttendanceTable attendances={attendances} />
    </section>
  );
}
