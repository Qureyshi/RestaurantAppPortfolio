import React, { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import { FaEye } from 'react-icons/fa';
import { Modal, Button, Dropdown } from 'react-bootstrap';
import './Orders.css';

const getTokenFromCookies = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  return token ? token.split('=')[1].trim() : null;
};

// Define getStatusBadge here
const getStatusBadge = (status) => {
  const statusClasses = {
    READY: 'bg-success',
    DELIVERED: 'bg-success',
    CANCELLED: 'bg-danger',
    PENDING: 'bg-warning text-dark',
  };

  return <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>{status}</span>;
};

const Orders = () => {
  // Orders Data and User Information
  const [orders, setOrders] = useState([]); // Store list of orders
  const [selectedOrder, setSelectedOrder] = useState(null); // Currently selected order for modal
  const [deliveryCrewOptions, setDeliveryCrewOptions] = useState([]); // Delivery crew options for assignment dropdown

  // UI and Modal Controls
  const [showModal, setShowModal] = useState(false); // Show/hide modal
  const [editingOrderId, setEditingOrderId] = useState(null); // Order ID being edited

  // Loading and Error States
  const [error, setError] = useState(null); // Error message if any
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false); // Loading state for updating order status
  const [deliveryCrewLoading, setDeliveryCrewLoading] = useState(false); // Loading state for fetching delivery crew

  // Orders Pagination
  const [page, setPage] = useState(1); // Current page for orders
  const [totalPages, setTotalPages] = useState(1); // Total number of pages available for orders

  // Reservations Pagination
  const [reservations, setReservations] = useState([]); // Store list of reservations
  const [loading, setLoading] = useState(true); // Loading state for reservations
  const [reservationPage, setReservationPage] = useState(1); // Current page for reservations
  const [totalReservationPages, setTotalReservationPages] = useState(1); // Total number of pages available for reservations

  // User Role and Username
  const [userRole, setUserRole] = useState(null); // Role of the user (Admin, Manager, etc.)
  const [username, setUsername] = useState(null); // Logged-in username
  const [customer_username, setCustomerUsername] = useState(null); // Customer username

  const itemsPerPage = 8; // Items per page for orders and reservations

  useEffect(() => {
    const fetchOrders = async (page) => {
      try {
        const authToken = getTokenFromCookies();
        const response = await fetch(`http://localhost:8000/api/orders?page=${page}&ordering=-date`, {
          headers: { Authorization: `Token ${authToken}` },
        });

        if (!response.ok) throw new Error('Failed to fetch orders.');

        const data = await response.json();
        setOrders(data.results ?? []);
        setTotalPages(Math.ceil(data.count / itemsPerPage));
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUserRole = async () => {
      try {
        const authToken = getTokenFromCookies();
        const response = await fetch('http://127.0.0.1:8000/auth/users/me', {
          headers: { Authorization: `Token ${authToken}` },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized access.');
          throw new Error('Failed to fetch user role.');
        }

        const data = await response.json();
        setUsername(data.username);

        const role = data.groups.includes(1)
          ? 'Manager'
          : data.groups.includes(2)
          ? 'Delivery Crew'
          : data.is_staff
          ? 'Admin'
          : 'Customer';

        setUserRole(role);
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err.message);
      }
    };

    const fetchDeliveryCrewOptions = async () => {
      try {
        const authToken = getTokenFromCookies();
        const response = await fetch('http://localhost:8000/api/groups/delivery-crew/users', {
          headers: { Authorization: `Token ${authToken}` },
        });

        if (!response.ok) throw new Error('Failed to fetch delivery crew options.');

        const data = await response.json();
        setDeliveryCrewOptions(data.map(crew => ({ id: crew.id, username: crew.username }))); // Include username
      } catch (err) {
        console.error('Error fetching delivery crew:', err);
        setError(err.message);
      }
    };

    const fetchReservations = async (page) => {
      const authToken = getTokenFromCookies();
      if (!authToken) {
        console.error('Authorization token is missing.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/reservations?page=${page}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setReservations(data.results || []);
        setTotalReservationPages(Math.ceil(data.count / itemsPerPage)); // Calculate total pages for reservations
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(page);
    fetchUserRole();
    fetchDeliveryCrewOptions(); 
    fetchReservations(reservationPage); // Fetch reservations for the current page    
  }, [page, reservationPage, userRole]);

  const allowedRoles = ['Admin', 'Manager', 'Delivery Crew'];

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleAssignDeliveryCrew = async (orderId, deliveryCrewId) => {
    const authToken = getTokenFromCookies();
    try {
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delivery_crew: deliveryCrewId }),
      });

      if (!response.ok) throw new Error('Failed to assign delivery crew.');

      // Update the orders state immediately to reflect the change
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId 
            ? { ...order, delivery_crew: parseInt(deliveryCrewId)}
            : order
    ));
    } catch (err) {
      setError(err.message);    
    } 
  }

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
      setEditingOrderId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  const handleReservationPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalReservationPages) setReservationPage(newPage);
  };

  // Log the props at the start of the component
  console.log('User Role:', userRole);
  console.log('Order:', orders);
  console.log('Delivery Crew Options:', deliveryCrewOptions);

  return (
    <>
      <div className="content-wrapper">
        <MyNavbar />
        <div className="container mt-5">
          <h2 className='fw-bold'>Your Reservations</h2>
          {loading ? (
            <div>Loading your reservations...</div>
          ) : (
            reservations.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Guests</th>
                    <th>Phone</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation, index) => (
                    <tr key={index} className="reservation-item">
                      <td>{reservation.date}</td>
                      <td>{reservation.time}</td>
                      <td>{reservation.number_of_guests}</td>
                      <td>{reservation.phone_number}</td>
                      <td>{reservation.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>You have no reservations.</p>
            )
          )}
          <div className="pagination-controls">
            <button
              className="btn btn-secondary me-2"
              disabled={reservationPage <= 1}
              onClick={() => handleReservationPageChange(reservationPage - 1)}
            >
              Previous
            </button>
            <span>Page {reservationPage} of {totalReservationPages}</span>
            <button
              className="btn btn-secondary ms-2"
              disabled={reservationPage >= totalReservationPages}
              onClick={() => handleReservationPageChange(reservationPage + 1)}
            >
              Next
            </button>
          </div>

          <h2 className='fw-bold mt-5'>Your Orders</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                {allowedRoles.includes(userRole) && <th>Delivery Crew</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  {allowedRoles.includes(userRole) && (
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {order.delivery_crew ? deliveryCrewOptions.find(crew => crew.id === order.delivery_crew)?.username : 'Select Crew'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {deliveryCrewOptions.map(crew => (
                            <Dropdown.Item key={crew.id} onClick={() => handleAssignDeliveryCrew(order.id, crew.id)}>
                              {crew.username}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  )}
                  <td>
                    <button className="btn btn-info" onClick={() => handleShowDetails(order)}>
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button
              className="btn btn-secondary me-2"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="btn btn-secondary ms-2"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedOrder && (
                <div>
                  <h5>Order ID: {selectedOrder.id}</h5>
                  <p><strong>Items:</strong></p>
                  <ul>
                    {selectedOrder.items.map(item => (
                      <li key={item.id}>{item.name} - Quantity: {item.quantity}</li>
                    ))}
                  </ul>
                  <p><strong>Total Price:</strong> ${selectedOrder.total_price}</p>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              {allowedRoles.includes(userRole) && (
                <>
                  <Button variant="danger" onClick={() => handleStatusChange(selectedOrder.id, 'CANCELLED')}>
                    Cancel Order
                  </Button>
                  <Button variant="success" onClick={() => handleStatusChange(selectedOrder.id, 'DELIVERED')}>
                    Mark as Delivered
                  </Button>
                </>
              )}
            </Modal.Footer>
          </Modal>
        </div>
        <MyFooter />
      </div>
    </>
  );
};

export default Orders;
