import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import { useNavigate, Link } from 'react-router-dom'; 
import { FaHome } from 'react-icons/fa'; // Import Link and FaHome

const Register = () => {
  const [username, setUsername] = useState(''); // State for username
  const [email, setEmail] = useState('');       // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState('');       // State for error message
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
          username,
          email,
          password
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
          username,
          password
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
      const expirationTime = new Date(Date.now() + 90 * 60 * 1000); // 7 days from now
      Cookies.set('authToken', auth_token, { expires: expirationTime });
      navigate('/');

    } catch (error) {
      console.error('Error during registration or login:', error.message);
      setError(error.message); // Set error state to show in UI
    }
  };
  
  return (
   <>
    <div className="min-vh-100 bg-dark d-flex justify-content-center align-items-center">
      <div className="container p-5">
        <div className='position-absolute p-4 top-0 start-0'>
          <Link className='text-white h1' to="/"><FaHome /></Link>
        </div>
        <div className="row rounded overflow-hidden shadow-lg bg-white g-0 position-relative">
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
          <div className="col-lg-5 position-relative login z-0 d-flex justify-content-center align-items-center overflow-hidden">
            <div className='p-5 z-1'>
              <h2 className="card-title mb-2">Register</h2>
              <p className='mb-5'>Sign in with your email adress and password</p>
              {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label fw-bold">Username</label>
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
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">Password</label>
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
                <button type="submit" className="btn btn-primary w-100">Register</button>
              </form>
              <div className="mt-3 text-center">
                <small>Already have an account? <Link to="/loginform">Login</Link></small> {/* Link to login */}
              </div>
            </div>
          </div>
          


        </div>
      </div>
    </div>
   </>
  );
};

export default Register;
