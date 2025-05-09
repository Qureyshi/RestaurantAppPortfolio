import React, { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

// Mock category and menu data
const mockCategories = [
  { id: 1, title: 'Pizza' },
  { id: 2, title: 'Burgers' },
  { id: 3, title: 'Desserts' },
];

const mockMenuItems = [
  { id: 1, title: 'Cheese Pizza', category: 1, price: 25, image: '/images/cheesepizza.jpg' },
  { id: 2, title: 'Pepperoni Pizza', category: 1, price: 30, image: '/images/peperoni.jpg' },
  { id: 3, title: 'Classic Burger', category: 1, price: 20, image: '/images/burger1.jpg' },
  { id: 4, title: 'Cheeseburger', category: 1, price: 22, image: '/images/burger2.jpg' },
  { id: 5, title: 'Chocolate Cake', category: 3, price: 15, image: '/images/cake1.jpg' },
  { id: 6, title: 'Ice Cream Sundae', category: 3, price: 18, image: '/images/icecream.jpg' },
  { id: 7, title: 'Veg Pizza', category: 1, price: 28, image: '/images/veg.jpg' },
  { id: 8, title: 'Chicken Burger', category: 1, price: 24, image: '/images/burger3.jpg' },
  { id: 3, title: 'Classic Burger', category: 2, price: 20, image: '/images/burger1.jpg' },
  { id: 4, title: 'Cheeseburger', category: 2, price: 22, image: '/images/burger2.jpg' },
  // Add more items if needed
];

const Menu = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [nextPage, setNextPage] = useState(false);
  const [previousPage, setPreviousPage] = useState(false);

  const handleMinSliderChange = (e) => {
    const value = Math.min(e.target.value, tempMaxPrice);
    setTempMinPrice(value);
  };

  const handleMaxSliderChange = (e) => {
    const value = Math.max(e.target.value, tempMinPrice);
    setTempMaxPrice(value);
  };

  const handleSliderRelease = () => {
    setPriceRange({ min: tempMinPrice, max: tempMaxPrice });
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    setPriceRange({ min: 0, max: 100 });
    setTempMinPrice(0);
    setTempMaxPrice(100);
    setSearchQuery('');
    setSortOrder('');
  };

  const handleAddToCart = (menuItemId, quantity) => {
    console.log(`Add to cart: item ${menuItemId} x ${quantity}`);
    // Stub logic - you can connect to cart context or localStorage if needed
  };

  useEffect(() => {
    setCategoryData(mockCategories);

    let filtered = mockMenuItems.filter(
      (item) =>
        item.category === activeCategory &&
        item.price >= priceRange.min &&
        item.price <= priceRange.max &&
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === '-price') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const itemsPerPage = 6;
    const total = filtered.length;
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(start, start + itemsPerPage);

    setMenuData(paginatedItems);
    setTotalPages(Math.ceil(total / itemsPerPage));
    setNextPage(currentPage < Math.ceil(total / itemsPerPage));
    setPreviousPage(currentPage > 1);
  }, [activeCategory, currentPage, searchQuery, sortOrder, priceRange]);

  const renderPageNumbers = () => {
    if (totalPages === 1) return null;
    const pages = [];
    const range = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
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
                  value={tempMinPrice}
                  onChange={handleMinSliderChange}
                  onMouseUp={handleSliderRelease}
                  onTouchEnd={handleSliderRelease}
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
                  value={tempMaxPrice}
                  onChange={handleMaxSliderChange}
                  onMouseUp={handleSliderRelease}
                  onTouchEnd={handleSliderRelease}
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
                    <a href={`/menuitem/1`} className="text-decoration-none text-dark">
                      <h3 className="fw-bold my-2">{item.title}</h3>
                    </a>
                    <p className="text-secondary">It is a long established fact that a reader will be distracted.</p>
                    <h4 className="text-danger fw-bold">${item.price.toFixed(2)}</h4>
                    <button
                      className="btn btn-danger mt-2"
                      onClick={() => handleAddToCart(item.id, 1)}
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
              {renderPageNumbers()}
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
