import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import './Menu.css'; Make sure to include your CSS styles


const Sidebar = () => {
  return (
    <>
        <div className='col-2 bg-dark text-light'>
          <h1 className='text-light text-center p-5'>RMS</h1>
          <hr />
          <div className="a">
            <ul className='list-unstyled text-center'>
              <li className="p-3"><Link className='text-light' to="/admin/dashboard">Dashboard</Link></li>
              <li className="p-3"><Link className='text-light' to="/admin/orderlist">Orderlist</Link></li>
              <li className="p-3"><Link className='text-light' to="/admin/menu">Menu</Link></li>
              <li className="p-3"><Link className='text-light' to="/admin/reservations">Reservations</Link></li>
              <li className="p-3"><Link className='text-light' to="/admin/inventory">Inventory</Link></li>
            </ul>
          </div>
        </div>
    </>
  );
};

export default Sidebar;