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
  const [activeCategory, setActiveCategory] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });  
  const [tempMinPrice, setTempMinPrice] = useState(priceRange.min);
  const [tempMaxPrice, setTempMaxPrice] = useState(priceRange.max);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [sortOrder, setSortOrder] = useState(''); // State for sorting

  const handleMinSliderChange = (e) => {
    const value = Math.min(e.target.value, tempMaxPrice); // Prevent min > max
    setTempMinPrice(value); // Update temporary min price    
  };

  const handleMaxSliderChange = (e) => {
    const value = Math.max(e.target.value, tempMinPrice); // Prevent max < min
    setTempMaxPrice(value); // Update temporary max price    
  };

  const handleSliderRelease = () => {
    setPriceRange({ min: tempMinPrice, max: tempMaxPrice }); // Commit price range
    setCurrentPage(1); // Reset to the first page
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
      const response = await fetch(
        `${url}&price_min=${priceRange.min}&price_max=${priceRange.max}&ordering=${sortOrder}`
      );
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuData(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotalPages(Math.ceil(data.count / 8));
    } catch (err) {
      setErrorMenu(err.message);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMenuData(
      `http://localhost:8000/api/menu-items?category=${activeCategory}&page=${currentPage}&search=${searchQuery}`
    );
  }, [activeCategory, currentPage, searchQuery, sortOrder, priceRange]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent form submission refresh
    setCurrentPage(1); // Reset to the first page
    fetchMenuData(
      `http://localhost:8000/api/menu-items?category=${activeCategory}&page=1&search=${searchQuery}`
    );
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    setPriceRange({ min: 0, max: 100 }); // Reset the price range using setPriceRange
    setSearchQuery(''); 
    setSortOrder('');
  };
  


  const renderPageNumbers = () => {
    if (totalPages === 1) {
      return null; // Don't render anything if there's only 1 page
    }
  
    const pages = [];
    const range = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages) {
        pages.push(
          <button
            key={i}
            className={`btn ${i === currentPage ? 'btn-danger' : ''} mx-1`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (i >= currentPage - range && i <= currentPage + range) {
        pages.push(
          <button
            key={i}
            className={`btn ${i === currentPage ? 'btn-danger' : ''} mx-1`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
        pages.push(
          <span key={`ellipsis-${i}`} className="mx-1">
            ...
          </span>
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

     // Update the cart items dynamically
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
      <div className='container-fluid p-5 orders'>
        <div className='p-5 text-center text-danger'>
          <h1>Menu</h1>
        </div>
      </div>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-2">
            <h4 className="fw-bold mb-3">Categories</h4>
            <ul className="list-group">
              {categoryData.map((item) => (
                <li
                  key={item.id}
                  className={`list-group-item ${activeCategory === item.id ? 'bg-danger' : ''}`}
                >
                  <a
                    href="#"
                    className={`${activeCategory === item.id ? 'text-white' : 'text-dark'}`}
                    onClick={() => handleCategoryClick(item.id)}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5">
            <h4 className="fw-bold mb-3">Search</h4>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </form>
            </div>
            <div className="mt-4">
              <h5 className="fw-bold mb-2">Filter by Price</h5>
              <div>
                <label htmlFor="min-price" className="form-label">
                  Min Price: ${tempMinPrice}
                </label>
                <input
                  id="min-price"
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  //step="1"
                  value={tempMinPrice}
                  onChange={handleMinSliderChange}
                  onMouseUp={handleSliderRelease} // Trigger on mouse release
                  onTouchEnd={handleSliderRelease} // Support touch devices
                />
              </div>
              <div>
                <label htmlFor="max-price" className="form-label">
                  Max Price: ${tempMaxPrice}
                </label>
                <input
                  id="max-price"
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  //step="1"
                  value={tempMaxPrice}
                  onChange={handleMaxSliderChange}
                  onMouseUp={handleSliderRelease} // Trigger on mouse release
                  onTouchEnd={handleSliderRelease} // Support touch devices
                />
              </div>
            </div>
            <div className="mt-4">
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="form-select"
              >
                <option value="">Sort By Price</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
              </select>
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
                    <a href={`/menuitem/${item.id}`} className="text-decoration-none text-dark">
                      <h3 className="fw-bold my-2">{item.title}</h3>
                    </a>
                    <p className="text-secondary">It is a long established fact that a reader will be distracted.</p>
                    <h4 className="text-danger fw-bold">${parseFloat(item.price).toFixed(2)}</h4>
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
            <div className="d-flex justify-content-center mt-4">
              {previousPage && (
                <button
                  className="btn btn-danger mx-2"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>
              )}
              { renderPageNumbers()}
              {nextPage && (
                <button
                  className="btn btn-danger mx-2"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default Menu;
