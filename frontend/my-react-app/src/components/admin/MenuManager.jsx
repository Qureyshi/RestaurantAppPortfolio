import React, { useState, useEffect } from 'react';

const MenuManager = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New state for form fields
  const [newMenuItem, setNewMenuItem] = useState({
    title: '',
    price: '',
    featured: false,
    category: '',
  });

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

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem({ ...newMenuItem, [name]: value });
  };

  // Handle form submission to add a new menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMenuItem),
      });
      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }
      const addedItem = await response.json();
      
      // Update the menuData state with the new item
      setMenuData((prevMenuData) => [...prevMenuData, addedItem]);
      
      // Clear form fields
      setNewMenuItem({ title: '', price: '', featured: false, category: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render form and menu items
  return (
    <>
      <div className='bg-light shadow-lg p-4'> 
        <h1>Menu Manager</h1>
      </div>

      {/* Add new menu item form */}
      <div className="container mt-5">
        <h2>Add New Menu Item</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={newMenuItem.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={newMenuItem.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Featured</label>
            <select
              className="form-control"
              name="featured"
              value={newMenuItem.featured}
              onChange={handleInputChange}
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={newMenuItem.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Menu Item</button>
        </form>

        {/* Menu table */}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Price</th>
              <th scope="col">Featured</th>
              <th scope="col">Category</th>
            </tr>
          </thead>
          <tbody>
            {menuData.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.featured ? 'Yes' : 'No'}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MenuManager;