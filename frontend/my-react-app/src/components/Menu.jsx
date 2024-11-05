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
          <div className="col-lg-3">
            <h5 className='fw-bold'>CATEGORIES</h5>
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
          <div className="col-lg-9">
            <div className="row g-4">
              {menuData.map((item) => (
                <div className="col-lg-4 col-md-6" key={item.id}>
                  <div className="rounded p-2 overflow-hidden bg-light">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-fit-cover"
                      style={{ width: '100%', height: '250px' }}
                    />
                    <h3 className="fw-bold my-2">{item.title}</h3>
                    <p className='text-secondary'>It is a long established fact that a reader will be distracted.</p>
                    <h4 className="text-danger fw-bold">${parseFloat(item.price).toFixed(2)}</h4>
                    <a href={`/menuitem/${item.id}`} className='btn btn-danger mt-2'>ORDER NOW</a>
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
