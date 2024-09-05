import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * CompleteProfilePage component allows the user to complete their profile
 * with additional information after registering.
 */
const CompleteProfilePage = () => {
  const { username, website } = useParams(); // Get the username and website from the URL parameters
  const [id, setId] = useState(''); // State to hold the user ID input
  const [name, setName] = useState(''); // State to hold the full name input
  const [email, setEmail] = useState(''); // State to hold the email input
  const [street, setStreet] = useState(''); // State to hold the street input
  const [suite, setSuite] = useState(''); // State to hold the suite input
  const [city, setCity] = useState(''); // State to hold the city input
  const [zipcode, setZipcode] = useState(''); // State to hold the zipcode input
  const [lat, setLat] = useState(''); // State to hold the latitude input
  const [lng, setLng] = useState(''); // State to hold the longitude input
  const [phone, setPhone] = useState(''); // State to hold the phone input
  const [companyName, setCompanyName] = useState(''); // State to hold the company name input
  const [catchPhrase, setCatchPhrase] = useState(''); // State to hold the catch phrase input
  const [bs, setBs] = useState(''); // State to hold the bs input
  const navigate = useNavigate(); // Hook to navigate programmatically

  /**
   * Handles the form submission to complete the user's profile.
   * Sends a POST request with the form data to the server.
   * @param {Object} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      id,
      username,
      name,
      email,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: {
          lat,
          lng,
        },
      },
      phone,
      website,
      company: {
        name: companyName,
        catchPhrase,
        bs,
      },
    };

    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(data));
        navigate(`/home/${username}`);
      } else {
        alert('Registration completion failed');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  return (
    <div className="container">
      <div className="user-details">
        <h2>Complete Profile for {username}</h2>
        <p>Website: {website}</p>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>ID:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter user ID"
            required
          />
        </div>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        <div className="form-group">
          <label>Street:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Suite:</label>
          <input
            type="text"
            value={suite}
            onChange={(e) => setSuite(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Zipcode:</label>
          <input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Latitude:</label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Longitude:</label>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Catch Phrase:</label>
          <input
            type="text"
            value={catchPhrase}
            onChange={(e) => setCatchPhrase(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>BS:</label>
          <input
            type="text"
            value={bs}
            onChange={(e) => setBs(e.target.value)}
          />
        </div>
        <button type="submit">Complete Registration</button>
      </form>
      <button onClick={() => navigate('/login')}>Return to Login</button>
    </div>
  );
};

export default CompleteProfilePage;
