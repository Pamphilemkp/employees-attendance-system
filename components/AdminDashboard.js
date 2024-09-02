'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [users, setUsers] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'employee',
    password: '',
  });
  const [editedCheckIn, setEditedCheckIn] = useState('');
  const [editedCheckOut, setEditedCheckOut] = useState('');
  const [month, setMonth] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchUsers();
    fetchFilteredAttendances(); // Call the fetch function when the component mounts
  }, []);

  useEffect(() => {
    fetchFilteredAttendances(); // Re-fetch attendances when filters change
  }, [month, selectedUser, sortOrder]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users.');
    }
  };

  const fetchFilteredAttendances = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (month) {
        const formattedMonth = month.toISOString().slice(0, 7); // format as YYYY-MM
        queryParams.append('month', formattedMonth);
      }
      if (selectedUser) {
        queryParams.append('employeeId', selectedUser);
      }

      const res = await fetch(`/api/admin/attendances?${queryParams.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setFilteredAttendances(data);
      } else {
        toast.error('Failed to load filtered attendance records.');
      }
    } catch (error) {
      console.error('Error fetching filtered attendances:', error);
      toast.error('Failed to load attendance records.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  const handleCreateUser = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (res.ok) {
        toast.success('User created successfully!');
        setUserForm({ name: '', email: '', employeeId: '', role: 'employee', password: '' });
        fetchUsers(); // Refresh users list
      } else {
        const { message } = await res.json();
        toast.error(message || 'Failed to create user.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user.');
    }
  };

  const handleUpdateUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (res.ok) {
        toast.success('User updated successfully!');
        setEditingUser(null);
        setUserForm({ name: '', email: '', employeeId: '', role: 'employee', password: '' });
        fetchUsers(); // Refresh users list
      } else {
        const { message } = await res.json();
        toast.error(message || 'Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('User deleted successfully!');
        fetchUsers(); // Refresh users list
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
      password: '', // Leave empty for no change
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setUserForm({ name: '', email: '', employeeId: '', role: 'employee', password: '' });
  };

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

  const calculateHoursWorked = (checkIn, checkOut) => {
    if (!checkOut) return 'N/A';
    const diff = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours} hrs ${minutes} mins`;
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance._id);
    setEditedCheckIn(new Date(attendance.checkIn).toISOString().slice(0, 16));
    setEditedCheckOut(attendance.checkOut ? new Date(attendance.checkOut).toISOString().slice(0, 16) : '');
  };

  const handleSaveAttendance = async (id) => {
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
        setEditingAttendance(null);
        fetchFilteredAttendances(); // Refresh data
        toast.success('Attendance updated successfully!');
      } else {
        toast.error('Error updating attendance.');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Error updating attendance.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100"
    >
      <Toaster />
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 text-center text-white bg-blue-700"
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`p-2 ${activeTab === 'attendance' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} rounded`}
          >
            Manage Attendance
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`p-2 ${activeTab === 'users' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} rounded`}
          >
            Manage Users
          </button>
        </div>
      </motion.header>

      <motion.main
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        {activeTab === 'attendance' && (
          <section>
            <h2 className="text-2xl font-semibold">Manage Attendance</h2>
            <div className="flex flex-col items-center justify-between mt-4 md:flex-row">
              <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                <DatePicker
                  selected={month}
                  onChange={(date) => setMonth(date)}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="p-2 border rounded"
                />
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user._id} value={user.employeeId}>{user.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-white bg-blue-500 rounded"
                >
                  Sort by Name ({sortOrder === 'asc' ? 'A-Z' : 'Z-A'})
                </button>
              </div>
              <button
                onClick={handlePrint}
                className="p-2 text-white bg-green-500 rounded"
              >
                Print Current Month
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Check-In</th>
                    <th className="px-4 py-3">Check-Out</th>
                    <th className="px-4 py-3">Hours Worked</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendances.length > 0 ? (
                    filteredAttendances.map((attendance) => (
                      <tr key={attendance._id}>
                        <td className="px-4 py-3">{attendance.employeeId}</td>
                        <td className="px-4 py-3">
                          {editingAttendance === attendance._id ? (
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
                        <td className="px-4 py-3">
                          {editingAttendance === attendance._id ? (
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
                        <td className="px-4 py-3">
                          {calculateHoursWorked(attendance.checkIn, attendance.checkOut)}
                        </td>
                        <td className="px-4 py-3">
                          {editingAttendance === attendance._id ? (
                            <>
                              <button
                                onClick={() => handleSaveAttendance(attendance._id)}
                                className="p-2 mr-2 text-white bg-green-500 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingAttendance(null)}
                                className="p-2 text-white bg-gray-500 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditAttendance(attendance)}
                              className="p-2 text-white bg-blue-500 rounded"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-3 text-center">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'users' && (
          <section>
            <h2 className="text-2xl font-semibold">Manage Users</h2>
            <div className="my-4">
              <input
                type="text"
                name="name"
                value={userForm.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="p-2 mr-2 border rounded"
              />
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="p-2 mr-2 border rounded"
              />
              <input
                type="text"
                name="employeeId"
                value={userForm.employeeId}
                onChange={handleInputChange}
                placeholder="Employee ID"
                className="p-2 mr-2 border rounded"
              />
              <select
                name="role"
                value={userForm.role}
                onChange={handleInputChange}
                className="p-2 mr-2 border rounded"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="p-2 mr-2 border rounded"
              />
              <button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                className="p-2 text-white bg-green-500 rounded"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              {editingUser && (
                <button
                  onClick={handleCancelEdit}
                  className="p-2 ml-2 text-white bg-gray-500 rounded"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.employeeId}</td>
                        <td className="px-4 py-3">{user.role}</td>
                        <td className="flex items-center px-4 py-3">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 mr-2 text-white bg-blue-500 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-white bg-red-500 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-3 text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </motion.main>
    </motion.div>
  );
}
