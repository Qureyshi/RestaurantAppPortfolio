import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import MyNavbar from './MyNavbar';
import MyFooter from './MyFooter';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderError, setOrderError] = useState(null); // State for handling order errors

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));

      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const authToken = token.split('=')[1].trim();

      try {
        const response = await fetch('http://localhost:8000/api/cart/menu-items', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cartData = await response.json();
        setCartItems(cartData.results);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleOrder = async () => {
    setOrderError(null);
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));

    if (!token) {
      console.error('No auth token found');
      return;
    }

    const authToken = token.split('=')[1].trim();

    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const orderData = await response.json();
      console.log('Order created successfully:', orderData);

      // Clear the cart after ordering
      setCartItems([]);
    } catch (error) {
      setOrderError(error.message);
      console.error('Error creating order:', error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

  return (
    <>
      <MyNavbar />
      <div className='container-fluid p-5 orders'>
        <div className='p-5 text-center text-danger'>
          <h1 className='font-weight-bold'>CART LIST</h1>
        </div>
      </div>
      <div className="container my-5">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="row">
            <div className="col-12">
              <table className="table .table-borderless text-center">
                <tbody>
                  {cartItems.map(item => {

                    const unitPrice = parseFloat(item.unit_price) || 0;

                    return (
                      <tr key={item.menuitem.id}>
                        <td className='p-5'>
                          <img src={item.menuitem.image} alt={item.menuitem.title} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                        </td>
                        <td className='p-5'>{item.menuitem.title}</td>
                        <td className='p-5'>${unitPrice.toFixed(2)}</td>
                        <td className='p-5'>{item.quantity}</td>
                        <td className='p-5'>${(unitPrice * item.quantity).toFixed(2)}</td>
                        <td className='p-5'>
                          <button className="btn btn-danger" onClick={() => handleRemoveItem(item.menuitem.id)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cart Totals */}
        <div className="row">
          <div className="col-md-3 offset-md-9">
            <table className="table">
              <tbody>
                <tr>
                  <td>Cart Subtotal</td>
                  <td>${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Order Total</td>
                  <td>${subtotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <button className="btn btn-danger w-100" onClick={handleOrder}>Order</button>
            {orderError && <div className="text-danger mt-2">{orderError}</div>}
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default Cart;
