import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie'; // Import js-cookie
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const LoginForm = () => {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/auth/token/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username and password
      });

      if (!response.ok) {
        throw new Error('Login failed!'); // Handle error response
      }

      const data = await response.json();
      const token = data.auth_token; // Extract token from response

      const expirationTime = new Date(Date.now() + 20 * 60 * 1000); // 2 minutes from now
      Cookies.set('authToken', token, { expires: expirationTime });
 
      console.log('Token stored in cookie:', token); // Log token for debugging

      // Redirect the user to the home page after successful login
      navigate('/'); // Change '/' to your home route if different
    } catch (error) {
      console.error(error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-6 p-5">
        <h3 className="card-title text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-center">
          <small>Don't have an account? <a href="#">Sign up</a></small>
        </div>
      </div>
      <div className="col-6 bg-image-login">
        {/* You can add content here if needed */}
      </div>
    </div>
  );
};

export default LoginForm;
