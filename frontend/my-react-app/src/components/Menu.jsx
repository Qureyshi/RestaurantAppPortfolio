import React, { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

const Menu = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [errorCategories, setErrorCategories] = useState('');
  const [errorMenu, setErrorMenu] = useState('');
  const [activeCategory, setActiveCategory] = useState('Main Meals'); // Default active category
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategoryData(data.results || []);
    } catch (err) {
      setErrorCategories(err.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch Menu Items with Pagination
  const fetchMenuData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuData(data.results || []);
      setNextPage(data.next); // Set the next page URL
      setPreviousPage(data.previous); // Set the previous page URL
    } catch (err) {
      setErrorMenu(err.message);
    } finally {
      setLoadingMenu(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchCategories();
    fetchMenuData(`http://localhost:8000/api/menu-items?category__title=${activeCategory}`); // Fetch initial category items
  }, [activeCategory]);

  // Handle Category Click: Fetch menu items for the selected category
  const handleCategoryClick = (categoryTitle) => {
    setActiveCategory(categoryTitle);
    fetchMenuData(`http://localhost:8000/api/menu-items?category__title=${categoryTitle}`);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (nextPage) {
      fetchMenuData(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchMenuData(previousPage);
    }
  };

  // Get authToken from cookies
  const getAuthToken = () => {
    const match = document.cookie.match(/authToken=([^;]+)/);
    return match ? match[1] : null;
  };

  // Handle adding item to cart
  const handleAddToCart = async (item) => {
    const token = getAuthToken(); // Retrieve the token

    if (!token) {
      alert("You need to log in to add items to the cart.");
      return;
    }

    const data = {
      menuitem: item.id, // Assuming item.id corresponds to the menu item ID
      unit_price: item.price,
      quantity: 1, // You can change this to get user input
      price: item.price,
    };

    try {
      const response = await fetch('http://localhost:8000/api/cart/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`, // Include the token in the headers
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const result = await response.json();
      console.log('Item added to cart:', result);
      // Optionally update UI or notify the user
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loadingCategories || loadingMenu) {
    return <div>Loading...</div>;
  }

  if (errorCategories || errorMenu) {
    return <div>Error: {errorCategories || errorMenu}</div>;
  }

  return (
    <>
      <MyNavbar />
      <div className="container-fluid p-5 orders">
        <div className="p-5 text-center text-danger">
          <h1 className="font-weight-bold">MENU</h1>
        </div>
      </div>
      <div className="container py-5">
        <h1 className="text-center font-weight-bold">Best Selling Dishes</h1>
        <div className="d-flex justify-content-center my-3">
          {categoryData.map((item) => (
            <button
              key={item.id}
              className={`btn rounded-pill mx-2 ${
                activeCategory === item.title ? 'btn-danger' : 'btn-outline-danger'
              }`}
              onClick={() => handleCategoryClick(item.title)}
            >
              {item.title}
            </button>
          ))}
        </div>
        <div className="row">
          {menuData.map((item) => (
            <div className="col-3" key={item.id}>
              <div className="rounded bg-light py-3 mt-5 d-flex flex-column align-items-center text-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-circle"
                  style={{ width: '60%', height: 'auto' }}
                />
                <h4 className="mt-2">{item.title}</h4>
                <h6 className="mt-2 text-danger font-weight-bold">
                  ${parseFloat(item.price).toFixed(2)}
                </h6>
                <button 
                  className="btn btn-danger mt-2" 
                  onClick={() => handleAddToCart(item)} // Pass the item to the handler
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-4">
          {previousPage && (
            <button
              className="btn btn-outline-danger mx-2"
              onClick={handlePreviousPage}
            >
              Previous
            </button>
          )}
          {nextPage && (
            <button
              className="btn btn-outline-danger mx-2"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
        </div>
      </div>
      <div className="specialfood bg-danger">
        <div className="container p-5">.</div>
      </div>
      <MyFooter />
    </>
  );
};

export default Menu;
