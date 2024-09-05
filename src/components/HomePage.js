import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * HomePage component serves as the main landing page after user logs in.
 * It displays a welcome message and provides navigation to various sections
 * like Info, ManageUsersPage, Posts, and Albums. It also allows the user to logout.
 * Admin and Customer have different views.
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));

  // useEffect to update currentUser state if 'currentUser' is found in localStorage
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  /**
   * handleLogout function clears the currentUser from localStorage and navigates to login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  // Conditionally render buttons based on user's role (admin or customer)
  const renderAdminOptions = () => (
    <div>
      <button onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
      <button onClick={() => navigate(`/home/${currentUser.username}/reports/${currentUser.id}`)}>View Reports</button>
      {/* Other admin-specific options can be added here */}
    </div>
  );

  const renderCustomerOptions = () => (
    <div>
      <button onClick={() => navigate(`/home/${currentUser.username}/info/${currentUser.id}`)}>Info</button>
      <button onClick={() => navigate(`/home/${currentUser.username}/ManageUsersPage/${currentUser.id}`)}>ManageUsersPage</button>
      <button onClick={() => navigate(`/home/${currentUser.username}/posts/${currentUser.id}`)}>Posts</button>
      <button onClick={() => navigate(`/home/${currentUser.username}/albums/${currentUser.id}`)}>Albums</button>
    </div>
  );

  return (
    <div>
      <h2>Welcome, {currentUser ? currentUser.name : 'Guest'}</h2>
      {currentUser && (
        <div>
          <h3>Role: {currentUser.role}</h3>
          {currentUser.role === 'admin' ? renderAdminOptions() : renderCustomerOptions()}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
