import React from "react";
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { FaCartArrowDown } from "react-icons/fa";

const MyNavbar = () => {
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
              <Link className='text-light' to="/cart"><FaCartArrowDown /></Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;