import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]); // State to hold list of photos
  const [page, setPage] = useState(1); // State to manage pagination
  const [loading, setLoading] = useState(false); // State to track loading state
  const [selectedFile, setSelectedFile] = useState(null); // State to hold selected file
  const navigate = useNavigate(); // Hook from react-router-dom for navigation
  const { username, userId, albumId } = useParams(); // Hook to access URL parameters

  // Function to fetch photos based on albumId and pagination state
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true); // Set loading state to true
      try {
        // Fetch photos from local server based on albumId, page, and limit
        const response = await fetch(`http://localhost:3001/photos?albumId=${albumId}&_page=${page}&_limit=3`);
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        const data = await response.json(); // Extract JSON data from response
        setPhotos(prevPhotos => [...prevPhotos, ...data]); // Update photos state with new data
      } catch (error) {
        console.error('Error fetching photos:', error); // Log error if fetch fails
      } finally {
        setLoading(false); // Set loading state back to false after fetch completes
      }
    };

    fetchPhotos(); // Call fetchPhotos function when albumId or page changes
  }, [page, albumId]);

  // Function to load more photos by incrementing the page state
  const loadMorePhotos = () => {
    setPage(prevPage => prevPage + 1); // Increment page state to load next page of photos
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Set selected file in state
  };

  // Function to add a photo to the album
  const handleAddPhoto = async () => {
    try {
      if (!selectedFile) {
        throw new Error('Please select a file');
      }
  
      const formData = new FormData();
      formData.append('albumId', albumId); // Append albumId to form data
      formData.append('title', selectedFile.name); // Append file name as title
      formData.append('photo', selectedFile); // Append selected file to form data
  
      const response = await fetch('http://localhost:3001/photos', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to add photo');
      }
  
      const addedPhoto = await response.json();
  
      // Assuming addedPhoto is in the structure provided by your server
      const addedPhotoTemplate = {
        id: addedPhoto.id,
        albumId: addedPhoto.albumId,
        title: addedPhoto.title,
        url: addedPhoto.url, // Ensure the URL matches your server's response
        thumbnailUrl: addedPhoto.thumbnailUrl, // Ensure the thumbnailUrl matches your server's response
      };
  
      setPhotos(prevPhotos => [addedPhotoTemplate, ...prevPhotos]); // Add new photo to the photos state
  
      // Display success message or update UI as needed
      console.log('Successfully added photo:', addedPhotoTemplate);
  
      setSelectedFile(null); // Clear selected file state after successful upload
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };
  

  // Function to delete a photo from the album
  const handleDeletePhoto = async (photoId) => {
    try {
      const response = await fetch(`http://localhost:3001/photos/${photoId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== photoId)); // Update photos state after deletion
    } catch (error) {
      console.error('Error deleting photo:', error); // Log error if deleting photo fails
    }
  };

  // Function to update a photo in the album
  const handleUpdatePhoto = async (photoId) => {
    try {
      const updatedPhoto = { // Placeholder data for updated photo
        id: photoId,
        albumId: Number(albumId),
        title: 'Updated Photo Title',
        url: 'https://via.placeholder.com/600/92c952',
        thumbnailUrl: 'https://via.placeholder.com/150/92c952'
      };
      const response = await fetch(`http://localhost:3001/photos/${photoId}`, { // Send PUT request to server to update photo
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPhoto)
      });
      if (!response.ok) {
        throw new Error('Failed to update photo');
      }
      const updatedPhotoData = await response.json(); // Extract updated photo data from response
      setPhotos(prevPhotos => prevPhotos.map(photo => (photo.id === photoId ? updatedPhotoData : photo))); // Update photos state with updated photo
    } catch (error) {
      console.error('Error updating photo:', error); // Log error if updating photo fails
    }
  };

  return (
    <div className="photos-container">
      <h2>Photos</h2>
      <div className="photos-list">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img src={photo.thumbnailUrl} alt={photo.title} /> {/* Display photo thumbnail */}
            <p>{photo.title}</p> {/* Display photo title */}
            <button onClick={() => handleDeletePhoto(photo.id)}>Delete Photo</button> {/* Button to delete photo */}
            <button onClick={() => handleUpdatePhoto(photo.id)}>Update Photo</button> {/* Button to update photo */}
          </div>
        ))}
      </div>
      <div className="load-more-button">
        {/* Button to load more photos, disabled when loading state is true */}
        <button onClick={loadMorePhotos} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Photos'}
        </button>
      </div>
      <input type="file" onChange={handleFileChange} /> {/* Input to select file from local machine */}
      <button onClick={handleAddPhoto} disabled={!selectedFile || loading}>Add Photo</button> {/* Button to add selected photo */}
      <button onClick={() => navigate(`/home/${username}/albums/${userId}`)}>Return to Albums</button> {/* Button to navigate back to Albums */}
    </div>
  );
};

export default PhotosPage;
