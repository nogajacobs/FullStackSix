import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AlbumsPage component displays a list of albums for the current user.
 * Allows adding new albums, searching by album ID or title, deleting albums,
 * and navigating to the PhotosPage for a specific album.
 */
const AlbumsPage = () => {
  const navigate = useNavigate();

  // Retrieve username and userId from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const username = currentUser.username;
  const userId = currentUser.id;

  // State variables
  const [albums, setAlbums] = useState([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [searchCriteria, setSearchCriteria] = useState({
    id: '',
    title: ''
  });

  // Fetch albums for the current user from the server
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:3001/albums?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();

        // Apply search filtering
        const filteredData = data.filter(album =>
          (!searchCriteria.id || album.id.toString().includes(searchCriteria.id)) &&
          (!searchCriteria.title || album.title.toLowerCase().includes(searchCriteria.title.toLowerCase()))
        );

        setAlbums(filteredData);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, [userId, searchCriteria]);

  // Handle change in search input fields
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prevCriteria => ({
      ...prevCriteria,
      [name]: value
    }));
  };

  // Handle adding a new album
  const handleAddAlbum = async (e) => {
    e.preventDefault();
    const newAlbum = {
      userId: parseInt(userId),
      id: (getMaxAlbumId() + 1).toString(),
      title: newAlbumTitle,
    };
    try {
      const response = await fetch('http://localhost:3001/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbum),
      });
      if (!response.ok) {
        throw new Error('Failed to add new album');
      }
      setAlbums([...albums, newAlbum]);
      setNewAlbumTitle('');
    } catch (error) {
      console.error('Error adding new album:', error);
    }
  };

  // Function to get the maximum album ID currently in use
  const getMaxAlbumId = () => {
    const maxId = albums.reduce((max, album) => (parseInt(album.id) > max ? parseInt(album.id) : max), 0);
    return maxId;
  };

  // Navigate to the PhotosPage for the selected album
  const goToPhotosPage = (albumId) => {
    navigate(`/home/${username}/albums/${userId}/photos/${albumId}`);
  };

  // Handle deleting an album
  const handleDeleteAlbum = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/albums/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete album');
      }
      const updatedAlbums = albums.filter(album => album.id !== id);
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  return (
    <div>
      <h2>Albums List</h2>
      {/* Form to add a new album */}
      <form onSubmit={handleAddAlbum}>
        <input
          type="text"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
          placeholder="Enter new album title"
          required
        />
        <button type="submit">Add Album</button>
      </form>
      {/* Form for searching albums */}
      <form>
        <input
          type="text"
          name="id"
          value={searchCriteria.id}
          onChange={handleSearchChange}
          placeholder="Search by ID"
        />
        <input
          type="text"
          name="title"
          value={searchCriteria.title}
          onChange={handleSearchChange}
          placeholder="Search by Title"
        />
      </form>
      {/* List of albums */}
      <ul>
        {albums.map(album => (
          <li key={album.id}>
            {/* Button to navigate to PhotosPage for the album */}
            <button onClick={() => goToPhotosPage(album.id)}>
              {`${album.id} - ${album.title}`}
            </button>
            {/* Button to delete the album */}
            <button onClick={() => handleDeleteAlbum(album.id)}>Delete Album</button>
          </li>
        ))}
      </ul>
      {/* Button to return to the Home page */}
      <button onClick={() => navigate(`/home/${username}`)}>Return to Home</button>
    </div>
  );
};

export default AlbumsPage;
