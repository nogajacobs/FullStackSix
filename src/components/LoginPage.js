import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/users?username=${username}`);
      const users = await response.json();
      const user = users.find(user => user.password === password);
      if (!user) {
        setErrorMessage("Invalid username or password");
        return;
      }
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate(`/home/${username}`);
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred during login");
    }
  };

  const handleRegister = () => navigate('/register');

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <h4 className="error-message">{errorMessage}</h4>
        <div className="login-buttons">
          <button type="submit">Login</button>
          <button type="button" onClick={handleRegister}>Register</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
