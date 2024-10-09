import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa'; // For the trash icon
import MyNavbar from './MyNavbar';
import MyFooter from './MyFooter';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Brick Oven Pepperoni', price: 18, quantity: 1, img: '/images/food1.jpg' },
    { id: 2, name: 'Cheese Hand-Pizza', price: 18, quantity: 1, img: '/images/food2.jpg' },
    { id: 3, name: 'Over Loaded Vegan', price: 18, quantity: 1, img: '/images/food3.jpg' },
    { id: 4, name: 'Chicken Leg Piece', price: 18, quantity: 1, img: '/images/food4.jpg' },
  ]);

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
      <div className="row">
        <div className="col-12">
          <table className="table  .table-borderless text-center">
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td className='p-5'>
                    <img src="" alt={item.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                  </td>
                  <td className='p-5'>{item.name}</td>
                  <td className='p-5'>${item.price}</td>
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