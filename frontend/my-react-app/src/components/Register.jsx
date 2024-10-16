import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import { useNavigate } from 'react-router-dom'; 

const Register = () => {
  const [username, setUsername] = useState(''); // State for username
  const [email, setEmail] = useState('');       // State for email
  const [password, setPassword] = useState(''); // State for password
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Step 1: Register the user
      const response = await fetch('http://localhost:8000/auth/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // send username from state
          email: email,       // send email from state
          password: password  // send password from state
        }),
      });
  
      // If registration response is not okay, log the error
      if (!response.ok) {
        const errorText = await response.text(); // Capture raw response text
        console.error('Server error:', errorText);
        throw new Error('Registration failed! Check server logs.');
      }
  
      // Step 2: Login to get the token
      const loginResponse = await fetch('http://localhost:8000/auth/token/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // send username from state
          password: password  // send password from state
        }),
      });

      // If login response is not okay, log the error
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error('Login error:', errorText);
        throw new Error('Login failed! Check server logs.');
      }

      const { auth_token } = await loginResponse.json(); // Get the token from the response
      console.log('User logged in successfully:', auth_token);
      
      // Step 3: Store the token in a cookie
      const expirationTime = new Date(Date.now() + 20 * 60 * 1000); // 2 minutes from now
      Cookies.set('authToken', auth_token, { expires: expirationTime });
      navigate('/');
  // Set cookie to expire in 7 days

      // Optionally, redirect or perform further actions after registration and login
    } catch (error) {
      console.error('Error during registration or login:', error.message);
      // Optionally, show an error message to the user
    }
  };
  
  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-8 col-md-6 col-lg-4 p-5 bg-light shadow rounded">
        <h3 className="card-title text-center mb-4">Register</h3>
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
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
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
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <div className="mt-3 text-center">
          <small>Already have an account? <a href="#">Login</a></small>
        </div>
      </div>
      <div className="col-6 bg-image">
        {/* Add an image or additional content here if needed */}
      </div>
    </div>
  );
};

export default Register;
