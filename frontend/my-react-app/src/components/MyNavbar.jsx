import React from "react";
import './Navbar.css'
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingBasket } from "react-icons/fa";

const MyNavbar = () => {
  const navigate = useNavigate();
  
  const isLoggedIn = document.cookie.includes("authToken");

  const handleLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/loginform");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-light fs-3 fw-bold" to="/">RMS</Link>
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
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/menu">Menu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/reservation">Reservation</Link>
            </li>
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/loginform">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/register">Register</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link text-light" to="/orders">Orders</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/cart">
                <FaShoppingBasket />
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
