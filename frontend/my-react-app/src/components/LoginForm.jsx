import React, { useState } from 'react';
//import './Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/auth/token/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed! Check your username or password.');
      }

      const data = await response.json();
      const token = data.auth_token;

      const expirationTime = new Date(Date.now() + 90 * 60 * 1000); // Token expiration
      Cookies.set('authToken', token, { expires: expirationTime });

      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-lg-6 col-md-8 mx-auto p-5 shadow rounded bg-white">
          <h3 className="text-center mb-4">Login</h3>
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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
      </div>
    </div>
  );
};

export default LoginForm;
