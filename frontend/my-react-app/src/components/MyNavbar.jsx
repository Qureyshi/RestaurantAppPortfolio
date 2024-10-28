import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { FaCartArrowDown } from "react-icons/fa";

const MyNavbar = () => {
  const navigate = useNavigate();

  // Function to clear the authToken cookie
  const handleLogout = () => {
    // Clear the authToken cookie by setting its expiry date to a past time
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/loginform"); // Redirect to the login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container d-flex justify-content-between">
        {/* Left side - RMS logo */}
        <Link className='navbar-brand text-light h1' to="/">Rms</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Right side - other links */}
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item p-2">
              <Link className='text-light' to="/menu">Menu</Link>
            </li>
            <li className="nav-item p-2">
              <Link className='text-light' to="/reservation">Reservation</Link>
            </li>
            <li className="nav-item p-2">
              <Link className='text-light' to="/loginform">Login</Link>
            </li>
            <li className="nav-item p-2">
              <Link className='text-light' to="/register">Register</Link>
            </li>
            <li className="nav-item p-2">
              <Link className='text-light' to="/orders">Orders</Link>
            </li>
            <li className="nav-item p-2">
              <Link className='text-light' to="/cart"><FaCartArrowDown /></Link>
            </li>
          </ul>

          {/* Logout Button */}
          <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
