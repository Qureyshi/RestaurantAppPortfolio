import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie'; // Import js-cookie
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FaHome } from "react-icons/fa";


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

      const expirationTime = new Date(Date.now() + 90 * 60 * 1000); // 2 minutes from now
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


    <>
     <div
        className="min-vh-100 bg-dark d-flex justify-content-center align-items-center"

      >
     <div className="container p-5">
     <div className='position-absolute p-4 top-0 start-0'>
        <Link className='text-white h1' to="/"><FaHome /></Link>
     </div>
     <div className="row rounded  overflow-hidden shadow-lg bg-white g-0 position-relative">
      <div className="col-lg-5 position-relative login z-0  d-flex justify-content-center align-items-center overflow-hidden">
        <div className='p-5 z-1'>
          <h2 className='mb-2' >Welcome Back</h2>
          <p className='mb-5'>Sign in with your email adress and password</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="username" className="form-label fw-bold">Username</label>
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
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-bold">Password</label>
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
            <div className="mb-5 form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
          <div className="mt-3">
            <small>Don't have an account? <Link className='text-dark' to="/register">Sign up</Link></small>
          </div>
        </div>
      </div>
      <div className="col-lg-7">
        <div
           className=""
           style={{
             backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1683619761464-6b7c9a2716a8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
             backgroundSize: "cover",       // Ensures the image covers the entire div
             backgroundPosition: "center",  // Centers the image within the div
             backgroundRepeat: "no-repeat",
             height: "100%", // Prevents the image from repeating
           }}
         >     
      </div>
    </div>
    </div>
    </div>
    </div>
    </>
  );
};

export default LoginForm;
