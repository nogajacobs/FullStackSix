import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CompleteProfilePage from './components/CompleteProfilePage';
import HomePage from './components/HomePage';
import ManageUsersPage from './application/ManageUsersPage';
import PostsPage from './application/PostsPage';
import AlbumsPage from './application/AlbumsPage';
import InfoPage from './application/InfoPage';
import PhotosPage from './application/PhotosPage';
import './style/style.css';

/**
 * The App component is the main entry point for the React application.
 * It defines the routing structure using react-router-dom.
 */
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Route for the registration page */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Route for the complete profile page with username and website parameters */}
        <Route path="/complete-profile/:username/:website" element={<CompleteProfilePage />} />
        
        {/* Route for the home page with username parameter */}
        <Route path="/home/:username" element={<HomePage />} />
        
        {/* Route for the ManageUsersPage page */}
        <Route path="/admin/manage-users" element={<ManageUsersPage />} />
        
        {/* Route for the posts page with username and userId parameters */}
        <Route path="/home/:username/posts/:userId" element={<PostsPage />} />
        
        {/* Route for the albums page with username and userId parameters */}
        <Route path="/home/:username/albums/:userId" element={<AlbumsPage />} />
        
        {/* Route for the info page with username and userId parameters */}
        <Route path="/home/:username/info/:userId" element={<InfoPage />} />
        
        {/* Route for the photos page with username, userId, and albumId parameters */}
        <Route path="/home/:username/albums/:userId/Photos/:albumId" element={<PhotosPage />} />
      </Routes>
    </div>
  );
}

export default App;
