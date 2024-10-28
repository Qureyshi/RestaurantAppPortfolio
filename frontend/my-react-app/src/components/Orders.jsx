import React, { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('authToken='))
          ?.split('=')[1];
        
        const response = await fetch('http://localhost:8000/api/orders', {
          headers: {
            'Authorization': `Token ${authToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.results);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <MyNavbar />
      <div className="container-fluid p-5 orders mb-5">
        <div className="p-5 text-center text-danger">
          <h1 className="font-weight-bold">Orders</h1>
        </div>
      </div>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <div className="container">
          {orders.map((order) => (
            <div key={order.id} className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Order ID: {order.id}</h5>
                <p className="card-text"><strong>Date:</strong> {order.date}</p>
                <p className="card-text"><strong>Total:</strong> ${order.total}</p>
                <h6 className="card-subtitle mb-2 text-muted">Items:</h6>
                <ul className="list-group">
                  {order.orderitem.map((item, index) => (
                    <li key={index} className="list-group-item">
                      <strong>Menu Item ID:</strong> {item.menuitem}, 
                      <strong> Quantity:</strong> {item.quantity}, 
                      <strong> Price:</strong> ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
      <MyFooter />
    </>
  );
};

export default Orders;
