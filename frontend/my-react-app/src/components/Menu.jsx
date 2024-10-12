import React, { useState, useEffect } from 'react';
// Make sure to include your CSS styles
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

const Menu = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch menu items from the API
  const fetchMenuData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/menu-items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data); // Log the API response to verify its structure

      // Set the results array to menuData
      setMenuData(data.results || []); // Ensure that data.results is an array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render menu items
  return (
    <>
    <MyNavbar />
    <div className='container-fluid p-5 orders'>
        <div className='p-5 text-center text-danger'>
          <h1 className='font-weight-bold'>MENU</h1>
        </div>
    </div>
    <div className="container py-5">
      <h1 className='text-center font-weight-bold'>Best selling Dishes</h1>
      <div className="d-flex justify-content-center my-3">
        <button className="btn btn-danger rounded-pill mx-2 active">Appetizers</button>
        <button className="btn btn-outline-danger rounded-pill mx-2">Soups</button>
        <button className="btn btn-outline-danger rounded-pill mx-2">Main courses</button>
        <button className="btn btn-outline-danger rounded-pill mx-2">Pizza</button>
        <button className="btn btn-outline-danger rounded-pill mx-2 dropdown-toggle">More</button>
      </div>
      <div className="row">
        {menuData.map((item) => {
          console.log(item); // Log the item to inspect its properties
          return (
            <>    
            <div className="col-3" key={item.id}>
              <div className="rounded bg-light py-3 mt-5 d-flex flex-column align-items-center text-center">
                    <img 
                        src={item.image} // Use the image field from the API response
                        alt={item.title} // Update alt text to use the title
                        className="rounded-circle"
                        style={{
                          width: '150px', // Set a fixed width
                          height: '150px', // Set a fixed height
                          objectFit: 'cover', // Ensures the image covers the entire box
                        }}  
                    />
                  <h4 className='mt-2'>{item.title}</h4>
                  <h6 className='mt-2 text-danger font-weight-bold'>${parseFloat(item.price).toFixed(2)}</h6>
                  <button className='btn btn-danger mt-2'>
                      Order Now
                  </button>
              </div>
            </div>


            </>
          );
        })}
        
      </div>
      

      
    </div>
    <div className='specialfood bg-danger'>
        <div className='container p-5'> .</div>
    </div>
    <MyFooter />
    </>
  );
};

export default Menu;
