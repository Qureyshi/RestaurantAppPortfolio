import React, { useState, useEffect } from 'react';
import MyFooter from './MyFooter';
import MyNavbar from './MyNavbar';
import { FaEye } from 'react-icons/fa';
import { Modal, Button, Dropdown } from 'react-bootstrap';


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

const OrderandReservation = () => {
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

  // order Pagination
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages available

   // Reservations Pagination
   const [reservations, setReservations] = useState([]); // Store list of reservations
   const [loading, setLoading] = useState(true); // Loading state for reservations
   const [reservationPage, setReservationPage] = useState(1); // Current page for reservations
   const [totalReservationPages, setTotalReservationPages] = useState(1); // Total number of pages available for reservations



  // User Role and Username
  const [userRole, setUserRole] = useState(null); // Role of the user (Admin, Manager, etc.)
  const [username, setUsername] = useState(null); // Logged-in username
  const [customer_username, setCustomerUsername] = useState(null); // Customer username
  const [bonus, setBonus] = useState(null);
  const [tip, setTip] = useState(null);

  const [showDiv, setShowDiv] = useState(1);

  const itemsPerPage = 6;

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

    const CustomerUsername = async (user_id) => {
      try {
        const authToken = getTokenFromCookies();
        if (!authToken) throw new Error('Authentication token not found.');

        const response = await fetch('http://127.0.0.1:8000/auth/users', {
          headers: { Authorization: `Token ${authToken}` },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error('Unauthorized access.');
          throw new Error('Failed to fetch user role.');
        }

        const data = await response.json();

        if (data.id === orders.user) {
          setCustomerUsername(data.username);
        }        

      } catch (err) {
        console.error('Error fetching username:', err);
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
        setUsername(data.username);
        setBonus(data.bonus_earned);
        setTip(data.tip);

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

  return (
    <>
      <div>
        <MyNavbar />

        <main className="container  min-h my-5 py-5" >






        <div className="mb-4">
                <button 
                    className={`btn btn-danger me-3 ${showDiv === 1 ? 'active' : ''}`}
                    onClick={() => setShowDiv(1)}
                >
                    Your Reservations
                </button>
                <button 
                    className={`btn btn-danger ${showDiv === 2 ? 'active' : ''}`}
                    onClick={() => setShowDiv(2)}
                >
                    Order List
                </button>
                
            </div>
            <h6>Bonus: {bonus}</h6>
            {userRole !== 'Customer' && ( 
              <h6>Tip: {tip}</h6>  
            )}

            {/* Divs Section */}
            <div className="text-center">
                {showDiv === 1 && (
                   <div>
                    <h2 className='fw-bold mb-4'>Your Reservations</h2>
                   {loading ? (
                     <div>Loading your reservations...</div>
                   ) : (
                     reservations.length > 0 ? (
                     <div className='overflow-scroll'>
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
                     </div>
                     ) : (
                       <p>You have no reservations.</p>
                     )
                   )}
                   { reservations.length > 0 && totalReservationPages > 1   ? ( <div className="d-flex justify-content-center align-items-center my-5">
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
                   </div>) : null }
                    </div>
                )}

                {showDiv === 2 && (
                    <div>
                      <h2 className="mb-4">Order List</h2>
                      {error && <div className="alert alert-danger">{error}</div>}
                      {orders.length === 0 ? (
                        <p>No orders found.</p>
                      ) : (
                      <div className='overflow-scroll'>
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Customer Name</th>
                              <th>Delivery Crew</th>
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
                                <td>{order.user.username}</td>
                                <td>
                                  {userRole === 'Admin' || userRole === 'Manager' ? (
                                    <Dropdown onSelect={(crewId) => handleAssignDeliveryCrew(order.id, crewId)}>
                                      <Dropdown.Toggle variant="primary" size="sm" id="dropdown-crew">
                                        {order.delivery_crew
                                          ? deliveryCrewOptions.find(crew => crew.id === order.delivery_crew)?.username
                                          : 'Assign Crew'}
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        {deliveryCrewOptions.map(crew => (
                                          <Dropdown.Item key={crew.id} eventKey={crew.id}>
                                            {crew.username}
                                          </Dropdown.Item>
                                        ))}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  ) : (
                                    order.delivery_crew
                                      ? deliveryCrewOptions.find(crew => crew.id === order.delivery_crew)?.username
                                      : 'Unassigned'
                                  )}
                               </td>
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
                      </div>
                      )}

                      {/* Pagination Controls */}
                      {orders.length > 0 && totalPages > 1 ? (
                      <div className="d-flex justify-content-center align-items-center my-5">
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
                      </div>) : null }
                      
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
                )}
            </div>
        </main>
        <MyFooter />
      </div>
    </>
  );
};

export default OrderandReservation;              











