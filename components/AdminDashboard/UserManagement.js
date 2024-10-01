/* eslint-disable */
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'employee',
    password: '', // Password field added for user creation/update
  });
  const [loadingQR, setLoadingQR] = useState(false); // State for loading QR generation
  const [monthlyWorkingHours, setMonthlyWorkingHours] = useState({}); // State to store monthly working hours for each user

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();

      console.log('Fetched Users:', data); // Debugging: Log users data

      if (Array.isArray(data)) {
        setUsers(data);
        fetchMonthlyWorkingHours(data); // Fetch monthly working hours for all users
      } else {
        toast.error('Invalid user data format.');
        console.error('Expected an array of users, but got:', data);
      }
    } catch (error) {
      toast.error('Failed to load users.');
      console.error('Failed to load users:', error);
    }
  };

  // Fetch total working hours for each user for the current month
  const fetchMonthlyWorkingHours = async (users) => {
    const month = new Date().toISOString().slice(0, 7); // Format current month as "YYYY-MM"
    const workingHours = {};

    await Promise.all(
      users.map(async (user) => {
        try {
          const res = await fetch(`/api/admin/attendances?month=${month}&employeeId=${user.employeeId}`);
          const attendanceRecords = await res.json();

          if (Array.isArray(attendanceRecords)) {
            const totalHours = attendanceRecords.reduce((acc, record) => {
              if (record.checkIn && record.checkOut) {
                const checkInTime = new Date(record.checkIn);
                const checkOutTime = new Date(record.checkOut);
                const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Calculate hours worked
                return acc + hoursWorked;
              }
              return acc;
            }, 0);

            workingHours[user.employeeId] = totalHours.toFixed(2); // Store total hours, rounded to 2 decimal places
          }
        } catch (error) {
          console.error(`Failed to fetch attendance for ${user.employeeId}:`, error);
        }
      })
    );

    setMonthlyWorkingHours(workingHours); // Update state with monthly working hours
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
  };

  // Safely render any value, handle objects to avoid JSX errors
  const safeRender = (value) => {
    if (typeof value === 'object' && value !== null) {
      console.warn('Attempted to render an object. Rendering as JSON string:', value);
      return JSON.stringify(value); // Handle object rendering as a string
    }
    return value || 'N/A'; // Handle undefined or null values
  };

  // Function to handle user creation
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
        fetchUsers(); // Refresh user list
        setUserForm({
          name: '', email: '', employeeId: '', role: 'employee', password: '',
        }); // Reset form
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to create user.');
      }
    } catch (error) {
      toast.error('Failed to create user.');
      console.error('Error creating user:', error);
    }
  };

  // Handle user editing, including MongoDB `_id`
  const handleEditUser = (user) => {
    console.log('Editing user:', user); // Log the user object to inspect the structure
    setEditingUser(user._id); // Track the user's MongoDB `_id` for updating
    setUserForm({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
      password: '', // Leave the password blank for no change
    });
  };

  // Function to update user
  const handleUpdateUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });

      if (res.ok) {
        toast.success('User updated successfully!');
        fetchUsers(); // Refresh user list
        setUserForm({
          name: '', email: '', employeeId: '', role: 'employee', password: '',
        });
        setEditingUser(null); // Reset editing state
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update user.');
      }
    } catch (error) {
      toast.error('Failed to update user.');
      console.error('Error updating user:', error);
    }
  };

  // Function to delete user
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('User deleted successfully!');
        fetchUsers(); // Refresh user list
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      toast.error('Failed to delete user.');
      console.error('Error deleting user:', error);
    }
  };

  // Cancel edit and reset form
  const handleCancelEdit = () => {
    setEditingUser(null);
    setUserForm({
      name: '', email: '', employeeId: '', role: 'employee', password: '',
    });
  };

  // Function to handle QR code generation
  const handleGenerateQRCode = async (employeeId) => {
    setLoadingQR(true);
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
      toast.error('Failed to generate QR code');
    } finally {
      setLoadingQR(false);
    }
  };

  return (
    <section>
      <Toaster />
      <h2 className="text-2xl font-semibold">Manage Users</h2>

      {/* User Form */}
      <div className="my-4">
        <input
          type="text"
          name="name"
          value={userForm.name || ''}
          onChange={handleInputChange}
          placeholder="Name"
          className="p-2 mr-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={userForm.email || ''}
          onChange={handleInputChange}
          placeholder="Email"
          className="p-2 mr-2 border rounded"
        />
        <input
          type="text"
          name="employeeId"
          value={userForm.employeeId || ''}
          onChange={handleInputChange}
          placeholder="Employee ID"
          className="p-2 mr-2 border rounded"
        />
        <select
          name="role"
          value={userForm.role || 'employee'}
          onChange={handleInputChange}
          className="p-2 mr-2 border rounded"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="password"
          name="password"
          value={userForm.password || ''}
          onChange={handleInputChange}
          placeholder="Password"
          className="p-2 mr-2 border rounded"
        />

        <button
          onClick={editingUser ? handleUpdateUser : handleCreateUser}
          className={`p-2 ${editingUser ? 'bg-blue-500' : 'bg-green-500'} text-white rounded`}
        >
          {editingUser ? 'Update User' : 'Create User'}
        </button>

        {editingUser && (
          <button onClick={handleCancelEdit} className="p-2 ml-2 text-white bg-gray-500 rounded">
            Cancel
          </button>
        )}
      </div>

      {/* Users Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Employee ID</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Monthly Hours</th> {/* New Column for Monthly Working Hours */}
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-3">{safeRender(user.name)}</td>
                <td className="px-4 py-3">{safeRender(user.email)}</td>
                <td className="px-4 py-3">{safeRender(user.employeeId)}</td>
                <td className="px-4 py-3">{safeRender(user.role)}</td>
                <td className="px-4 py-3">{monthlyWorkingHours[user.employeeId] || 'N/A'}</td> {/* Display monthly hours */}
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
                  <button
                    onClick={() => handleGenerateQRCode(user.employeeId)}
                    className="p-2 ml-2 text-white bg-green-500 rounded"
                  >
                    {loadingQR ? <div className="spinner" /> : 'Generate QR'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-3 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .spinner {
          width: 25px;
          height: 25px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
    </section>
  );
}
