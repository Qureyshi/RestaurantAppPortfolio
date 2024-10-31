import React, { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import { FaEye } from 'react-icons/fa';
import { Modal, Button, Dropdown } from 'react-bootstrap';

const getTokenFromCookies = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  return token ? token.split('=')[1].trim() : null;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null); // State for username

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authToken = getTokenFromCookies();
        const response = await fetch('http://localhost:8000/api/orders', {
          headers: { Authorization: `Token ${authToken}` },
        });

        if (!response.ok) throw new Error('Failed to fetch orders.');

        const data = await response.json();
        setOrders(data.results ?? []);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUserRole = async () => {
      try {
        const authToken = getTokenFromCookies();
        if (!authToken) throw new Error('Authentication token not found.');

        const response = await fetch('http://127.0.0.1:8000/auth/users/me', {
          headers: { Authorization: `Token ${authToken}` },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized access.');
          throw new Error('Failed to fetch user role.');
        }

        const data = await response.json();
        setUsername(data.username); // Assign username from the fetched data

        const role = data.groups.includes(1)
          ? 'Manager'
          : data.groups.includes(2)
          ? 'Delivery Crew'
          : data.is_staff
          ? 'Admin'
          : 'User';

        setUserRole(role);
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err.message);
      }
    };

    fetchOrders();
    fetchUserRole();
  }, []);

  const allowedRoles = ['Admin', 'Manager', 'Delivery Crew'];

  const getStatusBadge = (status) => {
    const statusClasses = {
      READY: 'bg-success',
      DELIVERED: 'bg-success',
      CANCELLED: 'bg-danger',
      PENDING: 'bg-warning text-dark',
    };
    
    return <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>{status}</span>;
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdateLoading(true);
    const authToken = getTokenFromCookies();
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status.');

      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setEditingOrderId(null); // Reset after updating
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  return (
    <>
      <MyNavbar />
      <div className="container mt-5">
        <h2 className="mb-4">Order List</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Delivery Crew</th> {/* New Delivery Crew field */}
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  <td>{username}</td> {/* Display username here */}
                  <td>{order.delivery_crew}</td> {/* Display Delivery Crew name */}
                  <td>${order.total}</td>
                  <td>
                    {editingOrderId === order.id && allowedRoles.includes(userRole) ? (
                      <Dropdown onSelect={(newStatus) => handleStatusChange(order.id, newStatus)}>
                        <Dropdown.Toggle variant="primary" size="sm" id="dropdown-status">
                          {order.status}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {['PENDING', 'READY', 'DELIVERED', 'CANCELLED'].map(status => (
                            <Dropdown.Item key={status} eventKey={status}>{status}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      getStatusBadge(order.status)
                    )}
                  </td>
                  <td>
                    <FaEye style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => handleShowDetails(order)} />
                    {allowedRoles.includes(userRole) && (
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => setEditingOrderId(order.id)}
                      >
                        Edit Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Order #{selectedOrder.id} Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Order Items</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderitem.map(item => (
                    <tr key={item.menuitem.id}>
                      <td>{item.menuitem.title}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p><strong>Total:</strong> ${selectedOrder.total}</p>
              <h5>Status</h5>
              <p>{selectedOrder.status}</p>
              {statusUpdateLoading && <p>Updating status...</p>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
      <MyFooter />
    </>
  );
};

export default Orders;
