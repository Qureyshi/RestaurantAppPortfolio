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
      <div className="container">
        <a className="navbar-brand" href="#home">Rms</a>
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
          <ul className="navbar-nav me-auto">
            <li className="nav-item d-flex align-items-center p-2">
              <Link className='text-light' to="/">Menu</Link>
            </li>
            <li className="nav-item d-flex align-items-center p-2">
              <Link className='text-light' to="/reservation">Reservation</Link>
            </li>
            <li className="nav-item d-flex align-items-center p-2">
              <Link className='text-light' to="/loginform">Login</Link>
            </li>
            <li className="nav-item d-flex align-items-center p-2">
              <Link className='text-light' to="/register">Register</Link>
            </li>
            <li className="nav-item d-flex align-items-center p-2">
              <Link className='text-light' to="/cart"><FaCartArrowDown /></Link>
            </li>
          </ul>
          {/* Add Logout Button */}
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
