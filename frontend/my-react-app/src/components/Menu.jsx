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
  const [activeCategory, setActiveCategory] = useState('Main Meals');
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  
 
  const [minPrice, setMinPrice] = useState(0); // Default minimum price
  const [maxPrice, setMaxPrice] = useState(100); // Default maximum price

  const handleMinSliderChange = (e) => {
    const value = Math.min(e.target.value, maxPrice); // Prevent min > max
    setMinPrice(value);
  };

  const handleMaxSliderChange = (e) => {
    const value = Math.max(e.target.value, minPrice); // Prevent max < min
    setMaxPrice(value);
  };

  const handleMinInputChange = (e) => {
    const value = Math.min(e.target.value, maxPrice); // Prevent min > max
    setMinPrice(value);
  };

  const handleMaxInputChange = (e) => {
    const value = Math.max(e.target.value, minPrice); // Prevent max < min
    setMaxPrice(value);
  };


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

  const fetchMenuData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuData(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotalPages(Math.ceil(data.count/8));
    } catch (err) {
      setErrorMenu(err.message);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMenuData(`http://localhost:8000/api/menu-items?category__title=${activeCategory}&page=${currentPage}`);
  }, [activeCategory, currentPage]);

  const handleCategoryClick = (categoryTitle) => {
    setActiveCategory(categoryTitle);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (nextPage) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (previousPage) setCurrentPage((prev) => prev - 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  

  const renderPageNumbers = () => {
    const pages = [];
    const range = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages) {
        pages.push(
          <button
            key={i}
            className={`btn ${i === currentPage ? 'btn-danger' : 'btn-outline-danger'} mx-1`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </button>
        );
      } else if (i >= currentPage - range && i <= currentPage + range) {
        pages.push(
          <button
            key={i}
            className={`btn ${i === currentPage ? 'btn-danger' : 'btn-outline-danger'} mx-1`}
            onClick={() => handlePageClick(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
        pages.push(
          <span key={`ellipsis-${i}`} className="mx-1">...</span>
        );
      }
    }

    return pages;
  };


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
          <div className="col-lg-2">
            <div>
              <h4 className='fw-bold mb-3'>Categories</h4>
              <ul className='list-group'>
                {categoryData.map((item) => (
                  <li
                    key={item.id}
                    className={`list-group-item ${activeCategory === item.title ? 'bg-danger' : ''}`}
                  >
                    <a
                      href='#'
                      className={`${activeCategory === item.title ? 'text-white' : 'text-dark'}`}
                      onClick={() => handleCategoryClick(item.title)}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              
      
        <h4 className='mt-5'>Search</h4>
        <input type="text" placeholder="Search menu items..." />
              
      <h4 className='mt-5'>Filter by Price</h4>
      <div>
        <label>Min Price:</label>
        <input
          type="range"
          min="0"
          max="40"
          value={minPrice}
          onChange={handleMinSliderChange}
          className='w-100'
        />
      </div>

      {/* Max Price Slider and Input */}
      <div>
        <label>Max Price:</label>
        <input
          type="range"
          min="0"
          max="40"
          value={maxPrice}
          onChange={handleMaxSliderChange}
          className='w-100'
        />
      </div>

      <p>
        Price: ${minPrice} - ${maxPrice}
      </p>
      <button className='btn btn-danger'>FILTER</button>
    </div>



  <div className='mt-4'>
    <div class="form-check ">
    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
    <label class="form-check-label" for="flexCheckDefault">
      Price low to high
    </label>
    </div>

    <div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
    <label class="form-check-label" for="flexCheckDefault">
     Price high to low
    </label>
    </div>
  </div>
    















      

          </div>
          <div className="col-lg-10">
            <div className="row g-4">
              {menuData.map((item) => (
                <div className="col-lg-4 col-md-6" key={item.id}>
                  <div className="rounded p-2 overflow-hidden bg-light text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-fit-cover"
                      style={{ width: '100%', height: '250px' }}
                    />
                    <a href={`/menuitem/${item.id}`}  className='text-decoration-none text-dark'><h3 className="fw-bold my-2  text-center">{item.title}</h3></a>
                    <p className='text-secondary text-center'>It is a long established fact that a reader will be distracted.</p>
                    <h4 className="text-danger fw-bold  text-center">${parseFloat(item.price).toFixed(2)}</h4>
                    
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
            {renderPageNumbers()}
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
