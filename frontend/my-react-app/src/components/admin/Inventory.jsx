import React, { useState } from 'react';

const Inventory = () => {
  const [menuData, setMenuData] = useState([
    { id: 1, title: 'Burger', amount: 10, featured: true, category: 'Main Course' },
    { id: 2, title: 'Fries', amount: 20, featured: false, category: 'Sides' },
    { id: 3, title: 'Salad', amount: 15, featured: true, category: 'Appetizers' },
    { id: 4, title: 'Pizza', amount: 5, featured: false, category: 'Main Course' },
  ]);

  const [newMenuItem, setNewMenuItem] = useState({
    title: '',
    amount: '',
    featured: false,
    category: '',
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem({ ...newMenuItem, [name]: value });
  };

  // Handle form submission to add a new menu item
  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: menuData.length + 1, // Simulating unique ID generation
      ...newMenuItem,
    };
    setMenuData([...menuData, newItem]);
    setNewMenuItem({ title: '', amount: '', featured: false, category: '' });
  };

  // Render form and menu items
  return (
    <>
      <div className='bg-light shadow-lg p-4'> 
        <h1>Inventory</h1>
      </div>

      {/* Add new menu item form */}
      <div className="container mt-5">
        <h2>Add to Inventory</h2>
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
            <label>Amount</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              value={newMenuItem.amount}
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
          <button type="submit" className="btn btn-primary">Add to Inventory</button>
        </form>

        {/* Menu table */}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Amount</th>
              <th scope="col">Featured</th>
              <th scope="col">Category</th>
            </tr>
          </thead>
          <tbody>
            {menuData.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.title}</td>
                <td>{item.amount}</td>
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

export default Inventory;