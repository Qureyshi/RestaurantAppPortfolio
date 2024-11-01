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
  const handleAddToCart = async (menuItemId, quantity) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      if (!token) {
        console.error('No auth token found');
        return;
      }
      const authToken = token.split('=')[1].trim();

      const response = await fetch('http://localhost:8000/api/cart/menu-items', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuitem_id: menuItemId,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error adding item to cart:', errorText);
        return;
      }

      const data = await response.json();
      console.log('Item added to cart:', data);
      setCartItems(prevItems => [...prevItems, data]); // Update UI if needed
    } catch (error) {
      console.error('Error adding item to cart:', error);
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
        <div className="row g-4">
          <div className="col-3">
            <ul>
            {categoryData.map((item) => (
              <li >
              <a
                href='#'
                className={`${
                  activeCategory === item.title ? 'link-dark' : 'link-danger'
                }`}
                onClick={() => handleCategoryClick(item.title)}
              >
                {item.title}
              </a>
              </li>
            ))}
            </ul>
          </div>
          <div className="col-9">
            <div className="row g-4">
              {menuData.map((item) => (
              <div className="col-4" key={item.id}>
                <div className="rounded p-2 overflow-hidden bg-light">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="object-fit-cover"
                    style={{ width: '100%', height: '250px' }}
                  />
                  <h3 className="fw-bold my-2">{item.title}</h3>
                  <p className='text-secondary'>It is a long established fact that a reader will be distracted.</p>
                  <h3 className="text-danger fw-bold">
                    ${parseFloat(item.price).toFixed(2)}
                  </h3>
                  <button 
                    className="btn btn-danger mt-2" 
                    onClick={() => handleAddToCart(item.id, 1)} // Pass the item to the handler
                  >
                    Add to cart
                  </button>
                </div>
              </div>
              ))}
            </div>
          </div>

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
      </div>


































      <MyFooter />
    </>
  );
};

export default Menu;
