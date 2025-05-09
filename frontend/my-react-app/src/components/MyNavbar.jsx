import React, { useEffect, useState } from "react";
import './Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";

const MyNavbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartHovered, setIsCartHovered] = useState(false);

  const isLoggedIn = document.cookie.includes("authToken");

  const getTokenFromCookies = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    return token ? token.split('=')[1].trim() : null;
  };

  const handleLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/loginform");
  };

  const handleCartClick = () => {
    // Navigate to the cart page when the cart icon is clicked
    navigate("/cart");
  };

  // Fetch user data
  const fetchUserData = async () => {
    const authToken = getTokenFromCookies();
    if (authToken) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/auth/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    const authToken = getTokenFromCookies();
    if (authToken) {
      try {
        const response = await fetch('http://localhost:8000/api/cart/menu-items', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }

        const data = await response.json();
        setCartItems(data.results); // Store cart items
      } catch (error) {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
      fetchCartItems();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isCartHovered) {
      fetchCartItems(); // Fetch cart items again if the cart is hovered
    }
  }, [isCartHovered]); // Trigger cart fetch when hovering

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-light fs-3 fw-bold" to="/">  <img src="images/logo.png" alt=""   /> RestroFlow</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link text-light" to="/menu">Menu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-light" to="/menuitem/1">Menuitem</Link>
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
           
              <li className="nav-item  ">
                <Link
                  className="nav-link text-light"
                  to="#"
                  id="cartDropdown"
                  role="button"
                  onClick={handleCartClick}
                   // Reset hover state
                  aria-expanded="false"
                >
                  <FaShoppingBasket />
                </Link>

                {/* Conditionally render cart items or empty message */}
                 
                 <div >
                 <ul
                    className={`dropdown-menu dropdown-menu-end ${cartItems.length > 3 ? 'max-height-300 overflow-auto' : ''}`}
                    aria-labelledby="cartDropdown"
                  >
                    {cartItems.map(item => (
                      <li key={item.menuitem.id} className="dropdown-item d-flex align-items-center">
                        <img src={item.menuitem.image} alt={item.menuitem.title} className="cart-item-image me-3" style={{ width: 40, height: 40, borderRadius: '5px' }} />
                        <div>
                          <span>{item.menuitem.title}</span><br />
                          <span>Quantity: {item.quantity}</span><br />
                          <span>${item.price}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  </div>
                 
              </li>
            
            {isLoggedIn && (
              <>
                <Link className="nav-link text-light" to="/orders">{username}</Link>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MyNavbar;
