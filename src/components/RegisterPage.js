import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RegisterPage component allows users to register for an account.
 * Admin registration requires a special code.
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [specialCode, setSpecialCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const SPECIAL_ADMIN_CODE = 'ADMIN2024'; // הקוד המיוחד להרשמה כ-admin

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Username and password are required');
      return;
    }

    // קביעת התפקיד לפי הקוד המיוחד
    const role = specialCode === SPECIAL_ADMIN_CODE ? 'admin' : 'customer';

    try {
      const url = `http://localhost:3001/users`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password, // יש להצפין את הסיסמה בצד השרת
          role,
        }),
      });

      if (!response.ok) {
        setErrorMessage('Registration failed');
        return;
      }

      const newUser = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      navigate(`/home/${username}`);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred during registration');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Special Code (for Admin):</label>
          <input
            type="text"
            value={specialCode}
            onChange={(e) => setSpecialCode(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
