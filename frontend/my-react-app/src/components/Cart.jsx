import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa'; // For the trash icon
import MyNavbar from './MyNavbar';
import MyFooter from './MyFooter';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchCartItems = async () => {
      // Retrieve the auth token from cookies
      const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));

      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return; // Exit if no token is found
      }

      const authToken = token.split('=')[1].trim(); // Trim any whitespace
      console.log('Auth Token:', authToken); // Log the token for verification

      try {
        const response = await fetch('http://localhost:8000/api/cart/menu-items', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text(); // Get response text for more information
          console.error('Error fetching cart items:', errorText); // Log error details
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const cartData = await response.json();
        console.log('Fetched Cart Items:', cartData.results); // Log the fetched data

        // Fetch menu details for each cart item
        const itemsWithDetails = await Promise.all(cartData.results.map(async item => {
          try {
            const menuResponse = await fetch(`http://localhost:8000/api/menu-items/${item.menuitem}`);
            if (!menuResponse.ok) {
              throw new Error(`Error fetching menu item ${item.menuitem}: ${menuResponse.status}`);
            }

            const menuItem = await menuResponse.json();
            return {
              id: item.menuitem, // Assuming menuitem is the ID
              name: menuItem.title, // Get the title from the menu item
              img: menuItem.image, // Get the image URL from the menu item
              price: parseFloat(menuItem.price), // Convert price to float
              quantity: item.quantity, // Keep track of quantity
            };
          } catch (error) {
            console.error('Error fetching menu item details:', error);
            return null; // In case of error, return null to filter out later
          }
        }));

        // Filter out any null values in case of errors
        setCartItems(itemsWithDetails.filter(item => item !== null));
      } catch (error) {
        console.error('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []); // Empty dependency array to run once on mount

  const handleQuantityChange = (id, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleRemoveItem = id => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <MyNavbar />
      <div className='container-fluid p-5 orders'>
        <div className='p-5 text-center text-danger'>
          <h1 className='font-weight-bold'>CART LIST</h1>
        </div>
      </div>
      <div className="container my-5">
        {loading ? ( // Show loading state
          <div className="text-center">Loading...</div>
        ) : (
          <div className="row">
            <div className="col-12">
              <table className="table .table-borderless text-center">
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td className='p-5'>
                        <img src={item.img} alt={item.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                      </td>
                      <td className='p-5'>{item.name}</td>
                      <td className='p-5'>${item.price.toFixed(2)}</td>
                      <td className='p-5'>
                        <button className="btn btn-light" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <span className="mx-2">{item.quantity}</span>
                        <button className="btn btn-light" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                      </td>
                      <td className='p-5'>${(item.price * item.quantity).toFixed(2)}</td>
                      <td className='p-5'>
                        <button className="btn btn-danger" onClick={() => handleRemoveItem(item.id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
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
            <button className="btn btn-danger w-100">Order</button>
          </div>
        </div>
      </div>
      <MyFooter />
    </>
  );
};

export default Cart;
