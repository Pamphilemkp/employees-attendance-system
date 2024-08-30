/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'employee',
    password: '',
  });

  const [attendances, setAttendances] = useState([]);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [editedCheckIn, setEditedCheckIn] = useState('');
  const [editedCheckOut, setEditedCheckOut] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month

  useEffect(() => {
    fetchUsers();
    fetchAttendances();
  }, [selectedMonth]);

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

  const fetchAttendances = async () => {
    try {
      const res = await fetch(`/api/admin/attendances?month=${selectedMonth}`);
      const data = await res.json();
      setAttendances(data);
    } catch (error) {
      console.error('Error fetching attendances:', error);
      toast.error('Failed to load attendance records.');
    }
  };

  const calculateHoursWorked = (checkIn, checkOut) => {
    if (!checkOut) return 'N/A';
    const diffMs = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
        fetchUsers();
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
        fetchUsers();
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
        fetchUsers();
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
      password: '',
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
        fetchAttendances();
        toast.success('Attendance updated successfully!');
      } else {
        toast.error('Error updating attendance.');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Error updating attendance.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <header className="p-4 text-center text-white bg-blue-700">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="mt-4">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`p-2 mx-2 ${activeTab === 'attendance' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} rounded`}
          >
            Manage Attendance
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`p-2 mx-2 ${activeTab === 'users' ? 'bg-white text-blue-700' : 'bg-blue-500 text-white'} rounded`}
          >
            Manage Users
          </button>
        </div>
      </header>

      <main className="p-4">
        {activeTab === 'attendance' && (
          <section>
            <h2 className="text-2xl font-semibold">Manage Attendance</h2>
            <div className="my-4">
              <label htmlFor="month-select" className="mr-2">Select Month:</label>
              <input
                type="month"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-3 text-left">Employee ID</th>
                    <th className="px-4 py-3 text-left">Check-In</th>
                    <th className="px-4 py-3 text-left">Check-Out</th>
                    <th className="px-4 py-3 text-left">Hours Worked</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.length > 0 ? (
                    attendances.map((attendance) => (
                      <tr key={attendance._id}>
                        <td className="px-4 py-3">{attendance.employeeId}</td>
                        <td className="px-4 py-3">
                          {editingAttendance === attendance._id ? (
                            <input
                              type="datetime-local"
                              value={editedCheckIn}
                              onChange={(e) => setEditedCheckIn(e.target.value)}
                              className="p-2 border rounded"
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
                              className="p-2 border rounded"
                            />
                          ) : (
                            attendance.checkOut ? formatDate(attendance.checkOut) : 'N/A'
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
                                className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingAttendance(null)}
                                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditAttendance(attendance)}
                              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
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
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Create User</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="employeeId"
                  value={userForm.employeeId}
                  onChange={handleInputChange}
                  placeholder="Employee ID"
                  className="p-2 border rounded"
                />
                <input
                  type="password"
                  name="password"
                  value={userForm.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="p-2 border rounded"
                />
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
              {editingUser && (
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 mt-4 ml-4 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="mt-8 overflow-x-auto">
              <h3 className="text-xl font-semibold">User List</h3>
              <table className="min-w-full mt-4 bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Employee ID</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Actions</th>
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
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
