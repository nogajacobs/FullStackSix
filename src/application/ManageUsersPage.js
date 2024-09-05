import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ManageUsersPage component displays a list of all users,
 * allows the admin to edit user roles or delete users.
 */
const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Fetch users data from the API
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login'); // Redirect to login if not admin
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setErrorMessage('Error loading users');
      }
    };

    fetchUsers();
  }, [currentUser, navigate]);

  // Update user role (admin/customer)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      // Update the local state with the new role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      setErrorMessage('Failed to update user role');
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove the user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      setErrorMessage('Failed to delete user');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <h2>Access Denied. Admins only.</h2>;
  }

  return (
    <div>
      <h2>Manage Users</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to navigate back to home page */}
      <button onClick={() => navigate(`/home/${currentUser.username}`)}>Return to Home</button>
      
    </div>
  );
};

export default ManageUsersPage;
